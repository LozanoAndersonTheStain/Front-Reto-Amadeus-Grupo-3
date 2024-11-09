import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/authenticate';

  async authenticateUser(name: string, email: string): Promise<boolean> {
    console.log('Authenticating user with name:', name, 'and email:', email);
    try {
      const response = await axios.post(this.apiUrl, null, {
        params: { name, email },
      });
      if (response.data.success) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 404) {
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
}
