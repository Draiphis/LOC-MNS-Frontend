import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

type JwtInfo = {
  sub: string;
  roles: string[];
};

@Injectable({
  providedIn: 'root',
})
export class Auth {
  readonly jwtInfo = signal<JwtInfo | null>(null);
  private httpClient = inject(HttpClient);

  constructor() {
    this.init();
  }

  // 👉 point d’entrée propre
  init() {
    this.decodeJwt();
  }

  connexion(credentials: { email: string; password: string }) {
    return this.httpClient
      .post(`${environment.apiUrl}/connexion`, credentials, {
        responseType: 'text',
      })
      .pipe(
        tap((jwt) => {
          localStorage.setItem('jwt', jwt);
          this.decodeJwt();
        }),
      );
  }

  deconnexion() {
    localStorage.removeItem('jwt');
    this.jwtInfo.set(null);
  }

  decodeJwt() {
    const jwt = localStorage.getItem('jwt');

    if (!jwt) {
      this.jwtInfo.set(null);
      return;
    }

    const parts = jwt.split('.');

    if (parts.length !== 3) {
      this.jwtInfo.set(null);
      return;
    }

    try {
      const payload = JSON.parse(atob(parts[1]));

      let roles: string[] = [];

      if (Array.isArray(payload.roles)) {
        roles = payload.roles;
      } else if (typeof payload.roles === 'string') {
        roles = payload.roles.split(',').map((r: string) => r.trim());
      } else if (payload.role) {
        roles = [payload.role];
      }

      this.jwtInfo.set({
        sub: payload.sub,
        roles,
      });
    } catch (e) {
      console.error('Erreur decode JWT', e);
      this.jwtInfo.set(null);
    }
  }

  // 👉 helpers utiles (très recommandé)

  isLogged(): boolean {
    return this.jwtInfo() !== null;
  }

  hasRole(role: string): boolean {
    return this.jwtInfo()?.roles.includes(role) ?? false;
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }
}
