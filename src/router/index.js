import Vue from 'vue'
import Router from 'vue-router'

// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import User from '@/components/User'

Vue.use(Router)

const router = new Router({
  routes: [
    {path: '/', redirect: '/home'},
    {path: '/Login', component: Login},
    {
      // 手册登录就会默认显示的组件(页面)
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {path: '/welcome', component: Welcome},
        {path: '/users', component: User}
      ]
    }
  ]
})

// 设置路由守卫
router.beforeEach((to, from, next) => {
  // 设置token
  var token = window.sessionStorage.getItem('token')
  // 判断用户登录状态，禁止访问其他页面
  if (token === null && to.path !== '/login') {
    return next('/login')
  }
  // 继续执行路由
  next()
})

export default router
