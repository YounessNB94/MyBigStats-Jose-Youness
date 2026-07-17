# Passation Étudiant B → Étudiant A

Ce document liste ce que la partie "athlètes / recherche / filtres / onglets / comparateur / notifications" (développée par Monkam Jose) expose et comment l'utiliser depuis le code des sports, équipes et rencontres (développé par Youness Nait Belkacem).

Toutes les branches ci-dessous sont poussées et ouvertes en Pull Request vers `main` (empilées les unes sur les autres, dans cet ordre) :

`feature/athletes` → `feature/athlete-filters` → `feature/tabs` → `feature/comparator` → `feature/notifications` → `feature/sport-interactions-page`

## 1. Athlètes

### `getAthletes(): Promise<Athlete[]>`
Récupère la liste complète des athlètes depuis `athletes.json` (un seul appel réseau). Lève une `ApiError` (celle déjà définie dans `core/errors/api.errors.ts`) si l'API est indisponible ou répond avec un statut HTTP en erreur.

### `getAthletesBySportId(athletes: Athlete[], sportId: number): Athlete[]`
Filtre localement une liste déjà chargée par `sport_id` (1 = football, 2 = basketball, 3 = MMA). N'effectue aucun appel réseau — à utiliser après un `getAthletes()`.

### `renderAthletes(container: HTMLElement, athletes: Athlete[]): void`
Vide `container` puis affiche une carte par athlète, ou le message « Aucun athlète trouvé. » si le tableau est vide.

### `applyAthleteFilters(athletes: Athlete[], filters: ActiveAthleteFilters): Athlete[]`
Combine recherche texte (`query`), sport (`sportId`) et position/catégorie (`position`). Chaque critère est optionnel (`Partial`) : absent → ignoré.

## 2. Onglets

### `initializeTabs(): void`
À appeler une seule fois, dès que le DOM est prêt (avant ou après le chargement des données, peu importe). Elle cherche tous les `[data-tab-target]` / `[data-tab-content]` déjà présents dans le HTML — aucun paramètre, aucune configuration nécessaire.

## 3. Notifications (réutilisable pour tes propres erreurs : sport inexistant, rencontre introuvable, etc.)

```ts
import { notifyError, notifySuccess, notifyInfo } from "../core/notifications/notification.view.js";

notifyError("Le sport demandé n'existe pas.");
notifySuccess("Rencontre chargée.");
notifyInfo("Aucune rencontre en cours actuellement.");
```

Chaque notification s'affiche dans `#notification-container` (déjà présent dans le HTML), se ferme automatiquement après 5 secondes, ou manuellement via son bouton de fermeture. Plusieurs notifications s'empilent. `showNotification(message, type?)` est la fonction générique sous-jacente si tu veux un contrôle plus fin du type (`"success" | "error" | "info"`, par défaut `"info"`).

## 4. Comparateur

Point important : je n'ai **pas** exposé de fonction `renderComparison()` isolée comme le suggérait le sujet — l'ensemble (remplissage des selects, lecture de la sélection, validation, appel du service, gestion des erreurs et affichage) est encapsulé dans une seule fonction d'initialisation :

```ts
import { getComparatorElements, initializeComparator } from "../comparator/comparator.view.js";

const comparatorElements = getComparatorElements(); // null si le HTML du comparateur est absent de la page

if (comparatorElements) {
  initializeComparator(comparatorElements, sportAthletes); // sportAthletes = liste déjà filtrée par sport
}
```

Erreurs possibles, toutes affichées automatiquement dans `#comparison-result` (pas besoin de les intercepter toi-même) : sélection manquante, athlètes identiques, sports différents (`MissingAthleteError`, `SameAthleteError`, `DifferentSportsError`, toutes des sous-classes de `ComparisonError`).

## 5. Exemple complet (voir aussi `src/pages/sport-interactions.page.ts`)

```ts
async function initSportInteractions(): Promise<void> {
  initializeTabs();

  try {
    const athletes = await getAthletes();
    const sportAthletes = getAthletesBySportId(athletes, sportId);

    const filterElements = getAthleteFilterElements();
    if (filterElements) initializeAthleteFilters(filterElements, sportAthletes);

    const comparatorElements = getComparatorElements();
    if (comparatorElements) initializeComparator(comparatorElements, sportAthletes);
  } catch (error: unknown) {
    notifyError(getErrorMessage(error)); // error instanceof AppError -> error.message, sinon message generique
  }
}
```

## 6. Pas de doublon avec ton code

Je n'ai touché à aucun de tes fichiers (`sports/`, `teams/`, `encounters/`, `core/api/fetch-json.ts`, `core/errors/api.errors.ts`, `config/api.config.ts`) et je réutilise `fetchJson()`, `API_URLS` et `AppError`/`ApiError` tels quels plutôt que d'en recréer des équivalents. `ComparisonError` (mes erreurs comparateur) hérite d'ailleurs de ton `AppError` pour rester cohérent.

## 7. Points ouverts à régler ensemble (pas encore résolus, volontairement pas touchés seul)

- Aucune page HTML n'a encore de `<script>` chargeant le JS compilé.
- `tsconfig.json` compile en `CommonJS`, qui ne s'exécute pas nativement dans un navigateur via `<script src>` sans bundler — il faudra probablement passer en `"module": "ES2020"` + `<script type="module">`.
- Le mapping `sport_id` ↔ `data-sport-slug` (`football: 1, basketball: 2, mma: 3`) est dupliqué localement dans `sport-interactions.page.ts` faute de service sport existant — à mutualiser si tu crées un `sport.service.ts`.
