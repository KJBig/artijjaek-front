import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const Home = () => import('../pages/Home.vue')
const Register = () => import('../pages/Register.vue')
const Settings = () => import('../pages/Settings.vue')
const Unsubscribed = () => import('../pages/Unsubscribed.vue')

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'home', component: Home },
  { path: '/register', name: 'register', component: Register },
  { path: '/settings', name: 'settings', component: Settings },
  { path: '/unsubscribed', name: 'unsubscribed', component: Unsubscribed },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
