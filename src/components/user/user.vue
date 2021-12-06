<template>
  <div>
        <!-- breadcrumb面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- card卡片视图区 -->
        <el-card class="box-card">
            <!-- layout布局 分栏间隔 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <!-- input搜索与添加区域 clearable -->
                    <!-- 搜索功能的实现 -->
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- table用户列表区 -->
            <el-table :data="usersList" border stripe>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <!-- 状态列按钮按需使用 -->
                    <!-- 作用域插槽的使用？？接收scope 通过scope.row放回一条数据的具体信息 作用域插槽会覆盖prop-->
                    <template slot-scope="scope">
                        <!-- {{scope.row}} -->
                        <!-- switch开关组件 -->
                        <el-switch v-model="scope.row.mg_state" @change="userStateChaged(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <!-- {{scope.row}} -->
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                        <!-- 分配角色按钮 -->
                        <!-- tooltip消息的提示 -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- pagination分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加用户对话框 -->
        <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClose">
            <!-- 内容主题区 -->
            <!-- :model数据绑定对象  :rules规则绑定事件 pro数据规则的绑定-->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>

            <!-- 底部区 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户的对话框 -->
        <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose">
            <el-form :model="editForm" ref="editFormRef" :rules="editFormRules" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配角色对话框 -->
        <el-dialog
        title="分配角色"
        :visible.sync="setRoleDialogVisible"
        width="50%"
        @close="setRoleDialogClose">
            <div>
                <p>当前的用户: {{userInfo.username}}</p>
                <p>当前的角色: {{userInfo.role_name}}</p>
                <p>分配新角色:
                    <el-select v-model="SelectedRoleId" placeholder="请选择">
                        <el-option
                        v-for="item in rolesList"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
        </el-dialog>
  </div>
</template>

