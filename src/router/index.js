import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
import Welcome from '../views/Welcome.vue'
const router = new VueRouter({
  routes:[
    {
      path:'/',
      redirect:'/login'
    },
    {
      path:'/login',
      component:()=>import('@/views/login')
    },
    {
      path:'/home',
      component:()=>import('@/views/home'),
      children: [{ path: '/welcome', component: Welcome },
      { path: '/users', component: ()=>import('@/views/users/users') },
      { path: '/pics', component: ()=>import('@/views/slides/Slides') },
      { path: '/cares', component: ()=>import('@/views/goods/Cates') },
      { path: '/goods', component: ()=>import('@/views/goods/Goods') },
      { path: '/orders', component: ()=>import('@/views/goods/Orders') },
      { path: '/comments', component: ()=>import('@/views/goods/Comments') }]
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数， 表示放行   ①next()放行   ②next('/login')强制跳转
  if (to.path === '/login') return next() // 访问登录页，直接放行
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login') // 没有token 强制跳转
  next() // 否则(有token)直接放行
})


export default router
