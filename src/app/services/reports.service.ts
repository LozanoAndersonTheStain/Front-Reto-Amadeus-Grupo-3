import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private apiUrl = 'http://localhost:8080/api/reports';

  async createReport(reportData: any): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/createReport`, reportData);
      return response.data;
    } catch (error) {
      console.error('Error al crear el reporte:', error);
      throw error;
    }
  }

  async getReportData(params: any): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}/getAllReports`, { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener los datos del reporte:', error);
      throw error;
    }
  }
}