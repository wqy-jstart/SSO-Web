import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: HomeView
  },
  {
    path: '/login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/register',
    component: () => import('../views/RegisterView')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
