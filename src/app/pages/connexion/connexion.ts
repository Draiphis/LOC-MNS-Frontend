import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-connexion',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './connexion.html',
  styleUrl: './connexion.css',
})
export class Connexion {
  formBuilder = inject(FormBuilder);
  httpClient = inject(HttpClient);
  route = inject(ActivatedRoute);

  formulaire = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', [Validators.required]],
  });

  onConnexion() {
    if (this.formulaire.valid) {
      this.httpClient
        .post('http://localhost:8080/connexion', this.formulaire.value, {
          responseType: 'text',
        })
        .subscribe({
          next: (jwt) => {
            localStorage.setItem('jwt', jwt);
            alert('Connexion Réussie');
          },
          error: (err) => {
            alert('Mauvais login/mot de passe');
          },
        });
    }
  }
}
