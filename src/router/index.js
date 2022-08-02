import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView';
import NoteView from '@/views/NoteView';
import ListView from '@/views/ListView';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/note/:id',
    name: 'note',
    component: NoteView,
  },
  {
    path: '/list/:id',
    name: 'list',
    component: ListView,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
