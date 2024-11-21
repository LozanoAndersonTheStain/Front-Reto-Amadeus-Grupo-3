import { Component } from '@angular/core';
import { DestinoService } from '@services/destino.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.css',
})
export class ResultadosComponent {
  constructor(public destinoService: DestinoService) {}

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

  enviarDestino() {
    const data = {
      destino: this.destinoService.respuestasSer[0],
      climatica: this.destinoService.respuestasSer[1],
      actividad: this.destinoService.respuestasSer[2],
      alojamiento: this.destinoService.respuestasSer[3],
      viaje: this.destinoService.respuestasSer[4],
      edad: this.destinoService.respuestasSer[5],
    };

    this.destinoService.enviarDestino(data).then((response: any) => {
      this.destinoService.destinationA = response.destinationA;
      this.destinoService.destinationB = response.destinationB;
      sessionStorage.setItem('destinoAmerica', response.destinationA);
      sessionStorage.setItem('destinoEuropa', response.destinationB);
      console.log('Destino A:', this.destinoService.destinationA);
      console.log('Destino E:', this.destinoService.destinationB);
    }).catch((error: any) => {
      console.error('Error al enviar destino:', error);
    });

    if (this.destinoService.destinationA == '') {
      this.destinoService.destinationA = 'Bora Bora';
      this.destinoService.destinationB = 'Dubái';
    }
  }
}
