import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/user';

  async authenticateUser(name: string, email: string): Promise<boolean> {
    console.log('Authenticating user with name:', name, 'and email:', email);
    try {
      const response = await axios.post(`${this.apiUrl}/authenticate`, null, {
        params: { name, email },
      });
      if (response.data.success) {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('userId', response.data.id);
          sessionStorage.setItem('name', response.data.name);
          sessionStorage.setItem('email', response.data.email);
          sessionStorage.setItem('birthdate', response.data.birthdate);
          sessionStorage.setItem('userRole', response.data.role.toLowerCase());
        } else {
          console.warn('sessionStorage is not available');
        }
        return true;
      } else {
        return false;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 401) {
          console.error('User not found or credentials are incorrect');
        } else {
          console.error('Authentication failed', error);
        }
      } else {
        console.error('An unexpected error occurred', error);
      }
      return false;
    }
  }

  async createUser(
    name: string,
    email: string,
    birthdate: string
  ): Promise<boolean> {
    console.log(
      'Creating user with name:',
      name,
      'email:',
      email,
      'and birthdate:',
      birthdate
    );
    try {
      const response = await axios.post(`${this.apiUrl}/create`, {
        name,
        email,
        birthdate,
        role: 'user',
      });
      if (response.status === 201) {
        return true;
      } else {
        console.error('User creation failed');
        return false;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 409) {
          alert('User already exists: Go and Login');
        } else {
          console.error('User creation failed', error);
        }
      } else {
        console.error('An unexpected error occurred', error);
      }
      return false;
    }
  }
}
