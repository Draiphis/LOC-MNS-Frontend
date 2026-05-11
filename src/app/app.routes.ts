import { Routes } from '@angular/router';
import { Connexion } from './pages/connexion/connexion';
import { Catalogue } from './pages/catalogue/catalogue';

export const routes: Routes = [
  {
    path: 'connexion',
    component: Connexion,
  },
  {
    path: 'catalogue',
    component: Catalogue,
  },
];
