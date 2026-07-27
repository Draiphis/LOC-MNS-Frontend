import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Auth } from '../../services/auth';
import { Profil } from './profil';

describe('Profil', () => {
  it('sépare les demandes des réservations approuvées en cours', () => {
    const httpClient = {
      get: () => of([]),
    };
    const authService = {
      jwtInfo: () => ({ sub: 'test@mns.fr', roles: ['DEFAULT'] }),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClient },
        { provide: Auth, useValue: authService },
      ],
    });

    const profil = TestBed.runInInjectionContext(() => new Profil());
    profil.emprunts.set([
      creerEmprunt(1, 'EN_ATTENTE', null),
      creerEmprunt(2, 'REFUSE', null),
      creerEmprunt(3, 'APPROUVE', null),
      creerEmprunt(4, 'APPROUVE', '2026-07-20'),
    ]);

    expect(profil.demandes().map((emprunt) => emprunt.id)).toEqual([1, 2]);
    expect(profil.reservationsEnCours().map((emprunt) => emprunt.id)).toEqual([3]);
  });
});

function creerEmprunt(
  id: number,
  statut: string,
  dateRetourEmpruntReelle: string | null,
): Emprunt {
  return {
    id,
    statut,
    materielId: id,
    materielNom: `REF-${id}`,
    modeleNom: 'Ordinateur',
    demandeurNom: 'Dupont',
    demandeurPrenom: 'Alice',
    dateDemandeEmprunt: '2026-07-01T10:00:00',
    dateDebutEmprunt: '2026-07-10',
    dateRetourEmpruntPrevisionelle: '2026-07-20',
    dateRetourEmpruntReelle,
  };
}
