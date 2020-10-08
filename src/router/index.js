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
    component: () => import('../views/home/home.vue'),
    children: [{
      path: '/welcome',
      name: 'welcome',
      component: () => import('../views/home/cComponents/Welcome.vue')
    }, {
      path: '/users',
      name: 'users',
      component: () => import('../views/home/cComponents/Users.vue')
    }, {
      path: '/roles',
      name: 'roles',
      component: () => import('../views/home/cComponents/Roles.vue')
    }, ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue')
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