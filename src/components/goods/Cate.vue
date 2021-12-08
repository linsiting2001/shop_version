<template>
  <div>
      <!-- 面包屑视图区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
        <!-- 添加角色按钮 -->
        <el-row>
            <el-col>
                <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
            </el-col>
        </el-row>
        <!-- table视图区 -->
        <tree-table :data="cateList" :columns="columns" :selection-type="false" 
        :expand-type="false" show-index index-text="#" border :show-row-hover="false" class="treeTable">
            <!-- 是否有效 -->
            <template slot="isok" slot-scope="scope">
                <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
                <i class="el-icon-error" v-else style="color:red"></i>
            </template>
            <!-- 排序 -->
            <template slot="order" slot-scope="scope">
                <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
                <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                <el-tag type="warning" size="mini" v-else>三级</el-tag>
            </template>
            <!-- 操作 -->
            <template slot="opt" slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="ShowEditCateDialog(scope.row.cat_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini"  @click="removeUserById(scope.row.cat_id)">删除</el-button>  
            </template>
        </tree-table>
        <!-- pagination分页区域 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[3, 5, 10, 15]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <!-- 添加分类的对话框 -->
        <template>
            <el-dialog
            title="添加分类"
            :visible.sync="AddCateDialogVisible"
            width="50%"
            @close="addCateDialogClose">
                <el-form ref="addCateFormRef" :model="addCateForm" label-width="100px" :rules="addCateFormRules">
                    <el-form-item label="分类名称" prop="cat_name">
                        <el-input v-model="addCateForm.cat_name"></el-input>
                    </el-form-item>
                    <el-form-item label="父级分类">
                        <!-- 级联组件 -->
                        <!-- options 用来指定数据源 -->
                        <!-- props 用来指定配置对象 -->
                        <el-cascader
                        v-model="selectKeys"
                        :options="parentCateList"
                        expand-trigger="hover"
                        :props="cascaderProps"
                        clearable
                        change-on-select
                        @change="parentCateChanged">
                        </el-cascader>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="AddCateDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addCate">确 定</el-button>
                </span>
            </el-dialog>
        </template>
        <!-- 编辑对话框 -->
        <el-dialog
        title="修改分类"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose">
            <el-form :model="editForm" ref="editFormRef" :rules="addCateFormRules" label-width="70px">
                <el-form-item label="分类名称">
                    <el-input v-model="editForm.cat_name" prop="cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </span>
        </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
    data() {
        return {
            // 商品分类的数据列表，默认为空
            cateList: [],
            // 总数据条数
            total: 0,
            // 控制添加对话框的现实和隐藏
            AddCateDialogVisible: false,
            editDialogVisible: false,
            // 添加表单的数据对象
            addCateForm: {
                // 将要添加分类的名称
                cat_name: '',
                // 父级分类的id
                cat_pid: 0,
                // 分类的等级，默认要添加的是一级分类
                cat_level: 0
            },
            editForm: {

            },
            // 查询数据对象
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize:5
            },
            // 为tabel指定列的定义
            columns: [
                {
                    label: '分类名称',
                    prop: 'cat_name',
                },
                {
                    label:"是否有效",
                    // 表示当前列将定义为模板列
                    type: 'template',
                    // 表示当前这一列使用的模板名称
                    template: 'isok'
                },
                {
                    label:"排序",
                    // 表示当前列将定义为模板列
                    type: 'template',
                    // 表示当前这一列使用的模板名称
                    template: 'order'
                },
                {
                    label: '操作',
                    // 表示当前列将定义为模板列
                    type: 'template',
                    // 表示当前这一列使用的模板名称
                    template: 'opt'
                },
            ],
            // 父级分类的列表
            parentCateList: [],
            // 指定级联选择器的配置对象 是一个对象
            cascaderProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
            },
            // 选中的父级分类的ID数组
            selectKeys: [],
            // 添加分类表单的验证规则对象
            addCateFormRules: {
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ],
            },
            addFormRules: {
                // username password的校验规则是官方给出的
                cat_name: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                ],
            }
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        // 获取数据分类数据 涉及分页
        async getCateList() {
            const {data: res} = await this.$http.get('categories', {params: this.queryInfo})
            // console.log(res)
            if(res.meta.status !== 200) return this.$message.error("获取商品分类数据失败!")
            // 把数据列表赋值给 cateList
            this.cateList = res.data.result
            // 为总数据条数赋值
            this.total = res.data.total
        },
        // 监听 pageSize 改变
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getCateList()
        },
        // 监听 pagenum 改变
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getCateList()
        },
        // 点击按钮，展示添加分类对话框
        showAddCateDialog(){
            // 先获取父级分类的数据列表
            this.getParentsCateList()
            // 展示对话框
            this.AddCateDialogVisible = true          
        },
        // 获取父级分类的数据列表
        async getParentsCateList() {
            const {data:res} = await this.$http.get('categories', {params: {type:2}})
            if(res.meta.status !== 200) {
                return this.$message.error("获取父级分类数据失败!")
            }
            this.parentCateList = res.data
            // console.log(this.parentCateList)
        },
        // 选择项发生变化触发这个函数
        parentCateChanged() {
            // 这个是级联框的显示内容
            console.log(this.selectKeys)
            // 如果selectedkeys 数组中的length 大于0， 证明选中了父级分类
            // 反之，就说明没有选中任何父级分类
            if(this.selectKeys.length > 0){
                // 父级分类的id
                this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
                // 为当前的分类等级赋值
                this.addCateForm.cat_level = this.selectKeys.length
                return
            }else{
                // 父级分类的id
                this.addCateForm.cat_pid = 0
                // 为当前的分类等级赋值
                this.addCateForm.cat_level = 0
                return
            }
        },
        // 点击确认按钮，添加新的分类
        addCate() {
            // console.log(this.addCateForm)
            this.$refs.addCateFormRef.validate(async valid => {
                if(!valid) return
                const {data: res} = await this.$http.post('categories',this.addCateForm)
                if(res.meta.status !== 201) {
                    return this.$message.error("添加分类失败！")
                }
                this.$message.success('添加分类成功！')
                this.getCateList()
                this.AddCateDialogVisible = false
            })
        },
        // 监听对话框的关闭事件，重复表单数据
        addCateDialogClose(){
            this.$refs.addCateFormRef.resetFields()
            this.selectKeys = []
            // 父级分类的id
            this.addCateForm.cat_pid = 0
            // 为当前的分类等级赋值
            this.addCateForm.cat_level = 0
        },
        // 修改用户的预验证功能 点击按钮，添加新用户
        editUser() {
            // 修改表单的预验证
            this.$refs.editFormRef.validate(async valid => {
                if(!valid) return
                // 发起用户修改信息的请求put
                const {data: res} = await this.$http.put("categories/" + this.editForm.cat_id, {cat_name: this.editForm.cat_name})
                if(res.meta.status !== 200) return this.$message.error("修改分类信息失败!")
                this.editDialogVisible = false
                this.getCateList()
                this.$message.success("修改分类信息成功!")
            })
        },
        // 点击修改按钮，显示修改对话框
        async ShowEditCateDialog(id) {
            // console.log(id)
            // 根据id查询用户信息并且返回
            const {data:res} = await this.$http.get('categories/' + id)
            if(res.meta.status !== 200) {
                return this.$message.error('查询分类信息失败!')
            }
            this.editForm = res.data
            this.editDialogVisible = true
        },
        // 监听修改用户对话框的关闭事件
        editDialogClose() {
            this.$refs.editFormRef.resetFields()
        },
        // 根据id删除对应的用户信息
        async removeUserById(id) {
            // console.log(id)
            // 弹框 确认是否删除
            const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => {return err})
            // 如果用户确认删除，则返回值为字符串 confirm
            // 如果用户取消删除，则返回值为字符串 cancel
            // console.log(confirmResult)
            if(confirmResult !== 'confirm'){
                return this.$message.info('已取消删除')
            }
            // console.log("确认了删除")
            // 点击按钮删除用户的业务逻辑实现 发起一个请求删除数据 delete
            const {data: res} = await this.$http.delete('categories/' + id)
            // console.log(res)
            if(res.meta.status !== 200) {
                return this.$message.error("删除分类失败!")
            }
            // $message不用手动挂载就可以使用
            this.$message.success("删除分类成功!")
            this.getCateList()
        },
    }
}
</script>

<style lang="less" scoped>
.treeTable{
    margin-top: 15px;
}
.el-cascader {
    width: 100%;
}
</style>