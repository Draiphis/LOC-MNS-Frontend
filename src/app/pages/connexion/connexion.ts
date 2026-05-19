import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './connexion.html',
  styleUrl: './connexion.css',
})
export class Connexion {
  formBuilder = inject(FormBuilder);
  httpClient = inject(HttpClient);
  route = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(Auth);

  formulaire = this.formBuilder.group({
    email: ['jean.dupont@example.com', [Validators.required, Validators.email]],
    password: ['rootroot', [Validators.required]],
  });

  onConnexion() {
    if (this.formulaire.valid) {
      this.authService
        .connexion(this.formulaire.value as { email: string; password: string })
        .subscribe({
          next: (jwt) => {
            alert('Connexion Réussie');
            this.router.navigateByUrl('/catalogue');
          },
          error: (err) => {
            alert('Mauvais login/mot de passe');
          },
        });
    }
  }
}
