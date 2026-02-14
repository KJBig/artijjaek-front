import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const Home = () => import('../pages/Home.vue')
const Register = () => import('../pages/Register.vue')
const Inquiry = () => import('../pages/Inquiry.vue')
const CompanyList = () => import('../pages/CompanyList.vue')
const Setting = () => import('../pages/Setting.vue')
const Unsubscription = () => import('../pages/Unsubscription.vue')
const Thankyou = () => import('../pages/Thankyou.vue')
const Policy = () => import('../pages/Policy.vue')
const NotFound = () => import('../pages/NotFound.vue')

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'home', component: Home },
  { path: '/inquiry', name: 'inquiry', component: Inquiry },
  { path: '/companies', name: 'companies', component: CompanyList },
  { path: '/register', name: 'register', component: Register },
  { path: '/setting', name: 'setting', component: Setting },
  { path: '/unsubscription', name: 'unsubscription', component: Unsubscription },
  { path: '/thankyou', name: 'thankyou', component: Thankyou },
  { path: '/policy', name: 'policy', component: Policy },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
