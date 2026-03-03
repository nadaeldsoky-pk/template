import API from "@/API/API";
import axios from "axios";

declare const kPISERVICE : string;

export default class KPISubmission extends API {
  constructor() {
    super('kpi', kPISERVICE);
  }



  async setKpiSubmissionValue(data: any): Promise<any> {
    try {
      axios.defaults.baseURL = kPISERVICE;
      const response = await axios.post(`/kpisubmission`, data)
      return response; // Return full response object
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.data.message);
      }
    }
  }



  async reAssign(itemId: string, data: any): Promise<any> {
    try {
      axios.defaults.baseURL = kPISERVICE;
      const response = await axios.post(`/kpi/${itemId}/reAssign`, data)
      return response; // Return full response object
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.data.message);
      }
    }
  }
 
}
