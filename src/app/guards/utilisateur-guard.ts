import { CanActivateFn } from '@angular/router';

export const utilisateurGuard: CanActivateFn = (route, state) => {
  return true;
};
