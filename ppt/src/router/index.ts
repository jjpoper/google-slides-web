import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/teacher',
    name: 'teacher',
    component: () => import('../views/teacherAdmin.vue'),
  },
  {
    path: '/students',
    name: 'students',
    component: () => import('../views/students.vue'),
  },
];

const router = new VueRouter({
  // mode: 'history',
  routes,
});

export default router;
