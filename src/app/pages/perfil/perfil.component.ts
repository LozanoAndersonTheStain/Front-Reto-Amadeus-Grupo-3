import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DestinoService } from '@services/destino.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';

enum AvatarImages {
  AVATAR1 = 'assets/img/img-avatar/ava11.png',
  AVATAR2 = 'assets/img/img-avatar/ava12.png',
  AVATAR3 = 'assets/img/img-avatar/ava13.png',
  AVATAR4 = 'assets/img/img-avatar/ava14.png',
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, NgIf],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements AfterViewInit {
  @ViewChildren('slidesElements') slidesElements!: QueryList<ElementRef>;
  @ViewChildren('dotElement') dotElemets!: QueryList<ElementRef>;

  constructor(public destinoService: DestinoService, private authService: AuthService, private router: Router) {}

  slideIndex: number = 1;
  showCreateAccountForm: boolean = false;

  ngAfterViewInit(): void {
    this.showSlides(this.slideIndex);
  }

  plusSlides(n: number): void {
    this.showSlides(this.slideIndex += n);
  }

  currentSlide(n: number): void {
    this.showSlides(this.slideIndex = n);
  }

  showSlides(n: number): void {
    const slides = this.slidesElements?.toArray();
    const dots = this.dotElemets?.toArray();

    if (!slides || !dots) {
      return;
    }

    if (n > slides.length) {
      this.slideIndex = 1;
    }
    if (n < 1) {
      this.slideIndex = slides.length;
    }

    slides.forEach((slide) => {
      slide.nativeElement.style.display = 'none';
    });

    dots.forEach((dot) => {
      dot.nativeElement.className = dot.nativeElement.className.replace(
        ' active',
        ''
      );
    });

    slides[this.slideIndex - 1].nativeElement.style.display = 'block';
    dots[this.slideIndex - 1].nativeElement.className += ' active';
  }

  nombre = new FormControl();
  correo = new FormControl();
  birthdate = new FormControl();

  async datosUsuario() {
    console.log('Autenticación de usuario con nombre:', this.nombre.value, 'y email:', this.correo.value);
    const isAuthenticated = await this.authService.authenticateUser(this.nombre.value, this.correo.value);
    if (isAuthenticated) {
      this.destinoService.nombreS = this.nombre.value;
      this.destinoService.correoS = this.correo.value;

      switch(this.slideIndex){
        case 1: {
          this.destinoService.avatar = AvatarImages.AVATAR1;
          break;
        }
        case 2: {
          this.destinoService.avatar = AvatarImages.AVATAR2;
          break;
        }
        case 3: {
          this.destinoService.avatar = AvatarImages.AVATAR3;
          break;
        }
        case 4: {
          this.destinoService.avatar = AvatarImages.AVATAR4;
          break;
        }
      }

      this.router.navigate(['/tarjetas']);
    } else {
      console.error('Error de autenticación de usuario');
      alert('Ha fallado la autenticación de usuario. Compruebe sus credenciales e inténtelo de nuevo.');
    }
  }

  async crearCuenta() {
    const isCreated = await this.authService.createUser(this.nombre.value, this.correo.value);
    if (isCreated) {
      alert('Cuenta creada exitosamente. Por favor, inicia sesión.');
      this.toggleCreateAccountForm();
    } else {
      console.error('Error en la creación de usuario');
      alert('La creación de la cuenta falló. Por favor, inténtalo de nuevo.');
    }
  }

  estadoCorreo = "";
  controlBoton = true;

  verificarNomb(event: Event){
    let nomUsuario = this.nombre.value;
    if (nomUsuario == ""){
      this.estadoCorreo = 'Escriba su nombre';
    }
  }

  verificarCorreo(event: Event): void {
    const regEmail = /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
    const validDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com'];
    const correoUsuario = this.correo.value;
    const domain = correoUsuario.split('@')[1];
    const checkbox = document.getElementById('data-accepted') as HTMLInputElement;

    if (!regEmail.test(correoUsuario) || !checkbox.checked || !validDomains.includes(domain)) {
      if (!regEmail.test(correoUsuario)) {
        this.estadoCorreo = 'Correo no válido';
      } else if (!checkbox.checked) {
        this.estadoCorreo = 'Debe aceptar los términos y condiciones';
      } else if (!validDomains.includes(domain)) {
        this.estadoCorreo = 'El dominio del correo no es válido';
      }
      this.controlBoton = true;
    } else {
      this.estadoCorreo = '';
      this.controlBoton = false;
    }

    checkbox.addEventListener('change', () => {
      this.verificarCorreo(event);
    });
  }

  toggleCreateAccountForm(): void {
    this.showCreateAccountForm = !this.showCreateAccountForm;
  }
}
