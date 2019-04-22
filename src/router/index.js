import Vue from 'vue'
import Router from 'vue-router'

// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Home from '@/components/Home'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/Login', component: Login },
    { path: '/home', component: Home }
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
