import API from "@/API/API";
declare const kPISERVICE : string;

export default class KPIType extends API {
  constructor() {
    super('kpitype' , kPISERVICE)
  }
 
}
