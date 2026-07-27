import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-profil',
  imports: [CommonModule, RouterLink],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil {
  private readonly httpClient = inject(HttpClient);
  protected readonly authService = inject(Auth);

  readonly emprunts = signal<Emprunt[]>([]);
  readonly chargement = signal(true);
  readonly erreur = signal('');

  readonly demandes = computed(() =>
    this.emprunts().filter((emprunt) => emprunt.statut !== 'APPROUVE'),
  );

  readonly reservationsEnCours = computed(() =>
    this.emprunts().filter(
      (emprunt) => emprunt.statut === 'APPROUVE' && emprunt.dateRetourEmpruntReelle === null,
    ),
  );

  ngOnInit(): void {
    this.chargerEmprunts();
  }

  chargerEmprunts(): void {
    this.chargement.set(true);
    this.erreur.set('');

    this.httpClient.get<Emprunt[]>(`${environment.apiUrl}/emprunt/mes-emprunts`).subscribe({
      next: (emprunts) => {
        this.emprunts.set(emprunts);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger vos réservations pour le moment.');
        this.chargement.set(false);
      },
    });
  }

  libelleStatut(statut: string): string {
    const libelles: Record<string, string> = {
      EN_ATTENTE: 'En attente',
      APPROUVE: 'Approuvée',
      REFUSE: 'Refusée',
    };

    return libelles[statut] ?? statut;
  }
}
