export default [
  {
    path: '/',
    name: 'home',
    component: () => import('#p/Home'),
    meta: {
      isPublic: true
    }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('#p/admin/Home'),
    meta: {
      isPublic: true
    }
  },
  {
    path: '/new',
    name: 'new',
    component: () => import('#p/admin/New')
  }
];
