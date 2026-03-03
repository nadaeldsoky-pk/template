import type { RouteRecordRaw } from 'vue-router';

// استيراد كل ملفات الروتر من داخل الموديول
import formulaVariableRoutes from './FormulaVariable/FormulaVariable';
import kpiRoutes from './Kpi/Kpi';
import kpiReviewerRoutes from './KPIReviwer/KPIReviwer';
import kpiSubmissionRoutes from './KPISubmission/KPISubmission';
import kpiTypeRoutes from './KPIType/KPIType';
import kpiUnitRoutes from './KPIUnit/KPIUnit';

// جمع كل الروترات
export const allKpiRoutes: RouteRecordRaw[] = [
  ...formulaVariableRoutes,
  ...kpiRoutes,
  ...kpiReviewerRoutes,
  ...kpiSubmissionRoutes,
  ...kpiTypeRoutes,
  ...kpiUnitRoutes
];

// Export individual routes
export { 
  formulaVariableRoutes,
  kpiRoutes,
  kpiReviewerRoutes,
  kpiSubmissionRoutes,
  kpiTypeRoutes,
  kpiUnitRoutes 
};