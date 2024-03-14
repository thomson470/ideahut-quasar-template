import { storage } from "src/scripts/storage";

const validation = async (to, from, next) => {
  let user = storage.user();
  if (user.userId && "" !== user.userId) {
    next();
  } else {
    next({
      path: "/login",
    });
  }
};

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      //{
      //  path: '/test',
      //  component: () => import('pages/Test.vue')
      //},
      {
        path: "/",
        component: () => import("pages/Index.vue"),
      },
      {
        path: "/grid/:name/:parent",
       // beforeEnter: validation,
        component: () => import("pages/grid/Index.vue"),
      },
      {
        path: "/cache",
        //beforeEnter: validation,
        component: () => import("pages/Cache.vue"),
      },
      {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue')
      }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;
