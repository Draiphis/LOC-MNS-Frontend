import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-validation-emprunt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './validation-emprunt.html',
  styleUrl: './validation-emprunt.css',
})
export class ValidationEmprunt {
  private http = inject(HttpClient);

  emprunts = signal<any[]>([]);

  ngOnInit() {
    this.chargerEmprunts();
  }

  chargerEmprunts() {
    this.http
      .get<any[]>('http://localhost:8080/emprunt/list')
      .subscribe((data) => this.emprunts.set(data));
  }

  valider(id: number) {
    this.http
      .put(`http://localhost:8080/emprunt/${id}/valider`, {})
      .subscribe(() => this.chargerEmprunts());
  }

  refuser(id: number) {
    this.http
      .put(`http://localhost:8080/emprunt/${id}/refuser`, {})
      .subscribe(() => this.chargerEmprunts());
    console.log('la demande à été rejeter');
  }
}
