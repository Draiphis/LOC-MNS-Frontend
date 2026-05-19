import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

type JwtInfo = { sub: string; roles: string };

@Injectable({
  providedIn: 'root',
})
export class Auth {
  readonly jwtInfo = signal<JwtInfo | null>(null);
  httpClient = inject(HttpClient);

  constructor() {
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
    this.jwtInfo.set(null);
  }

  decodeJwt() {
    const jwt = localStorage.getItem('jwt');

    if (jwt) {
      const jwtParts = jwt.split('.');
      const bodyBase64 = jwtParts[1];
      const bodyJson = atob(bodyBase64);
      const body = JSON.parse(bodyJson);
      console.log(body);

      this.jwtInfo.set(body);
    }
  }
}
