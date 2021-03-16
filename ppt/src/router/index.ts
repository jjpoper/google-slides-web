import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/teacher',
    name: 'teacher',
    component: () => import('../views/teacher.vue'),
  },
  {
    path: '/students',
    name: 'students',
    component: () => import('../views/students.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
