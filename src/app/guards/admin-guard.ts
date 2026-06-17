import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  const jwt = auth.jwtInfo();

  if (!jwt) {
    router.navigate(['/connexion']);
    return false;
  }

  const roles = jwt.roles?.split(',').map((r) => r.trim());

  if (roles.includes('ADMIN')) {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};
