import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Auth } from '../services/auth';

export const utilisateurGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);

  if (authService.jwtInfo()?.roles.split(',').includes('DEFAULT')) {
    const router = inject(Router);
    return router.parseUrl('/connexion');
  }

  return true;
};
