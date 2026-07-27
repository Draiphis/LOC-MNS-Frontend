import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AjoutUtilisateur } from './ajout-utilisateur';

describe('AjoutUtilisateur', () => {
  it('refuse deux mots de passe différents', () => {
    const httpClient = {
      post: vi.fn(() => of({ id: 1, status: 'created' })),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClient }],
    });

    const composant = TestBed.runInInjectionContext(() => new AjoutUtilisateur());
    composant.formulaire.setValue({
      prenom: 'Alice',
      nom: 'Dupont',
      email: 'alice.dupont@mns.fr',
      dateDeNaissance: '1995-01-01',
      password: 'MotDePasse123!',
      confirmationPassword: 'AutreMotDePasse123!',
    });

    composant.creerUtilisateur();

    expect(
      composant.formulaire.controls.confirmationPassword.hasError('motsDePasseDifferents'),
    ).toBe(true);
    expect(httpClient.post).not.toHaveBeenCalled();
  });

  it('envoie un utilisateur valide sans la confirmation du mot de passe', () => {
    const httpClient = {
      post: vi.fn(() => of({ id: 1, status: 'created' })),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClient }],
    });

    const composant = TestBed.runInInjectionContext(() => new AjoutUtilisateur());
    composant.formulaire.setValue({
      prenom: 'Alice',
      nom: 'Dupont',
      email: 'alice.dupont@mns.fr',
      dateDeNaissance: '1995-01-01',
      password: 'MotDePasse123!',
      confirmationPassword: 'MotDePasse123!',
    });

    composant.creerUtilisateur();

    expect(httpClient.post).toHaveBeenCalledWith(
      expect.stringContaining('/admin/utilisateurs'),
      {
        prenom: 'Alice',
        nom: 'Dupont',
        email: 'alice.dupont@mns.fr',
        dateDeNaissance: '1995-01-01',
        password: 'MotDePasse123!',
      },
    );
    expect(composant.confirmation()).toContain('Alice Dupont');
  });
});
