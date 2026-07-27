import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

type JourCalendrier = {
  iso: string;
  numero: number;
};

@Component({
  selector: 'app-demande-emprunt',
  imports: [],
  templateUrl: './demande-emprunt.html',
  styleUrl: './demande-emprunt.css',
})
export class DemandeEmprunt {
  route = inject(ActivatedRoute);
  httpClient = inject(HttpClient);

  modele = signal<Modele | null>(null);
  disponibilite = signal<DisponibiliteModele | null>(null);
  chargementDisponibilite = signal(true);
  dateMinimum = signal(this.aujourdhuiIso());
  dateMaximum = signal(this.ajouterUnAn(this.aujourdhuiIso()));
  datesIndisponibles = signal<Set<string>>(new Set());
  moisAffiche = signal(this.debutDuMois(this.aujourdhuiIso()));
  joursSemaine = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  dateDebut = '';
  dateFin = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.chargementDisponibilite.set(false);
      return;
    }

    this.httpClient.get<Modele>(`${environment.apiUrl}/modele/` + id).subscribe((data) => {
      this.modele.set(data);
    });

    this.httpClient
      .get<DisponibiliteModele>(`${environment.apiUrl}/materiel/disponibilite-modele/${id}`)
      .subscribe({
        next: (disponibilite) => {
          this.disponibilite.set(disponibilite);

          if (disponibilite.dateDisponibleAPartirDe) {
            this.dateMinimum.set(disponibilite.dateDisponibleAPartirDe);
            this.moisAffiche.set(this.debutDuMois(disponibilite.dateDisponibleAPartirDe));
          }
          this.datesIndisponibles.set(new Set(disponibilite.datesIndisponibles));

          this.chargementDisponibilite.set(false);
        },
        error: () => {
          this.disponibilite.set({
            reservable: false,
            dateDisponibleAPartirDe: null,
            nombreExemplaires: 0,
            message: 'La disponibilité de ce modèle ne peut pas être chargée.',
            datesIndisponibles: [],
          });
          this.chargementDisponibilite.set(false);
        },
      });
  }

  getImage(): string {
    return this.modele()?.image
      ? 'assets/images/modeles/' + this.modele()?.image + '.webp'
      : 'assets/images/modeles/default.webp';
  }

  joursDuCalendrier(): Array<JourCalendrier | null> {
    const mois = this.lireDate(this.moisAffiche());
    const premierJour = new Date(mois.getFullYear(), mois.getMonth(), 1);
    const dernierJour = new Date(mois.getFullYear(), mois.getMonth() + 1, 0);
    const blancsAvant = (premierJour.getDay() + 6) % 7;
    const jours: Array<JourCalendrier | null> = Array.from(
      { length: blancsAvant },
      () => null,
    );

    for (let numero = 1; numero <= dernierJour.getDate(); numero++) {
      jours.push({
        iso: this.dateIso(mois.getFullYear(), mois.getMonth(), numero),
        numero,
      });
    }

    return jours;
  }

  libelleMois(): string {
    return new Intl.DateTimeFormat('fr-FR', {
      month: 'long',
      year: 'numeric',
    }).format(this.lireDate(this.moisAffiche()));
  }

  moisPrecedent() {
    const mois = this.lireDate(this.moisAffiche());
    mois.setMonth(mois.getMonth() - 1);
    this.moisAffiche.set(this.dateIso(mois.getFullYear(), mois.getMonth(), 1));
  }

  moisSuivant() {
    const mois = this.lireDate(this.moisAffiche());
    mois.setMonth(mois.getMonth() + 1);
    this.moisAffiche.set(this.dateIso(mois.getFullYear(), mois.getMonth(), 1));
  }

  peutAfficherMoisPrecedent(): boolean {
    return this.moisAffiche() > this.debutDuMois(this.dateMinimum());
  }

  peutAfficherMoisSuivant(): boolean {
    return this.moisAffiche() < this.debutDuMois(this.dateMaximum());
  }

  jourDesactive(iso: string): boolean {
    return (
      this.disponibilite()?.reservable !== true ||
      iso < this.dateMinimum() ||
      iso > this.dateMaximum() ||
      this.datesIndisponibles().has(iso)
    );
  }

  selectionnerJour(iso: string) {
    if (this.jourDesactive(iso)) {
      return;
    }

    if (!this.dateDebut || this.dateFin || iso <= this.dateDebut) {
      this.dateDebut = iso;
      this.dateFin = '';
      return;
    }

    if (!this.periodeDisponible(this.dateDebut, iso)) {
      alert('Cette période contient au moins une journée indisponible.');
      return;
    }

    this.dateFin = iso;
  }

  jourDansPeriode(iso: string): boolean {
    return !!this.dateDebut && !!this.dateFin && iso > this.dateDebut && iso < this.dateFin;
  }

  private periodeDisponible(dateDebut: string, dateFin: string): boolean {
    for (
      let date = this.lireDate(dateDebut);
      date <= this.lireDate(dateFin);
      date.setDate(date.getDate() + 1)
    ) {
      const iso = this.dateIso(date.getFullYear(), date.getMonth(), date.getDate());
      if (this.jourDesactive(iso)) {
        return false;
      }
    }
    return true;
  }

  peutReserver(): boolean {
    return (
      this.disponibilite()?.reservable === true &&
      !!this.dateDebut &&
      !!this.dateFin &&
      this.dateDebut >= this.dateMinimum() &&
      this.dateFin > this.dateDebut
    );
  }

  reserver() {
    if (!this.peutReserver()) {
      alert('Veuillez sélectionner une période disponible avec une date de fin postérieure.');
      return;
    }

    const emprunt = {
      modeleId: this.modele()?.id,
      dateDebutEmprunt: this.dateDebut,
      dateRetourEmpruntPrevisionelle: this.dateFin,
    };

    this.httpClient.post(`${environment.apiUrl}/emprunt/create`, emprunt).subscribe({
      next: () => {
        alert('Demande envoyée avec succès');
      },
      error: (err) => {
        if (err.status === 409) {
          alert(
            "La période vient d'être réservée ou aucun exemplaire n'est disponible sur toutes ces dates.",
          );
        } else {
          alert('Erreur lors de la réservation');
        }
      },
    });
  }

  private aujourdhuiIso(): string {
    const date = new Date();
    const decalageLocal = date.getTimezoneOffset() * 60_000;
    return new Date(date.getTime() - decalageLocal).toISOString().slice(0, 10);
  }

  private ajouterUnAn(iso: string): string {
    const date = this.lireDate(iso);
    date.setFullYear(date.getFullYear() + 1);
    return this.dateIso(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private debutDuMois(iso: string): string {
    const date = this.lireDate(iso);
    return this.dateIso(date.getFullYear(), date.getMonth(), 1);
  }

  private lireDate(iso: string): Date {
    return new Date(`${iso}T00:00:00`);
  }

  private dateIso(annee: number, mois: number, jour: number): string {
    return `${annee}-${String(mois + 1).padStart(2, '0')}-${String(jour).padStart(2, '0')}`;
  }
}
