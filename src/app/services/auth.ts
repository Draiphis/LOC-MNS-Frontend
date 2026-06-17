import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

type JwtInfo = {
  sub: string;
  roles: string;
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
      .post('http://localhost:8080/connexion', credentials, {
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

    // 👉 sécurité structure JWT
    if (parts.length !== 3) {
      console.warn('JWT invalide');
      this.jwtInfo.set(null);
      return;
    }

    try {
      const payload = JSON.parse(atob(parts[1]));

      this.jwtInfo.set({
        sub: payload.sub,
        roles: payload.roles,
      });

      console.log('JWT decoded:', payload);
    } catch (e) {
      console.error('Erreur decode JWT', e);
      this.jwtInfo.set(null);
    }
  }

  // 👉 helpers utiles (très recommandé)

  isLogged(): boolean {
    return this.jwtInfo() !== null;
  }

  getRoles(): string[] {
    const roles = this.jwtInfo()?.roles;
    return roles ? roles.split(',').map((r) => r.trim()) : [];
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }
}
