import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-catalogue',
  imports: [RouterModule],
  templateUrl: './catalogue.html',
  styleUrl: './catalogue.css',
})
export class Catalogue {
  modeles = signal<Modele[]>([]);
  types = signal<Type[]>([]);

  estDisponibleImmediatement = signal(false);

  httpClient = inject(HttpClient);

  ngOnInit() {
    this.chargerModeles();
    this.chargerTypes();
    console.log('fin');
  }

  filtreDisponibleMaintenant(event: Event) {
    const verifier = (event.target as HTMLInputElement).checked;
    this.estDisponibleImmediatement.set(verifier);

    this.chargerModeles();
  }

  chargerModeles() {
    const url = this.estDisponibleImmediatement()
      ? 'http://localhost:8080/modele/list-filtrer'
      : 'http://localhost:8080/modele/list';

    this.httpClient.get<Modele[]>(url).subscribe((listModeles) => {
      this.modeles.set(listModeles);
    });
  }

  chargerTypes() {
    this.httpClient.get<Type[]>('http://localhost:8080/type/list').subscribe((listTypes) => {
      this.types.set(listTypes);
    });
  }
}
