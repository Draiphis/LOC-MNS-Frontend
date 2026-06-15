import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-demande-emprunt',
  imports: [FormsModule],
  templateUrl: './demande-emprunt.html',
  styleUrl: './demande-emprunt.css',
})
export class DemandeEmprunt {
  route = inject(ActivatedRoute);
  httpClient = inject(HttpClient);

  modele = signal<Modele | null>(null);

  dateDebut = '';
  dateFin = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.httpClient.get<Modele>('http://localhost:8080/modele/' + id).subscribe((data) => {
      this.modele.set(data);
    });
  }

  getImage(): string {
    return this.modele()?.image
      ? 'assets/images/modeles/' + this.modele()?.image + '.webp'
      : 'assets/images/modeles/default.webp';
  }

  reserver() {
    const emprunt = {
      modeleId: this.modele()?.id,
      dateDebutEmprunt: this.dateDebut,
      dateRetourEmpruntPrevisionelle: this.dateFin,
    };

    this.httpClient.post('http://localhost:8080/emprunt/create', emprunt).subscribe({
      next: () => {
        alert('Demande envoyée avec succès');
      },
      error: (err) => {
        if (err.status === 409) {
          alert('Aucun matériel disponible pour ce modèle');
        } else {
          alert('Erreur lors de la réservation');
        }
      },
    });
  }
}
