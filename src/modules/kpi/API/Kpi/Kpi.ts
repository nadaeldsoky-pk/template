import API from "@/API/API";
import axios from "axios";

declare const kPISERVICE : string;
export default class Kpi extends API {
  constructor() {
    super('kpi' , kPISERVICE)
  }

  async changeStatus(itemId: string): Promise<any> {
    try {
      axios.defaults.baseURL = kPISERVICE;
      const response = await axios.get(
        `/update-status/${itemId}`
      );
      return response;
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.data.message);
      }
    }
  }
}
