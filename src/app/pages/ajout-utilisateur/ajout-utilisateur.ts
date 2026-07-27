import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

type CreationUtilisateur = {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  dateDeNaissance: string;
};

@Component({
  selector: 'app-ajout-utilisateur',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './ajout-utilisateur.html',
  styleUrl: './ajout-utilisateur.css',
})
export class AjoutUtilisateur {
  private readonly formBuilder = inject(FormBuilder);
  private readonly httpClient = inject(HttpClient);

  readonly envoiEnCours = signal(false);
  readonly confirmation = signal('');
  readonly erreur = signal('');
  readonly dateMaxNaissance = this.calculerDateHier();

  readonly formulaire = this.formBuilder.nonNullable.group({
    prenom: ['', [Validators.required, Validators.maxLength(100)]],
    nom: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    dateDeNaissance: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(36)]],
    confirmationPassword: ['', Validators.required],
  });

  creerUtilisateur(): void {
    this.confirmation.set('');
    this.erreur.set('');

    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      return;
    }

    const valeur = this.formulaire.getRawValue();
    if (valeur.password !== valeur.confirmationPassword) {
      this.formulaire.controls.confirmationPassword.setErrors({ motsDePasseDifferents: true });
      return;
    }

    const payload: CreationUtilisateur = {
      email: valeur.email.trim(),
      password: valeur.password,
      nom: valeur.nom.trim(),
      prenom: valeur.prenom.trim(),
      dateDeNaissance: valeur.dateDeNaissance,
    };

    this.envoiEnCours.set(true);
    this.httpClient.post(`${environment.apiUrl}/admin/utilisateurs`, payload).subscribe({
      next: () => {
        this.confirmation.set(
          `Le compte de ${payload.prenom} ${payload.nom} a bien été créé.`,
        );
        this.formulaire.reset();
        this.envoiEnCours.set(false);
      },
      error: (erreur: HttpErrorResponse) => {
        if (erreur.status === 409) {
          this.erreur.set('Cette adresse e-mail est déjà utilisée.');
        } else if (erreur.status === 400) {
          this.erreur.set('Les informations saisies ne sont pas valides.');
        } else {
          this.erreur.set('La création du compte a échoué. Veuillez réessayer.');
        }
        this.envoiEnCours.set(false);
      },
    });
  }

  private calculerDateHier(): string {
    const hier = new Date();
    hier.setDate(hier.getDate() - 1);
    return [
      hier.getFullYear(),
      String(hier.getMonth() + 1).padStart(2, '0'),
      String(hier.getDate()).padStart(2, '0'),
    ].join('-');
  }
}
