import {
  createRouter,
  createWebHistory,
} from 'vue-router';
import DefaultLayout from '@/layout/default/default.vue';

export enum ERouteName {
  HOME = 'home',
  LOGIN = 'login',
  NOT_FOUND = 'not-found',
}

// Routes that could be reached only if the user is not logged in
const authFreeRoutes = [
  ERouteName.LOGIN,
];

export const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: ERouteName.HOME,
          components: {
            content: () => import('@/page/game/game.vue'),
          },
        },
      ],
    },
    {
      path: '/login',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: ERouteName.LOGIN,
          components: {
            content: () => import('@/page/login/login.vue'),
          },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: ERouteName.NOT_FOUND,
          components: {
            content: () => import('@/page/not-found/not-found.vue'),
          },
        },
      ],
    },
  ],
});
