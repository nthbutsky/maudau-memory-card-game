import {
  createRouter,
  createWebHistory,
} from 'vue-router';
import DefaultLayout from '@/layout/default/default.vue';
import {
  useUserStore,
} from '@/store/user';

export enum ERouteName {
  GAME = 'game',
  LOGIN = 'login',
  NOT_FOUND = 'not-found',
}

export const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: ERouteName.GAME,
          components: {
            content: () => import('@/page/game/game.vue'),
          },
        },
      ],
      meta: {
        authRequired: true,
      },
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
      meta: {
        noAuthRequired: true,
      },
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

router.beforeEach((to, from, next) => {
  const authRequired = to.matched.some((record) => record.meta.authRequired);
  const noAuthRequired = to.matched.some((record) => record.meta.noAuthRequired);

  const {
    user,
  } = useUserStore();

  if (authRequired && !user) {
    next({
      path: '/login',
    });
  } else if (noAuthRequired && user) {
    next({
      path: '/',
    });
  } else {
    next();
  }
});
