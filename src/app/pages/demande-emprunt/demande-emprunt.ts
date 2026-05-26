import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    console.log(id);

    this.httpClient.get<Modele>('http://localhost:8080/modele/' + id).subscribe((data) => {
      this.modele.set(data);
    });
  }
}
