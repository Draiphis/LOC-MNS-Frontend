import { Routes } from '@angular/router';
import { Connexion } from './pages/connexion/connexion';
import { Catalogue } from './pages/catalogue/catalogue';
import { DemandeEmprunt } from './pages/demande-emprunt/demande-emprunt';
import { ValidationEmprunt } from './pages/validation-emprunt/validation-emprunt';
import { utilisateurGuard } from './guards/utilisateur-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  {
    path: 'connexion',
    component: Connexion,
  },
  {
    path: 'admin/emprunts',
    component: ValidationEmprunt,
    canActivate: [adminGuard],
  },
  {
    path: 'catalogue',
    component: Catalogue,
    canActivate: [utilisateurGuard],
  },
  {
    path: 'emprunt/:id',
    component: DemandeEmprunt,
  },
];
