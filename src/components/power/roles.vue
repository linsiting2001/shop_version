<template>
  <div>
      <!-- 面包屑视图区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
        <!-- 添加角色按钮 -->
        <el-row>
            <el-col>
                <el-button type="primary" @click="addRolesDialogVisible = true">添加角色</el-button>
            </el-col>
        </el-row>
        
        <!-- table视图区 -->
        <el-table :data="rolesList" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <!-- 栅格布局的组件 layout组件 加冒号是动态绑定-->
                    <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                        <!-- 一级权限 -->
                        <el-col :span="5">
                            <el-tag closable @close="removeRightsById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 二级权限和三级权限 -->
                        <el-col :span="19">
                            <!-- 通过for循环 嵌套渲染二级权限 :class="[]"动态绑定类名-->
                            <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                                <el-col :span="6">
                                    <el-tag type="success" closable @close="removeRightsById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span="18">
                                    <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRightsById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>

                    <!-- json格式文件的格式化 -->
                    <!-- <pre>
                        {{scope.row}}
                    </pre> -->
                </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300px">
                <template slot-scope="scope">
                    <!-- slot-scope="scope" -->
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="ShowEditRolesDialog(scope.row.id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.id)">删除</el-button>
                    <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRrightDialog(scope.row)">分配权限</el-button>
                </template>
            </el-table-column>
        </el-table>
        
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
        title="添加角色"
        :visible.sync="addRolesDialogVisible"
        width="50%"
        @close="addRolesDialogClose"
        >
            <!-- 内容主题区 -->
            <!-- :model数据绑定对象  :rules规则绑定事件 pro数据规则的绑定-->
            <el-form :model="addRolesForm" :rules="addRolesFormRules" ref="addRolesFormRef" label-width="80px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRolesForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRolesForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRolesDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog
        title="编辑角色"
        :visible.sync="editRolesDialogVisible"
        width="50%"
        @close="editRolesDialogClose"
        >
            <!-- 内容主题区 -->
            <!-- :model数据绑定对象  :rules规则绑定事件 pro数据规则的绑定-->
            <el-form :model="editRolesForm" :rules="editRolesFormRules" ref="editRolesFormRef" label-width="80px">
                <el-form-item label="角色名称">
                    <el-input v-model="editRolesForm.roleName" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editRolesForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRolesDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRole">确 定</el-button>
            </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
    title="分配权限"
    :visible.sync="SetRrightDialogVisible"
    width="50%"
    @close="SetRrightDialogClose"
    >
        <!-- 树形控件 -->
        <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="SetRrightDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data() {
        return {
            // 获取所有角色列表的数据
            rolesList: [],
            // 获取所有权限列表的数据
            rightsList: [],
            // 树形控件的属性绑定
            treeProps: {
                label: 'authName',
                children: 'children'
            },
            // 默认选中的节点ID值数组
            defKeys: [],
            // 当前分配权限的角色id
            roleId: '',
            // 是否显示添加角色对话框
            addRolesDialogVisible: false,
            // 是否显示编辑角色对话框
            editRolesDialogVisible: false,
            // 是否显示分配权限对话框
            SetRrightDialogVisible: false,
            // 添加角色表单用户数据
            addRolesForm:{
                roleName: '',
                roleDesc:''
            },
            // 编辑角色的表单数据
            editRolesForm: {

            },
            // 添加表单的验证规则
            addRolesFormRules: {
                // rolesname的校验规则是官方给出的
                roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                roleDesc: [
                    { required: false, message: '请输入角色描述', trigger: 'blur' },
                ]
            },
            // 编辑表单的验证规则
            editRolesFormRules: {
               roleDesc: [
                    { required: false, message: '请输入角色描述', trigger: 'blur' },
                ] 
            }
        }
    },
    created() {
        // 获取角色列表的数据
        this.getRolesList()
    },
    methods: {
        async getRolesList() {
            const {data: res} = await this.$http.get('roles')
            // console.log(res)
            if(res.meta.status !== 200) return this.$message.error('获取角色列表数据失败!')
            this.rolesList = res.data
            // console.log(this.rolesList)
        },
        // 添加角色的预验证 点击确定 添加角色
        addRole() {
            // 对表单进行预处理操作
            this.$refs.addRolesFormRef.validate(async vali => {
                // console.log(vali)
                if(!vali) return
                // 可以发起添加用户的网络请求 post
                const {data: res} = await this.$http.post('roles', this.addRolesForm)
                // console.log(res)
                if(res.meta.status !== 201) return this.$message.error("添加角色失败!")
                this.$message.success("添加角色成功!")
                // 隐藏添加角色对话框
                this.addRolesDialogVisible = false
                // 重新获得角色列表
                this.getRolesList()
            })
        },
        // 编辑角色预验证 点击确认 添加角色
        editRole() {
            this.$refs.editRolesFormRef.validate(async vali => {
                if(!vali) return
                // 发起修改角色的网络请求 put 
                const {data:res} = await this.$http.put('roles/' + this.editRolesForm.roleId, {roleName: this.editRolesForm.roleName,roleDesc: this.editRolesForm.roleDesc})
                // console.log(res)
                if(res.meta.status !== 200) return this.$message.error("编辑角色失败!")
                this.$message.success("编辑角色成功!")
                this.editRolesDialogVisible = false
                this.getRolesList()
            })
        },
        // 点击编辑按钮出现 编辑对话框
        async ShowEditRolesDialog(id){
            // console.log(id)
            // 根据id号查询角色信息并且返回 get
            const {data:res} = await this.$http.get('roles/' + id)
            // console.log(res)
            if(res.meta.status !== 200) return this.$message.error("获取角色信息失败!")
            // 把查询到的信息放在 editRolesForm 里
            this.editRolesForm = res.data
            // 显示编辑对话框
            this.editRolesDialogVisible = true
        },
        // 监听添加角色对话框的关闭事件
        addRolesDialogClose() {
            this.$refs.addRolesFormRef.resetFields()
        },
        // 监听编辑角色对话框的关闭事件
        editRolesDialogClose() {
            this.$refs.editRolesFormRef.resetFields()
        },
        // 点击删除角色按钮删除数据 delete
        async removeRoleById(id) {
            // console.log(id)
            // 弹框 确认是否删除
            const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
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
            const {data: res} = await this.$http.delete('roles/' + id)
            // console.log(res)
            if(res.meta.status !== 200) {
                return this.$message.error("删除角色失败!")
            }
            // $message不用手动挂载就可以使用
            this.$message.success("删除角色成功!")
            this.getRolesList()
        },
        // 根据id删除对应的权限
        async removeRightsById(role, rightId) {
            // 弹框提示用户是否要删除
            const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
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
            // console.log("确认了删除!")
            const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            // console.log(res)
            if(res.meta.status !== 200) return this.$message.error('取消权限失败!')
            // this.$message.success("取消权限成功!")
            // this.getRolesList() 会发生全局页面的刷新
            // 只刷新children的数据
            role.children = res.data
        },
        // 展示分配权限的对话框
        async showSetRrightDialog(role) {
            this.roleId = role.id
            // 获取所有权限的数据
            const {data: res} = await this.$http.get('rights/tree')
            // console.log(res)
            if(res.meta.status !== 200) {
                return this.$message.error('获取权限失败!')
            }
            // 获取到的所有权限数据
            this.rightsList = res.data
            // 递归获取三级节点的id
            this.getLeafKeys(role, this.defKeys)

            this.SetRrightDialogVisible = true
        },
        // 通过递归的形式，获得角色下所有三级权限的id，保存在defKeys数组中
        getLeafKeys(node, arr) {
            // 如果当前节点不包含node属性，就是三级节点
            if(!node.children){
                return arr.push(node.id)
            }
            node.children.forEach(item => this.getLeafKeys(item, arr))
        },
        // 监听关闭权限对话框的事件
        SetRrightDialogClose() {
            this.defKeys = []
        },
        // 点击为角色分配权限
        async allotRights() {
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            // console.log(keys)
            const idStr = keys.join(',')
            const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids: idStr})
            if(res.meta.status !== 200) return this.$message.error("分配权限失败!")
            this.$message.success("分配权限成功!")
            this.getRolesList()
            this.SetRrightDialogVisible = false
        }
    }
}
</script>

<style>

</style>