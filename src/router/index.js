import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
// 1.组件的导入
import Welcome from '@/components/welcome.vue'
import Users from '@/components/user/user.vue'
import Rights from '@/components/power/rights.vue'
import Roles from  '@/components/power/roles.vue'


Vue.use(VueRouter)

const routes = [
  {
    // 路由的重定向
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login 
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    // 路由的重定向
    redirect: "/welcome",
    // home主页下的组件
    children: [
      {
        // 2.路由的配置
        path: '/welcome',
        name: 'welcome',
        component: Welcome
      },
      {
        // 2.路由的配置
        path: '/users',
        name: 'users',
        component: Users
      },
      {
        // 2.路由的配置
        path: '/rights',
        name: 'rights',
        component: Rights
      },
      {
        // 2.路由的配置
        path: '/roles',
        name: 'roles',
        component: Roles
      },
    ],
  }
]

const router = new VueRouter({
  routes
})

//挂载路由导航卫士 路由的切换
router.beforeEach((to, from ,next) => {
  //to 表示将要访问的路径
  //from 表示从哪个路径跳转而来
  //next 是一个函数，表示放行  next() 放行 next('/login') 强制跳转
  if(to.path === '/login') return next();
  //获取token，已经存储在sessionStrosge中
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr) return next('/login')
  next()
})

export default router
