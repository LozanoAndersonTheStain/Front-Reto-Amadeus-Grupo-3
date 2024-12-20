import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DestinoService } from '@services/destino.service';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-destino',
  standalone: true,
  imports: [NgIf, RouterModule],
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
  asia: any[] = [];
  oceania: any[] = [];
  loading: boolean = true;
  showExoticMessage: boolean = false;
  loadingImages: boolean = true;
  maxAttempts: number = 3
  attempts: number = 0

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
        console.error('destinoAmerica o destinoEuropa son nulos');
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
        console.log('Response:', response);
        if (Array.isArray(response) && response.length > 0) {
          this.destinos = response;
        }
        this.filtrarDestinos();
        this.loading = false;
        this.cdr.detectChanges();

        setTimeout(() => {
          if ((!this.america[0]?.img || !this.europa[0]?.img) && this.attempts < this.maxAttempts) {
            this.attempts++;
            this.destino();
          } else {
            this.loadingImages = false;
            this.cdr.detectChanges();
          }
        }, 3000);
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
      this.asia = this.destinos.filter(
        (destino) => destino.continente === 'Asia'
      );
      this.oceania = this.destinos.filter(
        (destino) => destino.continente === 'Oceanía'
      );
      this.showExoticMessage = this.destinos.some(
        (destino) => destino.continente === 'Oceanía' || destino.continente === 'Asia'
      );
      console.log('América:', this.america);
      console.log('Europa:', this.europa);
      console.log('Asia:', this.asia);
      console.log('Oceanía:', this.oceania);
      console.log('Mostrar mensaje exótico:', this.showExoticMessage);
    } else {
      console.error('this.destinos no es un array');
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
