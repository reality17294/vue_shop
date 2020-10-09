import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: './login'
  },
  {
    path: '/home',
    name: 'home',
    redirect: '/welcome',
    component: () => import('../views/home/Home'),
    children: [{
        path: '/welcome',
        name: 'welcome',
        component: () => import('../views/users/Welcome')
      }, {
        path: '/users',
        name: 'users',
        component: () => import('../views/users/Users')
      }, {
        path: '/roles',
        name: 'roles',
        component: () => import('../views/rights/Roles')
      }, {
        path: '/rights',
        name: 'rights',
        component: () => import('../views/rights/Rights')
      },
      {
        path: '/categories',
        name: 'category',
        component: () => import('../views/goods/Category')
      },
      {
        path: '/params',
        name: 'params',
        component: () => import('../views/goods/Params')
      }, {
        path: '/goods',
        name: 'goods',
        component: () => import('../views/goods/List'),

      }, {
        path: '/goods/add',
        name: 'add',
        component: () => import('../views/goods/Add.vue')
      }, {
        path: '/orders',
        name: 'orders',
        component: () => import('../views/orders/Order.vue')
      }, {
        path: '/reports',
        name: 'report',
        component: () => import('../views/report/Report.vue')
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login')
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  document.title = to.name;
  if (to.path === '/login') return next()
  const withToken = window.sessionStorage.getItem("token")
  if (!withToken) return next('/login')
  next();
});
export default router