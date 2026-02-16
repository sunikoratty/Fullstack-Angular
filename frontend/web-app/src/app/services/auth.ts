import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  api = 'http://localhost:5000/api';

  register(data: any) {
    return this.http.post(`${this.api}/register`, data);
  }

  login(data: any) {
    return this.http.post<any>(`${this.api}/login`, data);
  }

  saveToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

   getProfile() {
    return this.http.get<any>(`${this.api}/profile`);
  }

  updateProfile(data: any) {
    return this.http.put<any>(`${this.api}/profile`, data);
  }
}
