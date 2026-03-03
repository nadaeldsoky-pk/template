import API from "@/API/API";
declare const kPISERVICE : string;
export default class KPIUnit extends API {
  constructor() {
    super('kpiunit' , kPISERVICE)
  }
 
}
