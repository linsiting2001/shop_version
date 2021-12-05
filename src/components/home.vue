<template>
  <!-- <div> -->
      <!-- container布局容器的使用 -->
    <el-container class="home_container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/logo.png" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type='info' @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主题区 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <!-- 侧边栏菜单区域 这是我们写死的菜单数据渲染 -->
                <!-- 折叠菜单功能模块 -->
                <!-- <div class="toggle-button" @click="toggleCollapse">|||</div> -->
                <!-- unique-opened 每一次只能展开一个菜单 -->
                <!-- collapse-transition 是否取消折叠动画 -->
                <!-- :collapse-transition="false" 保证数据是布尔值要动态数据绑定：-->
                <!-- 1.服务器端返回数据要加上这个 :router="true" 或者router 为菜单开启路由模式 跳转到index对应的菜单项 -->
                <!-- <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false"> -->
                    <!-- 一级菜单的模板区域 -->
                    <!-- <el-submenu index="1"> -->
                        <!-- <template slot="title"> -->
                            <!-- 图标 -->
                            <!-- <i class="el-icon-user-solid"></i> -->
                            <!-- 文本 -->
                            <!-- <span>用户管理</span> -->
                        <!-- </template> -->
                        <!-- 二级菜单的模板区域 -->
                        <!-- <el-menu-item index="1-4-1" @click="user"> -->
                            <!-- <template slot="title"> -->
                                <!-- 图标 -->
                                <!-- <i class="el-icon-menu"></i> -->
                                <!-- 文本 -->
                                <!-- <span>用户列表</span> -->
                            <!-- </template>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title"> -->
                            <!-- 图标 -->
                            <!-- <i class="el-icon-s-tools"></i> -->
                            <!-- 文本 -->
                            <!-- <span>权限管理</span> -->
                        <!-- </template> -->
                        <!-- 二级菜单的模板区域 -->
                        <!-- <el-menu-item index="1-4-1"> -->
                            <!-- <template slot="title"> -->
                                <!-- 图标 -->
                                <!-- <i class="el-icon-menu"></i> -->
                                <!-- 文本 -->
                                <!-- <span>角色列表</span> -->
                            <!-- </template> -->
                        <!-- </el-menu-item> -->
                        <!-- <el-menu-item index="1-4-1"> -->
                            <!-- <template slot="title"> -->
                                <!-- 图标 -->
                                <!-- <i class="el-icon-menu"></i> -->
                                <!-- 文本 -->
                                <!-- <span>权限列表</span> -->
                            <!-- </template>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="3">
                        <template slot="title"> -->
                            <!-- 图标 -->
                            <!-- <i class="el-icon-location"></i> -->
                            <!-- 文本 -->
                            <!-- <span>商品管理</span>
                        </template> -->
                        <!-- 二级菜单的模板区域 -->
                        <!-- <el-menu-item index="1-4-1">
                            <template slot="title"> -->
                                <!-- 图标 -->
                                <!-- <i class="el-icon-s-goods"></i> -->
                                <!-- 文本 -->
                                <!-- <span>商品列表</span> -->
                            <!-- </template>
                        </el-menu-item>
                        <el-menu-item index="1-4-1">
                            <template slot="title"> -->
                                <!-- 图标 -->
                                <!-- <i class="el-icon-menu"></i> -->
                                <!-- 文本 -->
                                <!-- <span>分类参数</span> -->
                            <!-- </template>
                        </el-menu-item>
                        <el-menu-item index="1-4-1">
                            <template slot="title"> -->
                                <!-- 图标 -->
                                <!-- <i class="el-icon-menu"></i> -->
                                <!-- 文本 -->
                                <!-- <span>商品分类</span> -->
                            <!-- </template>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="4">
                        <template slot="title"> -->
                            <!-- 图标 -->
                            <!-- <i class="el-icon-s-order"></i> -->
                            <!-- 文本 -->
                            <!-- <span>订单管理</span> -->
                        <!-- </template> -->
                        <!-- 二级菜单的模板区域 -->
                        <!-- <el-menu-item index="1-4-1">
                            <template slot="title"> -->
                                <!-- 图标 -->
                                <!-- <i class="el-icon-menu"></i> -->
                                <!-- 文本 -->
                                <!-- <span>角色列表</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="1-4-1">
                            <template slot="title"> -->
                                <!-- 图标 -->
                                <!-- <i class="el-icon-menu"></i> -->
                                <!-- 文本 -->
                                <!-- <span>权限列表</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="5">
                        <template slot="title"> -->
                            <!-- 图标 -->
                            <!-- <i class="el-icon-s-marketing"></i> -->
                            <!-- 文本 -->
                            <!-- <span>数据统计</span> -->
                        <!-- </template> -->
                        <!-- 二级菜单的模板区域 -->
                        <!-- <el-menu-item index="1-4-1">
                            <template slot="title"> -->
                                <!-- 图标 -->
                                <!-- <i class="el-icon-menu"></i> -->
                                <!-- 文本 -->
                                <!-- <span>角色列表</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="1-4-1">
                            <template slot="title"> -->
                                <!-- 图标 -->
                                <!-- <i class="el-icon-menu"></i> -->
                                <!-- 文本 -->
                                <!-- <span>权限列表</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu> -->

                <!-- 侧边栏菜单区域 这是服务器返回的菜单数据渲染 -->
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">
                    <!-- 一级菜单的模板区域 -->
                    <!-- v-for="item in menuList" :key="item.id" 会渲染出多个一级菜单 -->
                    <!-- index="1"不能写死了，应该加个 ： 动态绑定数据 只接收字符串，要转换为字符串-->
                    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconsObj[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单的模板区域 -->
                        <!-- 2.侧边栏路由的改造 :index="'/' + subItem.path -->
                        <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
                            <template slot="title">
                                <!-- 图标 -->
                                <i class="el-icon-menu"></i>
                                <!-- 文本 -->
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>

            </el-aside>
            <!-- 右侧内容 -->
            <el-main>
                <!-- 3.路由占位符的使用 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
  <!-- </div> -->
</template>

<script>
export default {
    data() {
        return {
            // 左侧的菜单数据
            menuList: [],
            // 服务器返回的列表图标
            iconsObj: {
                // key为id值，值为icon图标
                '125': 'el-icon-user-solid',
                '103': 'el-icon-s-tools',
                '101': 'el-icon-s-goods',
                '102': 'el-icon-s-order',
                '145': 'el-icon-s-marketing',
            },
            // 左菜单栏不折叠 ：动态绑定
            isCollapse: false,
            // 二级菜单点击出现高亮状态 被激活的链接地址
            activePath: ''
        }
    },
    // 页面一创建完成后就加载左边菜单的数据
    created() {
        this.getMenuList(),
        this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods: {
        // 实现退出的功能
        logout() {
            // 清空sessionStorage中的token值
            window.sessionStorage.clear();
            // 重定向到登录页
            this.$router.push('/login');
        },
        // 获取左侧所有菜单的数据
        async getMenuList() {
            // .get()函数放回的是 promise对象
            const { data: res } = await this.$http.get('menus')
            // console.log(res)
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.menuList = res.data
        },
        // 点击按钮，切换菜单的折叠与展开
        toggleCollapse() {
             this.isCollapse = !this.isCollapse
        },
        // 保存链接的激活状态 左侧菜单高亮效果的实现
        saveNavState(activePath) {
            window.sessionStorage.setItem('activePath',activePath)
            // 重新点击的时候重新赋值
            this.activePath = activePath
        },
        // user() {
        //     this.$router.push("/users")
        // }
    }

}
</script>

<style lang="less" scoped>
// 每一个标签名就是一个类名
.home_container{
    height: 100%;
}
.toggle-button {
    background-color: #4A5064;
    font-size: 1opx;
    line-height: 24px;
    color: #fff;
    text-align: center;
    // letter-spacing 字母间的宽度
    letter-spacing: 0.2em;
    cursor: pointer;
}
.el-header{
    display: flex;
    // 横向的布局
    justify-content: space-between;
    background-color: #373D41;
    padding-left: 0;
    // 垂直居中
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div{
        display: flex;
        align-items: center;
        span {
            margin-left: 15px;
        }
    }
    img{
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
}
.el-aside {
    background-color: #333744;
    .el-menu {
        border-right: none;
    }
}
.el-main {
    background-color: #eaedf1;
}
</style>