import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/user';

  async authenticateUser(name: string, email: string): Promise<boolean> {
    console.log('Autenticando usuario con nombre:', name, 'y email:', email);
    try {
      const response = await axios.post(`${this.apiUrl}/authenticate`, null, {
        params: { name, email },
      });
      if (response.data.success) {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('userId', response.data.id);
          sessionStorage.setItem('name', response.data.name);
          sessionStorage.setItem('email', response.data.email);
          sessionStorage.setItem('userRole', response.data.role.toLowerCase());
        } else {
          console.warn('sessionStorage no está disponible');
        }
        return true;
      } else {
        return false;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 401) {
          console.error('Usuario no encontrado o credenciales incorrectas');
        } else {
          console.error('Autenticación fallida', error);
        }
      } else {
        console.error('Se ha producido un error inesperado', error);
      }
      return false;
    }
  }

  async createUser(
    name: string,
    email: string,
  ): Promise<boolean> {
    console.log(
      'Creando usuario con nombre:',
      name,
      'y email:',
      email,
    );
    try {
      const response = await axios.post(`${this.apiUrl}/create`, {
        name,
        email,
        role: 'user',
      });
      if (response.status === 201) {
        return true;
      } else {
        console.error('Error en la creación de usuario');
        return false;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 409) {
          alert('El usuario ya existe: Ir e iniciar sesión');
        } else {
          console.error('Error en la creación de usuario', error);
        }
      } else {
        console.error('Se ha producido un error inesperado', error);
      }
      return false;
    }
  }

  async getUserEmail(): Promise<string> {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem('email') ?? '';
    } else {
      console.warn('sessionStorage no está disponible');
      return '';
    }
  }
}
