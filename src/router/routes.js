import { util } from "src/scripts/util";
import { api } from "src/scripts/api";
import { storage } from "src/scripts/storage";

const validation = async (to, from, next) => {
    /*
    let auth = storage.auth();
    if (!(util.isString(auth.token) && "" !== auth.token)) {
        next({
            path: "/login",
        });
    } else {
        next();
    }
    */
   next();
};

const routes = [
    {
        path: "/",
        component: () => import("layouts/MainLayout.vue"),
        beforeEnter: validation,
        children: [
            {
                path: "/",
                component: () => import("pages/Index.vue"),
            },
            {
                path: "/grid",
                component: () => import("pages/grid/Index.vue"),
            },
            {
                path: "/cache",
                component: () => import("pages/Cache.vue"),
            },
            {
                path: '/:catchAll(.*)*',
                component: () => import('pages/NotFound.vue')
            }
        ],
    },
    {
        path: "/",
        component: () => import("layouts/PublicLayout.vue"),
        children: [
            {
                path: "/login",
                component: () => import("pages/Login.vue"),
            },
            {
                path: '/:catchAll(.*)*',
                component: () => import('pages/NotFound.vue')
            }
        ],
    },
];

export default routes;
