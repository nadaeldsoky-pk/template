import { allKpiRoutes } from './router';

const KpiModule = {
  name: 'kpi',
  version: '1.0.0',
  
  routes: allKpiRoutes,
  
  get routesWithMeta() {
    return this.routes.map(route => ({
      ...route,
      meta: {
        ...route.meta,
        module: 'kpi',
        mainTrKeys: ['kpi', 'common', 'datatable', 'menu']
      }
    }));
  },
  
  // Initialization
  init() {
    console.log(`✅ KPI Module initialized`);
    return this;
  }
};

export default KpiModule;
export { allKpiRoutes };