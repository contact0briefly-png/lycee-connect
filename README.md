# 🎓 LycéeConnect — ERP de Gestion d'Établissement Scolaire (Système Francophone & Togo)

[![License: MIT](https://img.shields.io/badge/License-MIT-0f766e.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Backend-Express%20REST%20API-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Système Éducatif](https://img.shields.io/badge/Syst%C3%A8me-Francophone%20%2F%20Togo%20(MEPST)-eab308)](#)

**LycéeConnect** est une application web full-stack open-source conçue pour la gestion académique, pédagogique, financière et administrative des **lycées d'enseignement général** suivant le **modèle éducatif français et togolais** (*Seconde, Première — BAC I / Probatoire, Terminale — BAC II*).

---

## ✨ Fonctionnalités Principales

### 1. 🏫 Référentiel Académique Francophone & Togolais (MEPST)
- **Niveaux du Second Cycle** : Seconde (`2nde A4`, `2nde CD`), Première (`1ère A4`, `1ère D` — préparation au **BAC I / Probatoire**), Terminale (`Tle A4`, `Tle C4`, `Tle D` — préparation au **BAC II / Baccalauréat**).
- **Séries & Coefficients Officiels** :
  - **Série A4** *(Lettres, Langues & Sciences Humaines)* : Français (Coef 4), Philosophie (Coef 4), Histoire-Géo (Coef 3), Anglais (Coef 3), LV2 Allemand/Espagnol (Coef 3), ECM (Coef 2), Mathématiques (Coef 2), SVT (Coef 1), EPS (Coef 1).
  - **Série D** *(Sciences de la Nature & Mathématiques)* : SVT (Coef 4), Mathématiques (Coef 4), Sciences Physiques (Coef 3), Français (Coef 2), Philosophie (Coef 2), Histoire-Géo (Coef 2), Anglais (Coef 2), ECM (Coef 2), EPS (Coef 1).
  - **Série C4** *(Mathématiques & Sciences Physiques)* : Mathématiques (Coef 5), Sciences Physiques (Coef 5), SVT (Coef 2), Français (Coef 2), Philosophie (Coef 2), Histoire-Géo (Coef 2), Anglais (Coef 2), ECM (Coef 2), EPS (Coef 1).

### 2. 📝 Calcul Automatique des Notes (/20) & Délibérations
- Saisie par matière et par trimestre (**1er, 2ème, 3ème Trimestre**) :
  - **Interrogation (/20)** et **Devoir surveillé (/20)** $\rightarrow$ $\text{Moyenne de classe} = \frac{\text{Interro} + \text{Devoir}}{2}$
  - **Composition trimestrielle (/20)** $\rightarrow$ $\text{Moyenne trimestrielle} = \frac{\text{Moyenne de classe} + \text{Composition}}{2}$
  - **Points coefficientés** : $\text{Points} = \text{Moyenne matière} \times \text{Coefficient}$
- Calcul automatique du **rang dans la classe** (avec gestion des *ex-aequo*), des statistiques de classe (moyenne générale, moyenne minimale, moyenne maximale, taux de réussite $\ge 10/20$) et des **Mentions du Conseil de Classe** :
  - `≥ 16/20` : **Très Bien** (*Tableau d'Honneur + Félicitations*)
  - `14 – 15.99/20` : **Bien** (*Tableau d'Honneur + Encouragements*)
  - `12 – 13.99/20` : **Assez Bien** (*Tableau d'Honneur*)
  - `10 – 11.99/20` : **Passable**
  - `< 10/20` : **Insuffisant / Avertissement ou Blâme Travail**

### 3. 📄 Bulletins Scolaires Officiels (Prêts à Imprimer / PDF)
- Génération instantanée du **Bulletin Trimestriel de Notes** au format officiel (en-tête *République Togolaise — MEPST*, identité de l'élève, matricule, notes détaillées, totaux, rang, assiduité, appréciation du Conseil de Classe et visas du Professeur Titulaire et du Proviseur).
- Feuille de style dédiée à l'impression A4 (`@media print`).

### 4. 💳 Gestion de l'Écolage & Caisse en FCFA
- Suivi des frais de scolarité annuels par niveau (`2nde` : 85 000 FCFA, `1ère` : 95 000 FCFA, `Terminale` : 110 000 FCFA) répartis en **3 tranches**.
- Encaissement multi-canal adapté aux réalités locales : **TMoney (Togocom)**, **Flooz (Moov Africa)**, **Versement bancaire (Orabank / Ecobank / UTB)** et **Espèces au guichet de l'intendance**.
- Émission automatique de reçus numérotés (`REC-2026-...`) et calcul du taux de recouvrement en temps réel.

### 5. 🗓️ Vie Scolaire, Corps Enseignant & Emploi du Temps
- Registre de la Surveillance Générale : saisie des **absences** (en heures, justifiées ou non) et des **retards** directement répercutés sur le bulletin trimestriel.
- Répertoire des enseignants (professeurs certifiés CAPES et agrégés) et emploi du temps hebdomadaire.

---

## 🗂️ Architecture du Projet

```text
lycee-connect/
├── server.js                      # Point d'entrée du serveur Node.js / Express
├── package.json                   # Scripts et dépendances
├── src/
│   ├── config/
│   │   └── schoolSystem.js        # Référentiel des séries (A4, C4, D), coefficients et écolage FCFA
│   ├── services/
│   │   ├── gradeCalculator.js     # Moteur de calcul des moyennes /20, rangs et décisions de conseil
│   │   └── store.js               # Persistance JSON avec initialisation automatique
│   └── routes/
│       └── api.js                 # Routes de l'API REST (/api/*)
├── data/
│   └── seedData.js                # Données de démonstration réalistes (Lycée Moderne de Lomé)
├── public/
│   ├── index.html                 # Interface utilisateur SPA moderne
│   ├── css/styles.css             # Design system responsive + mode impression A4
│   └── js/app.js                  # Logique frontend connectée à l'API REST
└── tests/
    └── gradeCalculator.test.js    # Tests unitaires automatisés (node --test)
```

---

## 🚀 Installation & Démarrage Rapide

### Prérequis
- **Node.js** `>= 18.0.0` et **npm**

### 1. Cloner le dépôt
```bash
git clone https://github.com/contact0briefly-png/lycee-connect.git
cd lycee-connect
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Lancer l'application
```bash
npm start
```
Ouvrez ensuite votre navigateur sur **[http://localhost:3000](http://localhost:3000)**.

### 4. Exécuter les tests unitaires
```bash
npm test
```

### 5. Réinitialiser les données de démonstration
```bash
npm run seed
```

---

## 🔌 Documentation de l'API REST

| Méthode | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/config` | Référentiel du lycée (Séries A4/C4/D, matières, coefficients, tarifs FCFA) |
| `GET` | `/api/dashboard?trimester=1` | Statistiques globales de direction, KPIs, classement par classe et Top 5 |
| `GET` | `/api/students` | Liste des élèves avec filtres (`classId`, `series`, `search`, `trimester`) |
| `POST` | `/api/students` | Inscrire un nouvel élève et initialiser son dossier académique |
| `GET` | `/api/classes` | Liste des classes avec effectifs et volume de coefficients |
| `GET` | `/api/grades?studentId=STD-001&trimester=1` | Feuille de notes détaillée d'un élève pour un trimestre |
| `POST` | `/api/grades` | Enregistrer ou modifier les notes (`interro`, `devoir`, `compo`) sur 20 |
| `GET` | `/api/bulletins/:studentId?trimester=1` | Générer le bulletin trimestriel officiel complet d'un élève |
| `GET` | `/api/tuition` | Situation de l'écolage en FCFA par élève et journal des reçus |
| `POST` | `/api/tuition` | Enregistrer un règlement d'écolage (TMoney, Flooz, Banque, Espèces) |
| `GET` | `/api/attendance` | Registre des absences et retards (Vie Scolaire) |
| `POST` | `/api/attendance` | Signaler une absence ou un retard |
| `GET` | `/api/timetable` | Emploi du temps hebdomadaire des classes |

---

## 🤝 Contribuer

Les contributions de la communauté éducative et des développeurs (Togo, Afrique francophone et international) sont les bienvenues ! Consultez le fichier [CONTRIBUTING.md](CONTRIBUTING.md) pour commencer.

## 📄 Licence

Ce projet est distribué sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
