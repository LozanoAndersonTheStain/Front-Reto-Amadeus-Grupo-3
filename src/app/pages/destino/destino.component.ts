import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DestinoService } from '@services/destino.service';
import { Router, RouterModule } from '@angular/router'; // Importar RouterModule
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-destino',
  standalone: true,
  imports: [NgIf, RouterModule], // Asegúrate de importar RouterModule aquí
  templateUrl: './destino.component.html',
  styleUrls: ['./destino.component.css'],
})
export class DestinoComponent implements OnInit {
  constructor(
    public destinoService: DestinoService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  control: boolean = true;
  destinos: any[] = [];
  america: any[] = [];
  europa: any[] = [];
  loading: boolean = true;
  showExoticMessage: boolean = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.destino();
    }, 5);
  }

  async destino() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const destinoAmerica = sessionStorage.getItem('destinoAmerica');
      const destinoEuropa = sessionStorage.getItem('destinoEuropa');

      if (!destinoAmerica || !destinoEuropa) {
        console.error('destinoAmerica or destinoEuropa is null');
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }

      if (destinoAmerica === 'Bora Bora') {
        this.control = false;
      } else {
        this.control = true;
      }

      try {
        const response = await this.destinoService.getDestinationInfo(destinoAmerica, destinoEuropa);
        console.log('Response:', response); // Verificar los datos recibidos
        if (Array.isArray(response) && response.length > 0) {
          this.destinos = response;
        }
        this.filtrarDestinos();
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Destinos:', this.destinos); // Verificar los destinos procesados
      } catch (error) {
        console.error('Error', error);
        this.filtrarDestinos();
        this.loading = false;
        this.cdr.detectChanges();
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
      this.showExoticMessage = this.destinos.some(
        (destino) => destino.continente === 'Oceanía' || destino.continente === 'Asia'
      );
      console.log('América:', this.america);
      console.log('Europa:', this.europa);
      console.log('Show Exotic Message:', this.showExoticMessage);
    } else {
      console.error('this.destinos is not an array');
    }
  }

  resetForm(): void {
    this.destinoService.respuestasSer = [];
    this.destinoService.indice = 0;
    sessionStorage.removeItem('destinoAmerica');
    sessionStorage.removeItem('destinoEuropa');
    this.router.navigate(['/tarjetas']);
  }
}
