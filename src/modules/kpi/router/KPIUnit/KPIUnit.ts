export default [

     {
          path: '/kpiunit',
          name: 'KPIUnit',
          component: () => import("@/modules/kpi/views/Page/KPIUnit/KPIUnit.vue"),
           meta: {
               title: 'KPIUnit',
          },
     }
];