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
    }, ]
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