<script>
export default {
    data () {
        // 验证邮箱的规则
        var checkEmail = (rule,value,callback) => {
            // 验证邮箱的正则表达式
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if(regEmail.test(value)) {
                // 合法的邮箱
                return callback()
            }
            callback(new Error('请输入合法的邮箱'))
        }
        // 验证手机的规则
        var checkMobile = (rule,value,callback) => {
            // 验证手机的正则表达式
            const regMobile = /^(0|86|17951|)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if(regMobile.test(value)) {
                // 合法的邮箱
                return callback()
            }
            callback(new Error('请输入合法的手机号'))
        }
        return {
            // 获取用户列表的参数
            queryInfo:{
                query: '',
                // 当前的页数
                pagenum: 1,
                // 当前页数的信息条数
                pagesize: 2
            },
            usersList: [],
            // 所有角色的数据列表
            rolesList: [],
            // 已选中的角色的id值
            SelectedRoleId: '',
            total: 0,
            // 是否隐藏添加用户列表对话框
            addDialogVisible: false,
            // 修改对话框的隐藏和显示
            editDialogVisible: false,
            // 是否显示分配角色的对话框
            setRoleDialogVisible: false,
            // 添加用户的表单数据
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            // 需要被分配角色的用户信息
            userInfo: {

            },
            // 查询用户的表单数据
            editForm: {

            },
            // 添加表单的验证规则对象 prop
            addFormRules: {
                // username password的校验规则是官方给出的
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                 password: [
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ],
                // email mobile的校验规则需要自定义
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    {validator: checkEmail, trigger: 'blur'}
                ],
                mobile: [   
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                    {validator: checkMobile, trigger: 'blur'}
                ]
            },
            // 修改表单的验证规则对象 prop
            editFormRules: {
               // email mobile的校验规则需要自定义
                email: [
                    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
                    {validator: checkEmail, trigger: 'blur'}
                ],
                mobile: [   
                    { required: true, message: '请输入用户手机', trigger: 'blur' },
                    {validator: checkMobile, trigger: 'blur'}
                ] 
            }
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        // 用户列表数据的获取
        async getUserList() {
            // get('users', {params:{}})
            const {data: res} = await this.$http.get('users', {params:this.queryInfo})
            if(res.meta.status !== 200) return this.$message.error("获取用户列表失败！");
            console.log(res)
            this.usersList = res.data.users
            this.total = res.data.total
        },
        // 监听pagesize改变的事件
        handleSizeChange(newSize) {
            // console.log(newSize)
            // 显示不同的页码数
            this.queryInfo.pagesize =newSize
            this.getUserList()
        },
        // 监听页码值发生改变的事件
        handleCurrentChange(newPage) {
            // console.log(newPage)
            // 根据页码显示不同的数据
            this.queryInfo.pagenum = newPage
            this.getUserList()
        },
        // 监听 switch 开关状态的改变
        async userStateChaged(userinfo) {
            // console.log(userInfo)
            const {data: res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            console.log(res)
            if(res.meta.status !== 200) {
                userinfo.mg_state = !userinfo.mg_state
                return this.$message.error('更新用户数据失败!')
            }
            this.$message.success('更新用户状态成功!')
        },
        // 监听添加用户对话框的关闭事件
        addDialogClose() {
            // 对表单进行重置
            this.$refs.addFormRef.resetFields()
        },
        // 添加用户的预验证功能 点击按钮，添加新用户
        addUser() {
            // 对表单进行预处理validate
            this.$refs.addFormRef.validate(async valid => {
                // console.log(valid)
                if(!valid) return
                // 可以发起添加用户的网络请求post
                const {data: res} = await this.$http.post('users', this.addForm)
                // console.log(res)
                if(res.meta.status !== 201) return this.$message.error("添加用户失败!")
                this.$message.success("添加用户成功!")
                // 隐藏添加用户的对话框
                this.addDialogVisible = false
                // 重新获得用户数据的列表
                this.getUserList()
            })
        },
        // 点击修改按钮，显示修改对话框
        async showEditDialog(id) {
            // console.log(id)
            // 根据id查询用户信息并且返回
            const {data:res} = await this.$http.get('users/' + id)
            if(res.meta.status !== 200) {
                return this.$message.error('查询用户信息失败!')
            }
            this.editForm = res.data
            this.editDialogVisible = true
        },
        // 监听修改用户对话框的关闭事件
        editDialogClose() {
            this.$refs.editFormRef.resetFields()
        },
        // 修改用户的预验证功能 点击按钮，添加新用户
        editUser() {
            // 修改表单的预验证
            this.$refs.editFormRef.validate(async valid => {
                if(!valid) return
                // 发起用户修改信息的请求put
                const {data: res} = await this.$http.put("users/" + this.editForm.id, {email: this.editForm.email, mobile: this.editForm.mobile})
                if(res.meta.status !== 200) return this.$message.error("修改用户信息失败!")
                this.editDialogVisible = false
                this.getUserList()
                this.$message.success("修改用户信息成功!")
            })
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
            const {data: res} = await this.$http.delete('users/' + id)
            // console.log(res)
            if(res.meta.status !== 200) {
                return this.$message.error("删除用户信息失败!")
            }
            // $message不用手动挂载就可以使用
            this.$message.success("删除用户成功!")
            this.getUserList()
        },
        // 展示分配角色的对话框
        async setRole(userInfo) {
            this.userInfo = userInfo
            // 在展示对话框之前，获得所有角色的列表
            const {data: res} = await this.$http.get('roles')
            if(res.meta.status !== 200) return this.$message.error("获取角色列表失败!")
            // this.$message.success("获得角色列表成功!")
            this.rolesList = res.data
            this.setRoleDialogVisible = true
        },
        // 点击按钮分配角色
        async saveRoleInfo() {
            if(!this.SelectedRoleId){
                return this.$message.error("请选择要分配的角色!")
            }
            const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`, {rid: this.SelectedRoleId})
            if(res.meta.status !== 200) return this.$message.error("更新角色失败!")
            this.$message.success("更新角色成功!")
            this.getUserList()
            this.setRoleDialogVisible = false
        },
        // 监听分配角色对话框的关闭事件
        setRoleDialogClose() {
            this.SelectedRoleId = '',
            this.userInfo = {}
        }
    }

}
</script>

<style lang="less" scoped>
// scoped防止组件与组件之间额样式冲突

</style>