# MNS Loc — Front-end

Interface web de **MNS Loc**, une application de consultation et de réservation
de matériel.

L’application propose deux espaces :

- un espace utilisateur pour consulter le catalogue, choisir une période et
  suivre ses réservations ;
- un espace administrateur pour valider les demandes et créer des utilisateurs.

## Fonctionnalités

### Utilisateur

- connexion sécurisée ;
- consultation et filtrage du catalogue ;
- affichage des disponibilités sur un calendrier ;
- sélection d’une période de réservation ;
- création d’une demande d’emprunt ;
- consultation des demandes en attente ou refusées ;
- consultation des réservations approuvées en cours.

### Administrateur

- consultation de toutes les demandes d’emprunt ;
- validation ou refus d’une demande ;
- création d’un compte utilisateur ;
- contrôle des doublons d’adresse e-mail.

## Technologies

- Angular 21
- TypeScript 5.9
- Angular Router
- Reactive Forms
- Angular HTTP Client
- RxJS
- Tailwind CSS
- Vitest
- Nginx pour l’image de production

## Prérequis

- Node.js 20 ou supérieur ;
- npm 11 ;
- le back-end MNS Loc démarré pour utiliser toutes les fonctionnalités.

## Installation

Installer les dépendances :

```bash
npm install
```

Le fichier `package-lock.json` permet également une installation reproductible :

```bash
npm ci
```

## Configuration de l’API

Les adresses du back-end se trouvent dans `src/environments/`.

| Contexte | Fichier utilisé | Adresse actuelle |
|---|---|---|
| Serveur de développement | `environment.development.ts` | `http://localhost:8080` |
| Build par défaut | `environment.ts` | API déployée |

Exemple de configuration locale :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
};
```

Ne pas ajouter de `/` final à `apiUrl`, car les services ajoutent eux-mêmes le
chemin de chaque endpoint.

## Démarrage

Lancer le serveur de développement :

```bash
npm start
```

Puis ouvrir :

```text
http://localhost:4200
```

Le serveur recharge automatiquement l’application après une modification du
code.

## Authentification et autorisations

Après une connexion réussie, le JWT retourné par le back-end est conservé dans
le stockage local du navigateur.

Un intercepteur HTTP ajoute automatiquement l’en-tête suivant aux requêtes :

```text
Authorization: Bearer <jwt>
```

Les gardes de navigation séparent les espaces :

- `utilisateurGuard` protège le catalogue et le profil ;
- `adminGuard` protège les pages d’administration.

Les contrôles front améliorent la navigation, mais les autorisations sensibles
doivent toujours être vérifiées par le back-end.

## Routes principales

| Route | Accès | Description |
|---|---|---|
| `/connexion` | Public | Connexion |
| `/catalogue` | Utilisateur | Catalogue et filtres |
| `/emprunt/:id` | Utilisateur | Choix des dates et demande de réservation |
| `/profil` | Utilisateur | Demandes et réservations personnelles |
| `/admin/emprunts` | Administrateur | Validation et refus des demandes |
| `/admin/utilisateurs/nouveau` | Administrateur | Création d’un utilisateur |

## Structure du projet

```text
src/
├── app/
│   ├── guards/          Protection des routes utilisateur et administrateur
│   ├── intercepteurs/   Gestion centralisée des erreurs HTTP
│   ├── modeles/         Types TypeScript de l’application
│   ├── pages/
│   │   ├── ajout-utilisateur/
│   │   ├── catalogue/
│   │   ├── connexion/
│   │   ├── demande-emprunt/
│   │   ├── profil/
│   │   └── validation-emprunt/
│   ├── services/        Authentification et ajout du JWT
│   ├── app.config.ts
│   ├── app.routes.ts
│   └── app.ts
├── environments/       Adresses de l’API selon l’environnement
├── main.ts
└── styles.css
```

Chaque page possède ses propres fichiers TypeScript, HTML, CSS et, lorsque
nécessaire, son fichier de test.

## Commandes disponibles

| Commande | Utilité |
|---|---|
| `npm start` | Lancer le serveur de développement |
| `npm run build` | Générer le build optimisé |
| `npm run watch` | Recompiler en continu en mode développement |
| `npm test` | Lancer les tests en mode interactif |
| `npm test -- --watch=false` | Exécuter les tests une seule fois |

## Tests

Exécuter toute la suite une seule fois :

```bash
npm test -- --watch=false
```

Les tests utilisent Vitest et l’environnement de test Angular.

## Build de production

Générer les fichiers statiques optimisés :

```bash
npm run build
```

Les fichiers statiques à déployer sont produits dans :

```text
dist/loc-mns/browser/
```

Avant un déploiement, vérifier que `apiUrl` correspond bien à l’adresse publique
du back-end.

## Docker

Construire l’image :

```bash
docker build -f dockerfile -t loc-mns-front .
```

Lancer le conteneur :

```bash
docker run --rm -p 4200:80 loc-mns-front
```

L’application est alors accessible sur `http://localhost:4200`.

L’image compile Angular avec Node.js, puis utilise Nginx pour servir les fichiers
statiques. La configuration Nginx redirige les routes inconnues vers
`index.html`, ce qui permet au routeur Angular de fonctionner après un
rafraîchissement de page.

## Dépendance avec le back-end

Le front-end dépend de l’API Spring Boot pour :

- l’authentification ;
- le catalogue et les disponibilités ;
- les demandes d’emprunt ;
- le profil utilisateur ;
- les opérations d’administration.

En développement local, démarrer le back-end sur le port `8080` avant de tester
les parcours complets.
