export default [

     {
          path: '/kpisubmission',
          name: 'KPISubmission',
          component: () => import("@/modules/kpi/views/Page/KPISubmission/KPISubmission.vue"),
           meta: {
               title: 'KPISubmission',
          },
     }
];