import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../views/Login/Login.vue'
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/Login/Login.vue')
// import Home from '../views/Home/Home.vue'
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/Home/Home.vue')
// import Welcome from '../views/Welcome/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/Welcome/Welcome.vue')

// import Users from '../views/Users/Users.vue'
const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../views/Users/Users.vue')
// import Rights from '../views/Power/Rights.vue'
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../views/Power/Rights.vue')
// import Roles from '../views/Power/Roles.vue'
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../views/Power/Roles.vue')

// import Cate from '../views/Goods/Cate.vue'
const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '../views/Goods/Cate.vue')
// import Params from '../views/Goods/Params.vue'
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../views/Goods/Params.vue')

// import GoodsList from '../views/Goods/GoodsList.vue'
const GoodsList = () => import(/* webpackChunkName: "GoodsList_Add" */ '../views/Goods/GoodsList.vue')
// import Add from '../views/Goods/Add.vue'
const Add = () => import(/* webpackChunkName: "GoodsList_Add" */ '../views/Goods/Add.vue')

// import Order from '../views/Order/Order.vue'
const Order = () => import(/* webpackChunkName: "Order_Report" */ '../views/Order/Order.vue')
// import Report from '../views/Report/Report.vue'
const Report = () => import(/* webpackChunkName: "Order_Report" */ '../views/Report/Report.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: GoodsList },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取token
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
