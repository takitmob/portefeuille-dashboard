/* ============================================================
   Portefeuille Dashboard — données (source de vérité)
   Mise à jour par l'orchestrateur à chaque revue de portefeuille.
   Schéma :
   - meta : titre, version, misAJour, note
   - projets[] :
       id, nom, court, icone (nom d'icône inline)
       statut    : actif | en attente | archive | permanent
       phase     : texte libre (ex. "Cadrage")
       progression: 0-100 (pour les projets à durée ; null si permanent)
       verdict   : texte
       priorite  : haute | moyenne | basse | permanente
       debut/fin : YYYY-MM-DD (période d'exécution globale)
       prochaineEtape : texte
       etapes[]  : { nom, debut, fin, statut: fait|en cours|a venir }
       taches[]  : { nom, priorite: haute|moyenne|basse, statut: a faire|en cours|fait }
       evolution[] : { date: YYYY-MM-DD, valeur: 0-100 } (historique progression)
   ============================================================ */

window.DASH_DATA = {
  meta: {
    titre: "Portefeuille Dashboard",
    version: "v0.1",
    misAJour: "2026-09-17",
    note: "Données tirées des notes de cadrage (01 - Projets) — revue du 17 septembre 2026."
  },

  projets: [
    {
      id: "kora",
      nom: "KORA CRM",
      court: "Mini-CRM WhatsApp-first pour indépendants (Afrique de l'Ouest).",
      icone: "message",
      statut: "actif",
      phase: "Cadrage",
      progression: 10,
      verdict: "GO conditionnel",
      priorite: "haute",
      debut: "2026-09-15",
      fin: "2027-03-31",
      prochaineEtape: "Architecture : ADR + schéma BDD/RLS",
      etapes: [
        { nom: "Cadrage produit", debut: "2026-09-15", fin: "2026-09-30", statut: "fait" },
        { nom: "ADR + schéma BDD / RLS", debut: "2026-10-01", fin: "2026-10-15", statut: "en cours" },
        { nom: "MVP V1 (auth, contacts, pipeline, relance)", debut: "2026-10-16", fin: "2026-11-30", statut: "a venir" },
        { nom: "QA parcours critiques + audit sécurité", debut: "2026-12-01", fin: "2026-12-15", statut: "a venir" },
        { nom: "V2 WhatsApp Cloud API (conditionnée)", debut: "2027-01-01", fin: "2027-02-28", statut: "a venir" },
        { nom: "Revue GO/NO-GO à 8 semaines", debut: "2027-03-01", fin: "2027-03-31", statut: "a venir" }
      ],
      taches: [
        { nom: "Valider l'ADR de stack (architecte-tech)", priorite: "haute", statut: "en cours" },
        { nom: "Documenter les politiques RLS (data-sec)", priorite: "haute", statut: "a faire" },
        { nom: "Recruter 5-10 indépendants testeurs MVP", priorite: "haute", statut: "a faire" },
        { nom: "Implémenter le MVP V1 par phases validées", priorite: "moyenne", statut: "a faire" }
      ],
      evolution: [
        { date: "2026-09-15", valeur: 5 },
        { date: "2026-09-17", valeur: 10 }
      ]
    },

    {
      id: "pathfinder",
      nom: "PATHFINDER",
      court: "« GPS personnel » d'orientation professionnelle, moteur déterministe et explicable.",
      icone: "compass",
      statut: "actif",
      phase: "Cadrage",
      progression: 10,
      verdict: "GO conditionnel",
      priorite: "haute",
      debut: "2026-09-15",
      fin: "2027-04-30",
      prochaineEtape: "Décision architecte-tech v0.x + moteur déterministe",
      etapes: [
        { nom: "Cadrage produit", debut: "2026-09-15", fin: "2026-09-30", statut: "fait" },
        { nom: "Décision architecture v0.x", debut: "2026-10-01", fin: "2026-10-20", statut: "en cours" },
        { nom: "Moteur de recommandation déterministe", debut: "2026-10-21", fin: "2026-11-30", statut: "a venir" },
        { nom: "Capitaliser sur le socle Exploration de carrière", debut: "2026-12-01", fin: "2027-01-31", statut: "a venir" },
        { nom: "Prototype testé (qa) + premiers retours", debut: "2027-02-01", fin: "2027-02-28", statut: "a venir" },
        { nom: "Pilote B2B (écoles / employabilité)", debut: "2027-03-01", fin: "2027-04-30", statut: "a venir" }
      ],
      taches: [
        { nom: "Trancher la cible v0.x (Rust statique vs web)", priorite: "haute", statut: "en cours" },
        { nom: "Définir les scores prudents du moteur", priorite: "haute", statut: "a faire" },
        { nom: "Récupérer les enseignements du socle Exploration", priorite: "moyenne", statut: "a faire" },
        { nom: "Préparer le pitch pilote B2B", priorite: "moyenne", statut: "a faire" }
      ],
      evolution: [
        { date: "2026-09-15", valeur: 5 },
        { date: "2026-09-17", valeur: 10 }
      ]
    },

    {
      id: "skillforge",
      nom: "SkillForge",
      court: "Parcours d'auto-formation de zéro à sysadmin junior (home lab, Docker).",
      icone: "dumbbell",
      statut: "actif",
      phase: "Cadrage",
      progression: 10,
      verdict: "GO personnel — produit conditionnel",
      priorite: "moyenne",
      debut: "2026-09-15",
      fin: "2027-05-31",
      prochaineEtape: "Setup home lab + labs Docker",
      etapes: [
        { nom: "Cadrage produit", debut: "2026-09-15", fin: "2026-09-30", statut: "fait" },
        { nom: "Home lab Debian/SSH + labs Docker", debut: "2026-10-01", fin: "2026-11-15", statut: "en cours" },
        { nom: "Modules du parcours sysadmin", debut: "2026-11-16", fin: "2027-01-31", statut: "a venir" },
        { nom: "Entraînements validés (déterministes)", debut: "2027-02-01", fin: "2027-04-30", statut: "a venir" },
        { nom: "Posture sysadmin junior (projets réels)", debut: "2027-05-01", fin: "2027-05-31", statut: "a venir" }
      ],
      taches: [
        { nom: "Monter le home lab + accès SSH durci", priorite: "haute", statut: "en cours" },
        { nom: "Structurer les modules du manuel", priorite: "moyenne", statut: "a faire" },
        { nom: "Concevoir les exercices validés Docker", priorite: "moyenne", statut: "a faire" },
        { nom: "Documenter chaque compétence validée", priorite: "basse", statut: "a faire" }
      ],
      evolution: [
        { date: "2026-09-15", valeur: 5 },
        { date: "2026-09-17", valeur: 10 }
      ]
    },

    {
      id: "holding-ao",
      nom: "Holding Afrique de l'Ouest",
      court: "Services B2B mutualisés pour PME ouest-africaines (IT, administratif, conseil).",
      icone: "building",
      statut: "actif",
      phase: "Cadrage",
      progression: 10,
      verdict: "GO conditionnel — prudent",
      priorite: "moyenne",
      debut: "2026-09-15",
      fin: "2027-06-30",
      prochaineEtape: "Recommandations juridique-ohada (CI vs Sénégal)",
      etapes: [
        { nom: "Cadrage produit", debut: "2026-09-15", fin: "2026-09-30", statut: "fait" },
        { nom: "Recommandations juridique-ohada", debut: "2026-10-01", fin: "2026-10-31", statut: "en cours" },
        { nom: "Prospection : sécuriser 2-3 clients payants", debut: "2026-11-01", fin: "2027-01-31", statut: "a venir" },
        { nom: "Prestations en nom propre (pré-structuration)", debut: "2027-02-01", fin: "2027-04-30", statut: "a venir" },
        { nom: "Structuration SAS/SASU (OHADA)", debut: "2027-05-01", fin: "2027-06-30", statut: "a venir" }
      ],
      taches: [
        { nom: "Obtenir les recommandations juridique-ohada", priorite: "haute", statut: "en cours" },
        { nom: "Définir les offres packagées (3 max)", priorite: "moyenne", statut: "a faire" },
        { nom: "Cibler et approcher 2-3 clients payants", priorite: "haute", statut: "a faire" },
        { nom: "Rédiger contrats types avec acomptes", priorite: "basse", statut: "a faire" }
      ],
      evolution: [
        { date: "2026-09-15", valeur: 5 },
        { date: "2026-09-17", valeur: 10 }
      ]
    },

    {
      id: "exploration",
      nom: "Exploration de carrière",
      court: "App 4 étapes, profils PIN, export Markdown — socle livré de PATHFINDER.",
      icone: "rocket",
      statut: "actif",
      phase: "Livré (v1 en ligne)",
      progression: 100,
      verdict: "Actif — socle de PATHFINDER",
      priorite: "moyenne",
      debut: "2026-08-01",
      fin: "2026-12-31",
      prochaineEtape: "Mesurer l'usage et capitaliser pour PATHFINDER",
      etapes: [
        { nom: "Cadrage + app one-page", debut: "2026-08-01", fin: "2026-08-20", statut: "fait" },
        { nom: "Harnais de tests + validation", debut: "2026-08-21", fin: "2026-08-31", statut: "fait" },
        { nom: "Déploiement GitHub Pages (v1 en ligne)", debut: "2026-09-01", fin: "2026-09-10", statut: "fait" },
        { nom: "Mesures d'usage + retours", debut: "2026-10-01", fin: "2026-12-31", statut: "a venir" }
      ],
      taches: [
        { nom: "Suivre l'usage (visites, complétion des 4 étapes)", priorite: "moyenne", statut: "a faire" },
        { nom: "Documenter les enseignements pour PATHFINDER", priorite: "moyenne", statut: "a faire" }
      ],
      evolution: [
        { date: "2026-08-01", valeur: 30 },
        { date: "2026-08-20", valeur: 60 },
        { date: "2026-09-05", valeur: 90 },
        { date: "2026-09-17", valeur: 100 }
      ]
    },

    {
      id: "petites-forces",
      nom: "Les Petites Forces",
      court: "Univers Clairbois : histoires pour enfants, site 13 pages, boutique à lancer.",
      icone: "sparkles",
      statut: "actif",
      phase: "Lancement",
      progression: 20,
      verdict: "Produit prêt — déploiement en cours",
      priorite: "basse",
      debut: "2026-07-01",
      fin: "2026-12-31",
      prochaineEtape: "Déployer le site (GitHub Pages) + configurer MailerLite",
      etapes: [
        { nom: "Audit de démarrage", debut: "2026-07-01", fin: "2026-07-15", statut: "fait" },
        { nom: "Kit maître + 12 histoires + identité", debut: "2026-07-16", fin: "2026-08-31", statut: "fait" },
        { nom: "Site statique 13 pages (catalogue piloté)", debut: "2026-09-01", fin: "2026-09-15", statut: "fait" },
        { nom: "Déploiement GitHub Pages + vérifs", debut: "2026-10-01", fin: "2026-10-15", statut: "a venir" },
        { nom: "MailerLite + boutique Payhip", debut: "2026-10-16", fin: "2026-11-15", statut: "a venir" },
        { nom: "Lancement public", debut: "2026-11-16", fin: "2026-12-31", statut: "a venir" }
      ],
      taches: [
        { nom: "Déployer le site (repos public takitmob/les-petites-forces-site)", priorite: "haute", statut: "a faire" },
        { nom: "Configurer l'automation MailerLite (4 e-mails prêts)", priorite: "moyenne", statut: "a faire" },
        { nom: "Héberger le produit gratuit + liens boutique", priorite: "moyenne", statut: "a faire" },
        { nom: "Valider les pages légales", priorite: "basse", statut: "a faire" }
      ],
      evolution: [
        { date: "2026-07-15", valeur: 5 },
        { date: "2026-08-31", valeur: 12 },
        { date: "2026-09-17", valeur: 20 }
      ]
    },

    {
      id: "konan",
      nom: "Konan (PKM)",
      court: "Le coffre lui-même : orchestration, documentation, journal de décisions, dashboard.",
      icone: "book",
      statut: "permanent",
      phase: "Permanent",
      progression: null,
      verdict: "GO permanent",
      priorite: "permanente",
      debut: "2026-09-01",
      fin: null,
      prochaineEtape: "Tenir le journal de décisions + revue de portefeuille",
      etapes: [
        { nom: "Orchestration multi-agents", debut: "2026-09-01", fin: null, statut: "en cours" },
        { nom: "Journal de décisions", debut: "2026-09-01", fin: null, statut: "en cours" },
        { nom: "Dashboard de portefeuille", debut: "2026-09-17", fin: null, statut: "en cours" }
      ],
      taches: [
        { nom: "Mettre à jour data.js à chaque revue", priorite: "haute", statut: "en cours" },
        { nom: "Documenter les décisions dans le journal", priorite: "moyenne", statut: "en cours" }
      ],
      evolution: []
    }
  ]
};