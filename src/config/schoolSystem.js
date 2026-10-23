/**
 * Référentiel du système éducatif secondaire (Lycée - Modèle Francophone & Togolais)
 * Niveaux : Seconde (2nde), Première (1ère - BAC I), Terminale (Tle - BAC II)
 * Séries d'enseignement général : A4 (Lettres), C4 (Maths & Physique), D (Sciences & SVT)
 */

const SCHOOL_INFO = {
  name: "Lycée Moderne d'Excellence de Lomé",
  shortName: "LMEL - Lomé",
  motto: "Discipline - Travail - Succès",
  ministry: "Ministère des Enseignements Primaire, Secondaire et Technique (MEPST)",
  country: "République Togolaise",
  countryMotto: "Travail - Liberté - Patrie",
  inspection: "Direction Régionale de l'Éducation (DRE) - Grand Lomé",
  academicYear: "2026-2027",
  currency: "FCFA",
  address: "Boulevard du 13 Janvier, Quartier Administratif, Lomé - Togo",
  phone: "+228 22 21 45 80",
  email: "direction@lycee-excellence-lome.tg"
};

const SERIES = {
  A4: {
    code: "A4",
    name: "Série A4 — Lettres, Langues & Sciences Humaines",
    description: "Dominante Littéraire, Philosophie, Langues Vivantes et Histoire-Géographie"
  },
  C4: {
    code: "C4",
    name: "Série C4 — Mathématiques & Sciences Physiques",
    description: "Dominante Mathématiques pures et Sciences Physiques"
  },
  D: {
    code: "D",
    name: "Série D — Sciences de la Nature & Mathématiques",
    description: "Dominante Sciences de la Vie et de la Terre (SVT), Mathématiques et Physique-Chimie"
  },
  CD: {
    code: "CD",
    name: "Tronc Commun Scientifique (2nde CD)",
    description: "Seconde scientifique préparant aux séries C4 et D"
  }
};

/**
 * Grille des matières et coefficients officiels selon la série
 */
const SUBJECTS_BY_SERIES = {
  A4: [
    { code: "FRA", name: "Français", coefficient: 4, category: "Littéraire" },
    { code: "PHI", name: "Philosophie", coefficient: 4, category: "Littéraire" },
    { code: "HG", name: "Histoire-Géographie", coefficient: 3, category: "Sciences Humaines" },
    { code: "ANG", name: "Anglais (LV1)", coefficient: 3, category: "Langues" },
    { code: "ALL", name: "Allemand / Espagnol (LV2)", coefficient: 3, category: "Langues" },
    { code: "ECM", name: "Éducation Civique et Morale (ECM)", coefficient: 2, category: "Sciences Humaines" },
    { code: "MAT", name: "Mathématiques", coefficient: 2, category: "Scientifique" },
    { code: "SVT", name: "Sciences de la Vie et de la Terre (SVT)", coefficient: 1, category: "Scientifique" },
    { code: "EPS", name: "Éducation Physique et Sportive (EPS)", coefficient: 1, category: "Sport" }
  ],
  D: [
    { code: "SVT", name: "Sciences de la Vie et de la Terre (SVT)", coefficient: 4, category: "Scientifique" },
    { code: "MAT", name: "Mathématiques", coefficient: 4, category: "Scientifique" },
    { code: "PCT", name: "Sciences Physiques (Physique-Chimie)", coefficient: 3, category: "Scientifique" },
    { code: "FRA", name: "Français", coefficient: 2, category: "Littéraire" },
    { code: "PHI", name: "Philosophie", coefficient: 2, category: "Littéraire" },
    { code: "HG", name: "Histoire-Géographie", coefficient: 2, category: "Sciences Humaines" },
    { code: "ANG", name: "Anglais", coefficient: 2, category: "Langues" },
    { code: "ECM", name: "Éducation Civique et Morale (ECM)", coefficient: 2, category: "Sciences Humaines" },
    { code: "EPS", name: "Éducation Physique et Sportive (EPS)", coefficient: 1, category: "Sport" }
  ],
  C4: [
    { code: "MAT", name: "Mathématiques", coefficient: 5, category: "Scientifique" },
    { code: "PCT", name: "Sciences Physiques (Physique-Chimie)", coefficient: 5, category: "Scientifique" },
    { code: "SVT", name: "Sciences de la Vie et de la Terre (SVT)", coefficient: 2, category: "Scientifique" },
    { code: "FRA", name: "Français", coefficient: 2, category: "Littéraire" },
    { code: "PHI", name: "Philosophie", coefficient: 2, category: "Littéraire" },
    { code: "HG", name: "Histoire-Géographie", coefficient: 2, category: "Sciences Humaines" },
    { code: "ANG", name: "Anglais", coefficient: 2, category: "Langues" },
    { code: "ECM", name: "Éducation Civique et Morale (ECM)", coefficient: 2, category: "Sciences Humaines" },
    { code: "EPS", name: "Éducation Physique et Sportive (EPS)", coefficient: 1, category: "Sport" }
  ],
  CD: [
    { code: "MAT", name: "Mathématiques", coefficient: 4, category: "Scientifique" },
    { code: "PCT", name: "Sciences Physiques (Physique-Chimie)", coefficient: 4, category: "Scientifique" },
    { code: "SVT", name: "Sciences de la Vie et de la Terre (SVT)", coefficient: 3, category: "Scientifique" },
    { code: "FRA", name: "Français", coefficient: 3, category: "Littéraire" },
    { code: "HG", name: "Histoire-Géographie", coefficient: 2, category: "Sciences Humaines" },
    { code: "ANG", name: "Anglais", coefficient: 2, category: "Langues" },
    { code: "ECM", name: "Éducation Civique et Morale (ECM)", coefficient: 2, category: "Sciences Humaines" },
    { code: "EPS", name: "Éducation Physique et Sportive (EPS)", coefficient: 1, category: "Sport" }
  ]
};

/**
 * Barème des frais de scolarité annuels (Écolage + Frais annexes en FCFA)
 */
const TUITION_RATES = {
  "2nde": {
    totalAnnual: 85000,
    installments: [
      { label: "1ère Tranche (Inscription - Septembre)", amount: 40000 },
      { label: "2ème Tranche (Janvier)", amount: 25000 },
      { label: "3ème Tranche (Mars)", amount: 20000 }
    ]
  },
  "1ère": {
    totalAnnual: 95000,
    installments: [
      { label: "1ère Tranche (Inscription + Dossier BAC I)", amount: 45000 },
      { label: "2ème Tranche (Janvier)", amount: 30000 },
      { label: "3ème Tranche (Mars)", amount: 20000 }
    ]
  },
  "Tle": {
    totalAnnual: 110000,
    installments: [
      { label: "1ère Tranche (Inscription + Dossier BAC II)", amount: 55000 },
      { label: "2ème Tranche (Janvier)", amount: 35000 },
      { label: "3ème Tranche (Mars)", amount: 20000 }
    ]
  }
};

const TRIMESTERS = [
  { id: 1, name: "1er Trimestre", period: "Septembre – Décembre" },
  { id: 2, name: "2ème Trimestre", period: "Janvier – Mars" },
  { id: 3, name: "3ème Trimestre", period: "Avril – Juin" }
];

module.exports = {
  SCHOOL_INFO,
  SERIES,
  SUBJECTS_BY_SERIES,
  TUITION_RATES,
  TRIMESTERS
};
