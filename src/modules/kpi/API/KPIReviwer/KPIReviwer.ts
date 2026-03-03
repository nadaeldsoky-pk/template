import API from "@/API/API";
import axios from "axios";

declare const kPISERVICE : string;

export default class KPIReviwer extends API {
  constructor() {
  super('kpisubmission', kPISERVICE);
  }

  

  async updateSubmissionStatus(itemId: string, data: any): Promise<any> {
    try {
      axios.defaults.baseURL = kPISERVICE;
      const response = await axios.post(
        `/kpisubmission/${itemId}/updateSubmissionStatus`,
        data
      );
      return response; // Return full response object
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.data.message);
      }
    }
  }
 
}
