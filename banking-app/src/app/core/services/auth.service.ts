import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = environment.apiUrl;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  register(data: any): Observable<any> {

    return this.http.post(
      `${this.api}/auth/register`,
      data
    );
  }

  login(data: any): Observable<any> {

    return this.http.post<any>(
      `${this.api}/auth/login`,
      data
    ).pipe(
      tap(res => {
        if (res.token) {
          this.saveToken(res.token);
        }
      })
    );
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
      localStorage.clear();
    }
  }

  isLoggedIn(): boolean {

    return !!this.getToken();
  }
}