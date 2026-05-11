import { Routes } from '@angular/router';
import { Connexion } from './pages/connexion/connexion';
import { Catalogue } from './pages/catalogue/catalogue';
import { DemandeEmprunt } from './pages/demande-emprunt/demande-emprunt';

export const routes: Routes = [
  {
    path: 'connexion',
    component: Connexion,
  },
  {
    path: 'catalogue',
    component: Catalogue,
  },
  {
    path: 'emprunt',
    component: DemandeEmprunt,
  },
];
