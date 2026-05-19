import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

export const utilisateurGuard: CanActivateFn = (route, state) => {
  if (localStorage.getItem('jwt') == null) {
    const router = inject(Router);
    return router.parseUrl('/connexion');
  }

  return true;
};
