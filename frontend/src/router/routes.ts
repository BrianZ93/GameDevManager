import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DashboardPage.vue') },
      { path: 'games', component: () => import('pages/GamePage.vue') },
      { path: 'games/:gameID', component: () => import('pages/GamePage.vue'), props: true },
      {
        path: 'games/:gameID/phases/:phaseID',
        component: () => import('pages/GamePage.vue'),
        props: true,
      },
      { path: 'phases', component: () => import('pages/PhasePage.vue') },
      {
        path: 'phases/:phaseID',
        component: () => import('pages/PhasePage.vue'),
        props: true,
      },
      {
        path: 'phases/:phaseID/feature-groups/:featureGroupID',
        component: () => import('pages/PhasePage.vue'),
        props: true,
      },
      {
        path: 'phases/:phaseID/feature-groups/:featureGroupID/features/:featureID',
        component: () => import('pages/PhasePage.vue'),
        props: true,
      },
      { path: 'tasks', component: () => import('pages/TasksPage.vue') },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;