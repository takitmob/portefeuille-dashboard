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

## Publication — PUBLIC (décision 2026-09-17)

- **Public** : le dépôt et le dashboard sont publics — décision explicite de l'utilisateur (données non sensibles : uniquement états d'avancement, priorités, périodes des projets).
- **Lien public** : <https://takitmob.github.io/portefeuille-dashboard/>
- **Règle stricte** : ne **jamais** faire entrer de donnée sensible dans `data.js` (emails, finances, secrets, données personnelles) — ce fichier est visible par tout le monde.
- **Pas d'édition depuis l'app** en v1 : les données se modifient dans `data.js` (traçable via git).
- L'accès multi-appareils passe désormais par l'URL publique (plus besoin de pull local pour consulter) ; la version locale reste la source de vérité de développement.

## Identité git

`Jok <takitmobile@gmail.com>` — jamais `josuekonan2023@gmail.com`. Commits en français.