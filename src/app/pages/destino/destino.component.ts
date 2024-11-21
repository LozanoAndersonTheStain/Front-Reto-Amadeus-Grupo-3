import { Component, OnInit } from '@angular/core';
import { DestinoService } from '@services/destino.service';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-destino',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './destino.component.html',
  styleUrl: './destino.component.css',
})
export class DestinoComponent implements OnInit {
  constructor(public destinoService: DestinoService) {}

  control: boolean = true;
  destinos: any[] = [];
  america: any[] = [];
  europa: any[] = [];

  ngOnInit(): void {
    setTimeout(() => {
      this.destino();
    }, 5);
  }

  destino() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const destinoAmerica = sessionStorage.getItem('destinoAmerica');
      const destinoEuropa = sessionStorage.getItem('destinoEuropa');

      if (destinoAmerica === 'Bora Bora') {
        this.control = false;
      } else {
        this.control = true;
      }

      if (destinoAmerica && destinoEuropa) {
        this.destinoService
          .getDestinationInfo(destinoAmerica, destinoEuropa)
          .then((response) => {
            if (Array.isArray(response)) {
              this.destinos = response;
              this.filtrarDestinos();
              console.log(response);
            } else {
              console.error('Response is not an array:', response);
            }
          })
          .catch((error) => {
            console.error('Error', error);
          });
      } else {
        console.error('destinoAmerica or destinoEuropa is null');
      }
    } else {
      console.error('sessionStorage is not available');
    }
  }

  filtrarDestinos(): void {
    if (Array.isArray(this.destinos)) {
      this.america = this.destinos.filter(
        (destino) => destino.continente === 'América'
      );
      this.europa = this.destinos.filter(
        (destino) => destino.continente === 'Europa'
      );
    } else {
      console.error('this.destinos is not an array');
    }
  }
}
