<template>
<div>
    <!-- 面包屑视图区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
        <!-- border stripe加边框和隔行变色 -->
        <el-table :data="rightsList" border stripe>
            <!-- prop后台数据的渲染 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="权限名称" prop="authName"></el-table-column>
            <el-table-column label="路径" prop="path"></el-table-column>
            <el-table-column label="权限等级" prop="level">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</div>
</template>

<script>
export default {
    data() {
        return {
            // 所有权限列表的信息
            rightsList: []
        }
    },
    created() {
        // 获取所有的权限列表数据
        this.getRightsList()
    },
    methods: {
        // 获取权限列表数据
        async getRightsList() {
            const {data:res} = await this.$http.get('rights/list')
            // console.log(res)
            if(res.meta.status !== 200) return this.$message.error('获取权限列表失败!');
            this.rightsList = res.data
            // console.log(this.rightsList)
        }
    }
}
</script>

<style lang="less" scoped>

</style>