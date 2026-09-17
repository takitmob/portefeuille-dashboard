# Portefeuille Dashboard

Tableau de bord de pilotage du **portefeuille de projets** (coffre Konan) : KORA CRM, PATHFINDER, SkillForge, Holding Afrique de l'Ouest, Exploration de carrière, Les Petites Forces et Konan (PKM).

Rendu inspiré du template admin « Portu » (Envato) : **dashboard élégant, nuances marron/crème** — sidebar, cartes KPI, graphiques, Gantt.

## Contenu

| Section | Contenu |
| --- | --- |
| Vue d'ensemble | KPIs, courbes d'évolution de la progression, donut des priorités, barres par projet, prochaines échéances |
| Projets | Cartes détaillées : statut, phase, progression, verdict, priorité, prochaine étape, période |
| Gantt | Planning d'exécution par projet (étapes datées, marqueur « aujourd'hui ») |
| Tâches | Liste complète triée par priorité |
| Priorités | Classement par niveau d'attention (permanente → haute → moyenne → basse) |

## Usage

Ouvrir `index.html` directement (double-clic), ou via le web viewer d'Obsidian / le navigateur. Aucune installation, aucun serveur, aucune dépendance. L'app fonctionne même hors-ligne.

Les données se modifient dans **`data.js`** (`window.DASH_DATA`), alimenté par l'orchestrateur à chaque revue de portefeuille.

## Technologies

HTML + CSS + JS vanilla (zéro dépendance, zéro build) ; graphiques **SVG générés en JS maison** ; CSP stricte (`script-src 'self'`) ; interface en français ; responsive (mobile-first, sidebar off-canvas < 820 px).

## Structure

```
index.html   → structure + styles (palette Portu)
app.js       → logique (fonctions pures testables + rendu DOM)
data.js      → données du portefeuille (source de vérité)
```

## Tests

Harnais des fonctions pures, exécuté avec JavaScriptCore (macOS, sans node) :

```bash
printf 'var window = this;\n' > /tmp/dash-run.js
cat data.js app.js tests.js >> /tmp/dash-run.js
osascript -l JavaScript /tmp/dash-run.js
# → N tests, 0 échec(s)
```

Résultat du 17/09/2026 : **223 tests, 0 échec**.

## Confidentialité — limites honnêtes

- **Repo privé** : les données du portefeuille ne sont jamais publiées (GitHub Pages gratuit exige un repo public → volontairement non utilisé).
- **Accès multi-appareils** : le dashboard est ouvert en local sur chaque appareil (pull du repo privé ou synchronisation du coffre) ; la version affichée dépend du dernier pull sur l'appareil — pas de synchronisation temps réel.
- **Pas d'édition depuis l'app** en v1 : les données se modifient dans `data.js` (traçable via git).
- **Option lien web privé** (non activée) : Cloudflare Pages + Access (0 €) permettrait un URL protégé par connexion ; nécessite un compte Cloudflare gratuit. Non utilisé pour l'instant.

## Identité git

`Jok <takitmobile@gmail.com>` — jamais `josuekonan2023@gmail.com`. Commits en français.