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
      console.error('Error al buscar planes por destino:', error);
      throw error;
    }
  }

  async sendDestinationInfoByEmail(destinationName: string, userEmail: string, plan: any): Promise<void> {
    try {
      await axios.post(`${this.apiUrl}/sendDestinationInfoByEmail`, { destinationName, email: userEmail, plan });
    } catch (error) {
      console.error('Error al enviar información de destino por correo electrónico:', error);
      throw error;
    }
  }
}
