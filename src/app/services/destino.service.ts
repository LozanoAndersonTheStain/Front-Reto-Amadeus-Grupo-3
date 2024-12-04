import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class DestinoService {
  private apiUrl = 'http://localhost:8080/api/destination';

  async getDestinationInfo(
    destination1: string,
    destination2: string
  ): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}/getByName`, {
        params: { destination1, destination2 },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener la información de destino:', error);
      throw error;
    }
  }

  async enviarDestino(destinoRequest: any): Promise<any> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/sedDestination`,
        destinoRequest
      );
      return response.data;
    } catch (error) {
      console.error('Error al enviar destino:', error);
      throw error;
    }
  }

  indice: number = 0;
  destinationA: String = '';
  destinationB: String = '';
  respuestasSer: String[] = [];
  nombreS: String = '';
  correoS: String = '';
  avatar: String = 'https://cdn-icons-png.flaticon.com/512/9187/9187532.png';
  srcA: String = '';
  srcE: String = '';
}
