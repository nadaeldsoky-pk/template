import API from "@/API/API";
declare const kPISERVICE: string;
declare const BASEPATH: string;
declare const USERSERVICE: string;
declare const DASESCHEMANODE: string;
declare const GRCSERVICE: string;
declare const ITSMSERVICE: string;
declare const LogAndNotification: string;

import axios from "axios";
export default class FormulaVariable extends API {
  constructor() {
    super('formula-variable', kPISERVICE)
  }



  async getFillable(moduleName: string, pathType: string): Promise<any> {
    try {
      // Get the base URL from window object based on pathType
      const baseUrl = this.getServiceBaseUrl(pathType);
      
      console.log("baseUrl" , baseUrl);
      console.log("pathType" , pathType);
      
      if (!baseUrl) {
        throw new Error(`No base URL found for path type: ${pathType}`);
      }
  
      axios.defaults.baseURL = baseUrl;
      const response = await axios.get(`/getFillable/${moduleName}`);
  
      if (response?.data && response.data.length > 0) {
        return response;
      }
  
      // If no data, you might want to handle this case
      throw new Error('No data received from API');
  
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error(`Error from ${pathType}:`, error.message);
        throw error;
      }
      // For 404 errors, you might want to handle them differently
      throw error;
    }
  }


  
  async calculateAggregates(data: any, pathType: string): Promise<any> {
    try {
      const baseUrl = this.getServiceBaseUrl(pathType);
      if (!baseUrl) {
        throw new Error(`No base URL found for path type: ${pathType}`);
      }
  
      axios.defaults.baseURL = baseUrl;
      const response = await axios.post(`/calculate-aggregates`, data);
      
      // Return the entire response and let the component handle the structure
      return response;
      
    } catch (error: any) {
      console.error(`Error calculating aggregates:`, error);
      // Return a consistent error structure
      return {
        status: error.response?.status || 500,
        data: {
          error: error.message,
          details: error.response?.data
        }
      };
    }
  }
  




  // Helper method to get the base URL from window variables
  private getServiceBaseUrl(pathType: string): string {
    const serviceMap: Record<string, string> = {
      'BASEPATH': BASEPATH,
      'USERSERVICE': USERSERVICE,
      'DASESCHEMANODE': DASESCHEMANODE,
      'GRCSERVICE': GRCSERVICE,
      'ITSMSERVICE': ITSMSERVICE,
      'LogAndNotification': LogAndNotification,
      'kPISERVICE': kPISERVICE
    };
  
    return serviceMap[pathType] || BASEPATH; // Fallback to BASEPATH if not found
  }

 
}
