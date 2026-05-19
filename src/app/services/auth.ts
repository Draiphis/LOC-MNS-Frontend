import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  readonly connecte = signal(false);
  httpClient = inject(HttpClient);

  connexion(credentials: { email: string; password: string }) {
    return this.httpClient
      .post('http://localhost:8080/connexion', credentials, {
        responseType: 'text',
      })
      .pipe(
        tap((jwt) => {
          localStorage.setItem('jwt', jwt);
          this.connecte.set(true);
        }),
      );
  }

  deconnexion() {}
}
