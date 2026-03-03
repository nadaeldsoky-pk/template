export default [

     {
          path: '/kpitype',
          name: 'KPIType',
          component: () => import("@/modules/kpi/views/Page/KPIType/KPIType.vue"),
           meta: {
               title: 'KPIType',
          },
     }
];