import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (!auth.isLogged()) {
    return router.parseUrl('/connexion');
  }

  if (auth.isAdmin()) {
    return true;
  }

  return router.parseUrl('/unauthorized');
};
