import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/t/:id',
    name: 't',
    component: () => import('../views/teacherPage.vue'),
  },
  {
    path: '/s/:id',
    name: 's',
    component: () => import('../views/students.vue'),
  },
  {
    path: '/d/:id',
    name: 'd',
    component: () => import('../views/teacherPage.vue'),
  },
  {
    path: '/c/:id',
    name: 'c',
    component: () => import('../views/teacherPage.vue'),
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../components/teacher/studentResponseOptBar.vue'),
  },
  {
    path: '/drive',
    name: 'drive',
    component: () => import('../components/uploadFile/googleDriveSearch.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
