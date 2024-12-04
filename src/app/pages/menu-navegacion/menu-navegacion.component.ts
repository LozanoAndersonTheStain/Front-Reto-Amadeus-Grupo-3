import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioComponent } from '../usuario/usuario.component';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-menu-navegacion',
  standalone: true,
  imports: [CommonModule, RouterLink, UsuarioComponent],
  templateUrl: './menu-navegacion.component.html',
  styleUrl: './menu-navegacion.component.css'
})
export class MenuNavegacionComponent implements OnInit {
  isAdmin = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (typeof sessionStorage !== 'undefined') {
      const userRole = sessionStorage.getItem('userRole');
      this.isAdmin = userRole === 'admin';
    } else {
      console.log('sessionStorage no está disponible');
    }
  }

  resetSessionStorage(): void {
    sessionStorage.clear();
    localStorage.clear(); // Limpiar también el localStorage
  }
}
