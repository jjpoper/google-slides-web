import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/teacher',
    name: 'teacher',
    component: () => import('../views/teacherPage.vue'),
  },
  {
    path: '/students',
    name: 'students',
    component: () => import('../views/students.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/teacherPage.vue'),
  },

  {
    path: '/class',
    name: 'class',
    component: () => import('../views/teacherPage.vue'),
  },

  {
    path: '/test',
    name: 'test',
    component: () => import('../components/teacher/studentResponseOptBar.vue'),
  },
  // {
  //   path: '/dashboard',
  //   name: 'dashboard',
  //   component: () => import('../views/teacherDashboardTest.vue'),
  // },
];

const router = new VueRouter({
  // mode: 'history',
  routes,
});

export default router;
