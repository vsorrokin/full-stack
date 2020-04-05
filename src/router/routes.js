export default [
  {
    path: '/',
    name: 'home',
    component: () => import('#p/Home')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('#p/Admin')
  }
];
