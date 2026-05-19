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

  httpClient = inject(HttpClient);

  ngOnInit() {
    this.httpClient.get<Modele[]>('http://localhost:8080/modele/list').subscribe((listModeles) => {
      console.log(listModeles);
      this.modeles.set(listModeles);
    });

    console.log('fin');
  }
}
