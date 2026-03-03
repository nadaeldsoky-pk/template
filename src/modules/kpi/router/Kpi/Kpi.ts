export default [

     {
          path: '/kpi',
          name: 'Kpi',
          component: () => import("@/modules/kpi/views/Page/Kpi/Kpi.vue"),
           meta: {
               title: 'Kpi',
          },
     }
];