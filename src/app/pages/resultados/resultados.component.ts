import { Component } from '@angular/core';
import { DestinoService } from '@services/destino.service';
import { ReportsService } from '@services/reports.service';
import { Router } from '@angular/router'; // Importar Router

@Component({
  selector: 'app-resultados',
  standalone: true,
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css'],
})
export class ResultadosComponent {
  constructor(
    public destinoService: DestinoService,
    private reportsService: ReportsService,
    private router: Router // Inyectar Router
  ) {}

  destinationAmerica = '';
  destinationEuropa = '';
  destino = this.destinoService.respuestasSer[0];
  climatica = this.destinoService.respuestasSer[1];
  actividad = this.destinoService.respuestasSer[2];
  alojamiento = this.destinoService.respuestasSer[3];
  viaje = this.destinoService.respuestasSer[4];
  edad = this.destinoService.respuestasSer[5];

  volverAtras() {
    this.destinoService.indice = 5;
    this.destinoService.respuestasSer.pop();
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  async enviarDestino() {
    const data = {
      destino: this.destinoService.respuestasSer[0],
      climatica: this.destinoService.respuestasSer[1],
      actividad: this.destinoService.respuestasSer[2],
      alojamiento: this.destinoService.respuestasSer[3],
      viaje: this.destinoService.respuestasSer[4],
      edad: this.destinoService.respuestasSer[5],
    };

    try {
      const response = await this.destinoService.enviarDestino(data);
      this.destinoService.destinationA = response.destinationA;
      this.destinoService.destinationB = response.destinationB;
      sessionStorage.setItem('destinoAmerica', response.destinationA);
      sessionStorage.setItem('destinoEuropa', response.destinationB);
      console.log('Destino A:', this.destinoService.destinationA);
      console.log('Destino E:', this.destinoService.destinationB);

      const userId = sessionStorage.getItem('userId');
      if (!userId) {
        console.error('No se encontró el ID del usuario en el sessionStorage.');
        return;
      } else {
        console.log('ID del usuario recuperado:', userId);
      }

      const reportData = {
        userId: userId,
        reportTime: this.formatDate(new Date()),
        reportData: 'Datos del reporte',
        userQueries: [
          {
            queryTime: this.formatDate(new Date()),
            environmentType: this.destinoService.respuestasSer[0],
            climateType: this.destinoService.respuestasSer[1],
            accommodationType: this.destinoService.respuestasSer[2],
            activityType: this.destinoService.respuestasSer[3],
            stayDuration: this.destinoService.respuestasSer[4],
            ageRange: this.destinoService.respuestasSer[5],
          }
        ]
      };
      console.log('Sending ReportsRequest:', reportData); // Log the request data
      const createdReport = await this.reportsService.createReport(reportData);
      console.log('Reporte creado:', createdReport);

      this.router.navigate(['/destino']);
    } catch (error) {
      console.error('Error al enviar destino o crear reporte:', error);
    }

    if (this.destinoService.destinationA == '') {
      this.destinoService.destinationA = 'Bora Bora';
      this.destinoService.destinationB = 'Dubái';
    }
  }
}
