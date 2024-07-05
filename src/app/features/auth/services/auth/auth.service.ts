import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getSession() {
    return this.http.get<any>(`${this.apiUrl}/auth/session`, {
      withCredentials: true,
    });
  }
}
