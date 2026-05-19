import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

type JwtInfo = { sub: string; role: string };

@Injectable({
  providedIn: 'root',
})
export class Auth {
  readonly jwtInfo = signal<JwtInfo | null>(null);
  httpClient = inject(HttpClient);

  connexion(credentials: { email: string; password: string }) {
    return this.httpClient
      .post('http://localhost:8080/connexion', credentials, {
        responseType: 'text',
      })
      .pipe(
        tap((jwt) => {
          localStorage.setItem('jwt', jwt);

          const jwtParts = jwt.split('.');
          const bodyBase64 = jwtParts[1];
          const bodyJson = atob(bodyBase64);
          const body = JSON.parse(bodyJson);
          console.log(body);

          this.jwtInfo.set(body);
        }),
      );
  }

  deconnexion() {
    this.jwtInfo.set(null);
  }
}
