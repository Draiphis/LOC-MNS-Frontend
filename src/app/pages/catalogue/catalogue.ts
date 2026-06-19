import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-catalogue',
  imports: [RouterModule],
  templateUrl: './catalogue.html',
  styleUrl: './catalogue.css',
})
export class Catalogue {
  modeles = signal<Modele[]>([]);
  types = signal<Type[]>([]);
  marques = signal<Marque[]>([]);

  typeSelectionne = signal('');
  marqueSelectionnee = signal('');
  estDisponibleImmediatement = signal(false);

  httpClient = inject(HttpClient);

  ngOnInit() {
    this.chargerModeles();
    this.chargerTypes();
    this.chargerMarques();
    console.log('fin');
  }

  filtreDisponibleMaintenant(event: Event) {
    const verifier = (event.target as HTMLInputElement).checked;
    this.estDisponibleImmediatement.set(verifier);

    this.chargerModeles();
  }

  filtreType(event: Event) {
    const valeur = (event.target as HTMLSelectElement).value;

    this.typeSelectionne.set(valeur);

    this.chargerModeles();
  }
  filtreMarque(event: Event) {
    const valeur = (event.target as HTMLSelectElement).value;

    this.marqueSelectionnee.set(valeur);

    this.chargerModeles();
  }

  chargerModeles() {
    let url = `${environment.apiUrl}/modele/list`;

    const params = new URLSearchParams();

    if (this.typeSelectionne()) {
      params.append('type', this.typeSelectionne());
    }

    if (this.marqueSelectionnee()) {
      params.append('marque', this.marqueSelectionnee());
    }

    if (this.estDisponibleImmediatement()) {
      params.append('disponible', 'true');
    }

    const queryString = params.toString();

    if (queryString) {
      url += '?' + queryString;
    }

    this.httpClient.get<Modele[]>(url).subscribe((modeles) => {
      this.modeles.set(modeles);
    });
  }

  chargerTypes() {
    this.httpClient.get<Type[]>(`${environment.apiUrl}/type/stock`).subscribe((listTypes) => {
      console.log('Types reçus :', listTypes);
      this.types.set(listTypes);
    });
  }

  chargerMarques() {
    this.httpClient.get<Marque[]>(`${environment.apiUrl}/marque/list`).subscribe((listMarques) => {
      this.marques.set(listMarques);
    });
  }
}
