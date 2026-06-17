import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const utilisateurGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  const user = auth.jwtInfo();

  // ❌ pas connecté
  if (!user) {
    return router.parseUrl('/connexion');
  }

  // ❌ rôle non autorisé
  if (!user.roles.includes('DEFAULT')) {
    return router.parseUrl('/connexion');
  }

  return true;
};
