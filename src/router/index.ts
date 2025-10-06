import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const Home = () => import('../pages/Home.vue')
const FeedDetail = () => import('../pages/FeedDetail.vue')
const Sources = () => import('../pages/Sources.vue')
const Settings = () => import('../pages/Settings.vue')

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'home', component: Home },
  { path: '/feed/:id', name: 'feed-detail', component: FeedDetail, props: true },
  { path: '/sources', name: 'sources', component: Sources },
  { path: '/settings', name: 'settings', component: Settings },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
