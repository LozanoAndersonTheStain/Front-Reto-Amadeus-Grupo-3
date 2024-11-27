import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private apiUrl = 'http://localhost:8080/api/plans';

  constructor() {}

  async getPlansByDestination(destinationName: string): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}/getPlansByDestination`, {
        params: { destinationName },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching plans by destination:', error);
      throw error;
    }
  }
}
