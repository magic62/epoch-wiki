import { createRouter, createWebHistory } from 'vue-router';
import About from '../views/About.vue';
import Database from '../views/Database.vue';
import Item from '../views/Item.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Database,
      meta: { title: 'Auction House' },
    },
    {
      path: '/about',
      name: 'about',
      component: About,
      meta: { title: 'About' },
    },
    {
      path: '/database',
      name: 'database',
      component: Database,
      meta: { title: 'Auction House' },
    },
    {
      path: '/items/:entry',
      name: 'item',
      component: Item,
      meta: { title: 'Item Details' },
    },
  ],
});

router.afterEach((to) => {
  document.title = to.meta.title;
});

export default router;