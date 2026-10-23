/**
 * Données de démonstration réalistes — Lycée Moderne d'Excellence de Lomé (Togo)
 * Système éducatif francophone : 2nde, 1ère (BAC I), Terminale (BAC II) — Séries A4, C4, D
 */

const { SUBJECTS_BY_SERIES, TUITION_RATES } = require("../src/config/schoolSystem");

const classes = [
  {
    id: "TLE-D",
    name: "Terminale D",
    level: "Tle",
    series: "D",
    room: "Bâtiment A - Salle 101",
    mainTeacher: "M. Koffi Mensah",
    examTarget: "BAC II (Baccalauréat Série D)",
    capacity: 45
  },
  {
    id: "TLE-C4",
    name: "Terminale C4",
    level: "Tle",
    series: "C4",
    room: "Bâtiment A - Salle 102",
    mainTeacher: "M. Essohanam Tchalla",
    examTarget: "BAC II (Baccalauréat Série C4)",
    capacity: 35
  },
  {
    id: "TLE-A4",
    name: "Terminale A4",
    level: "Tle",
    series: "A4",
    room: "Bâtiment B - Salle 201",
    mainTeacher: "Mme Afiwa Dogbé",
    examTarget: "BAC II (Baccalauréat Série A4)",
    capacity: 45
  },
  {
    id: "1ERE-D",
    name: "Première D",
    level: "1ère",
    series: "D",
    room: "Bâtiment A - Salle 104",
    mainTeacher: "M. Kodjo Agbeko",
    examTarget: "BAC I (Probatoire Série D)",
    capacity: 45
  },
  {
    id: "1ERE-A4",
    name: "Première A4",
    level: "1ère",
    series: "A4",
    room: "Bâtiment B - Salle 203",
    mainTeacher: "Mme Akouvi Amégan",
    examTarget: "BAC I (Probatoire Série A4)",
    capacity: 45
  },
  {
    id: "2NDE-CD",
    name: "Seconde CD",
    level: "2nde",
    series: "CD",
    room: "Bâtiment C - Salle 301",
    mainTeacher: "M. Yao Kpatcha",
    examTarget: "Passage en 1ère C4 / D",
    capacity: 50
  },
  {
    id: "2NDE-A4",
    name: "Seconde A4",
    level: "2nde",
    series: "A4",
    room: "Bâtiment C - Salle 302",
    mainTeacher: "Mme Mawuse Lawson",
    examTarget: "Passage en 1ère A4",
    capacity: 50
  }
];

const teachers = [
  { id: "ENS-01", name: "M. Koffi Mensah", subjectCode: "SVT", subjectName: "SVT", grade: "Professeur Certifié (CAPES)", phone: "+228 90 12 34 56", classes: ["TLE-D", "1ERE-D", "2NDE-CD"] },
  { id: "ENS-02", name: "M. Essohanam Tchalla", subjectCode: "MAT", subjectName: "Mathématiques", grade: "Professeur Agrégé", phone: "+228 91 23 45 67", classes: ["TLE-C4", "TLE-D", "1ERE-D"] },
  { id: "ENS-03", name: "Mme Afiwa Dogbé", subjectCode: "FRA", subjectName: "Français", grade: "Professeur Certifié (CAPES)", phone: "+228 92 34 56 78", classes: ["TLE-A4", "TLE-D", "1ERE-A4"] },
  { id: "ENS-04", name: "M. Kodjo Agbeko", subjectCode: "PCT", subjectName: "Sciences Physiques", grade: "Professeur Certifié (CAPES)", phone: "+228 90 45 67 89", classes: ["TLE-C4", "TLE-D", "1ERE-D", "2NDE-CD"] },
  { id: "ENS-05", name: "Mme Akouvi Amégan", subjectCode: "PHI", subjectName: "Philosophie", grade: "Professeur Certifié (CAPES)", phone: "+228 93 56 78 90", classes: ["TLE-A4", "TLE-D", "TLE-C4", "1ERE-A4"] },
  { id: "ENS-06", name: "M. Yao Kpatcha", subjectCode: "HG", subjectName: "Histoire-Géographie", grade: "Professeur Certifié", phone: "+228 90 67 89 01", classes: ["TLE-A4", "TLE-D", "2NDE-CD", "2NDE-A4"] },
  { id: "ENS-07", name: "Mme Mawuse Lawson", subjectCode: "ANG", subjectName: "Anglais", grade: "Professeur Certifié", phone: "+228 91 78 90 12", classes: ["TLE-A4", "TLE-D", "1ERE-D", "2NDE-A4"] },
  { id: "ENS-08", name: "M. Komlan Aziable", subjectCode: "ALL", subjectName: "Allemand / Espagnol (LV2)", grade: "Professeur Certifié", phone: "+228 92 89 01 23", classes: ["TLE-A4", "1ERE-A4", "2NDE-A4"] },
  { id: "ENS-09", name: "M. Sena Gbeassor", subjectCode: "ECM", subjectName: "Éducation Civique et Morale (ECM)", grade: "Professeur d'Enseignement Général", phone: "+228 90 98 76 54", classes: ["TLE-D", "TLE-A4", "TLE-C4", "1ERE-D"] },
  { id: "ENS-10", name: "M. Edem Koudossou", subjectCode: "EPS", subjectName: "Éducation Physique et Sportive (EPS)", grade: "Professeur d'EPS", phone: "+228 91 11 22 33", classes: ["TLE-D", "TLE-A4", "TLE-C4", "1ERE-D", "2NDE-CD"] }
];

const students = [
  {
    id: "STD-001",
    matricule: "LMEL-2026-001",
    firstName: "Essi Merveille",
    lastName: "ADOTEVI",
    gender: "F",
    birthDate: "2008-04-14",
    birthPlace: "Lomé (Tokoin)",
    classId: "TLE-D",
    level: "Tle",
    series: "D",
    status: "Nouveau",
    neighborhood: "Tokoin Hôpital, Lomé",
    guardianName: "M. Kokou Adotevi",
    guardianPhone: "+228 90 41 22 18",
    enrollmentDate: "2026-09-07"
  },
  {
    id: "STD-002",
    matricule: "LMEL-2026-002",
    firstName: "Koffi Eli",
    lastName: "AMOUZOU",
    gender: "M",
    birthDate: "2007-11-22",
    birthPlace: "Kpalimé",
    classId: "TLE-D",
    level: "Tle",
    series: "D",
    status: "Nouveau",
    neighborhood: "Adidogomé, Lomé",
    guardianName: "Mme Ablavi Amouzou",
    guardianPhone: "+228 91 55 80 34",
    enrollmentDate: "2026-09-08"
  },
  {
    id: "STD-003",
    matricule: "LMEL-2026-003",
    firstName: "Afiwa Gracia",
    lastName: "GNASSINGBE-KOFFI",
    gender: "F",
    birthDate: "2008-08-03",
    birthPlace: "Kara",
    classId: "TLE-D",
    level: "Tle",
    series: "D",
    status: "Nouveau",
    neighborhood: "Agoè-Nyivé Assiyéyé, Lomé",
    guardianName: "M. Abalo Koffi",
    guardianPhone: "+228 90 19 73 45",
    enrollmentDate: "2026-09-09"
  },
  {
    id: "STD-004",
    matricule: "LMEL-2026-004",
    firstName: "Yao Caleb",
    lastName: "KLUTSE",
    gender: "M",
    birthDate: "2007-05-19",
    birthPlace: "Tsévié",
    classId: "TLE-D",
    level: "Tle",
    series: "D",
    status: "Redoublant",
    neighborhood: "Bè-Klikamé, Lomé",
    guardianName: "M. Komi Klutse",
    guardianPhone: "+228 92 64 11 90",
    enrollmentDate: "2026-09-10"
  },
  {
    id: "STD-005",
    matricule: "LMEL-2026-005",
    firstName: "Mawuli Hervé",
    lastName: "OURO-DJERI",
    gender: "M",
    birthDate: "2008-01-29",
    birthPlace: "Sokodé",
    classId: "TLE-C4",
    level: "Tle",
    series: "C4",
    status: "Nouveau",
    neighborhood: "Hédzranawoé, Lomé",
    guardianName: "El-Hadj Issifou Ouro-Djeri",
    guardianPhone: "+228 90 08 44 12",
    enrollmentDate: "2026-09-07"
  },
  {
    id: "STD-006",
    matricule: "LMEL-2026-006",
    firstName: "Kayi Ornella",
    lastName: "LAWSON-BODY",
    gender: "F",
    birthDate: "2008-06-12",
    birthPlace: "Aného",
    classId: "TLE-A4",
    level: "Tle",
    series: "A4",
    status: "Nouveau",
    neighborhood: "Kodjoviakopé, Lomé",
    guardianName: "Mme Dédé Lawson-Body",
    guardianPhone: "+228 91 32 70 05",
    enrollmentDate: "2026-09-08"
  },
  {
    id: "STD-007",
    matricule: "LMEL-2026-007",
    firstName: "Edem Josué",
    lastName: "AGBODJAN",
    gender: "M",
    birthDate: "2008-09-17",
    birthPlace: "Lomé",
    classId: "TLE-A4",
    level: "Tle",
    series: "A4",
    status: "Nouveau",
    neighborhood: "Nyékonakpoè, Lomé",
    guardianName: "M. Fogan Agbodjan",
    guardianPhone: "+228 90 77 62 39",
    enrollmentDate: "2026-09-09"
  },
  {
    id: "STD-008",
    matricule: "LMEL-2026-008",
    firstName: "Akouvi Esther",
    lastName: "DOGBEVI",
    gender: "F",
    birthDate: "2009-03-25",
    birthPlace: "Atakpamé",
    classId: "1ERE-D",
    level: "1ère",
    series: "D",
    status: "Nouveau",
    neighborhood: "Agoè Cacavéli, Lomé",
    guardianName: "M. Kossi Dogbevi",
    guardianPhone: "+228 93 14 58 21",
    enrollmentDate: "2026-09-10"
  },
  {
    id: "STD-009",
    matricule: "LMEL-2026-009",
    firstName: "Komlan Samuel",
    lastName: "Tameklo",
    gender: "M",
    birthDate: "2009-07-08",
    birthPlace: "Lomé",
    classId: "1ERE-A4",
    level: "1ère",
    series: "A4",
    status: "Nouveau",
    neighborhood: "Baguida, Lomé",
    guardianName: "Mme Ayoko Tameklo",
    guardianPhone: "+228 90 82 31 60",
    enrollmentDate: "2026-09-11"
  },
  {
    id: "STD-010",
    matricule: "LMEL-2026-010",
    firstName: "Sena Prisca",
    lastName: "KPODAR",
    gender: "F",
    birthDate: "2010-02-14",
    birthPlace: "Lomé",
    classId: "2NDE-CD",
    level: "2nde",
    series: "CD",
    status: "Nouveau",
    neighborhood: "Tokoin Forever, Lomé",
    guardianName: "Dr. Kangni Kpodar",
    guardianPhone: "+228 91 90 15 44",
    enrollmentDate: "2026-09-11"
  }
];

const teacherBySubject = {
  SVT: "M. Koffi Mensah",
  MAT: "M. Essohanam Tchalla",
  FRA: "Mme Afiwa Dogbé",
  PCT: "M. Kodjo Agbeko",
  PHI: "Mme Akouvi Amégan",
  HG: "M. Yao Kpatcha",
  ANG: "Mme Mawuse Lawson",
  ALL: "M. Komlan Aziable",
  ECM: "M. Sena Gbeassor",
  EPS: "M. Edem Koudossou"
};

/**
 * Profils de notes réalistes pour chaque élève afin de générer des bulletins authentiques
 */
const studentBaseProfiles = {
  "STD-001": { base: 16.2, variance: 1.2 }, // Excellente (Très Bien)
  "STD-002": { base: 14.3, variance: 1.5 }, // Bien
  "STD-003": { base: 12.6, variance: 1.4 }, // Assez Bien
  "STD-004": { base: 9.8, variance: 1.6 },  // Passable / Insuffisant
  "STD-005": { base: 16.8, variance: 1.1 }, // Major Série C4
  "STD-006": { base: 15.1, variance: 1.3 }, // Très bonne littéraire
  "STD-007": { base: 11.4, variance: 1.5 }, // Passable
  "STD-008": { base: 13.7, variance: 1.3 }, // Assez Bien
  "STD-009": { base: 12.2, variance: 1.4 }, // Assez Bien
  "STD-010": { base: 15.4, variance: 1.2 }  // Bien
};

function clampGrade(n) {
  const val = Math.max(4, Math.min(19.5, n));
  return Math.round(val * 2) / 2; // Notes au demi-point (ex: 14.5, 16, 12.5)
}

function buildInitialGrades() {
  const grades = [];
  for (const student of students) {
    const subjects = SUBJECTS_BY_SERIES[student.series] || SUBJECTS_BY_SERIES.D;
    const profile = studentBaseProfiles[student.id] || { base: 12, variance: 1.5 };

    for (const trimester of [1, 2]) {
      subjects.forEach((sub, idx) => {
        const offset = ((idx % 3) - 1) * 0.75 + (trimester === 2 ? 0.5 : 0);
        const interro = clampGrade(profile.base + offset);
        const devoir = clampGrade(profile.base - offset * 0.5 + 0.5);
        const compo = clampGrade(profile.base + (idx % 2 === 0 ? 0.5 : -0.5) + (trimester === 2 ? 0.5 : 0));

        grades.push({
          id: `GRD-${student.id}-T${trimester}-${sub.code}`,
          studentId: student.id,
          classId: student.classId,
          trimester,
          subjectCode: sub.code,
          subjectName: sub.name,
          coefficient: sub.coefficient,
          interro,
          devoir,
          compo,
          teacherName: teacherBySubject[sub.code] || "Prof. Titulaire"
        });
      });
    }
  }
  return grades;
}

const tuitionPayments = [
  {
    id: "PAY-001",
    receiptNumber: "REC-2026-00101",
    studentId: "STD-001",
    amount: 110000,
    date: "2026-09-07",
    method: "Flooz / Mobile Money",
    tranche: "Scolarité Complète (1ère, 2ème & 3ème Tranches)",
    recordedBy: "Caisse Principale - Intendance"
  },
  {
    id: "PAY-002",
    receiptNumber: "REC-2026-00102",
    studentId: "STD-002",
    amount: 55000,
    date: "2026-09-08",
    method: "TMoney (Togocom)",
    tranche: "1ère Tranche (Inscription + Dossier BAC II)",
    recordedBy: "Caisse Principale - Intendance"
  },
  {
    id: "PAY-003",
    receiptNumber: "REC-2026-00103",
    studentId: "STD-002",
    amount: 35000,
    date: "2026-10-12",
    method: "Espèces (Guichet)",
    tranche: "2ème Tranche",
    recordedBy: "Caisse Principale - Intendance"
  },
  {
    id: "PAY-004",
    receiptNumber: "REC-2026-00104",
    studentId: "STD-003",
    amount: 55000,
    date: "2026-09-09",
    method: "Versement Bancaire (ORABANK)",
    tranche: "1ère Tranche (Inscription + Dossier BAC II)",
    recordedBy: "Caisse Principale - Intendance"
  },
  {
    id: "PAY-005",
    receiptNumber: "REC-2026-00105",
    studentId: "STD-004",
    amount: 35000,
    date: "2026-09-10",
    method: "Espèces (Guichet)",
    tranche: "Acompte 1ère Tranche",
    recordedBy: "Caisse Principale - Intendance"
  },
  {
    id: "PAY-006",
    receiptNumber: "REC-2026-00106",
    studentId: "STD-005",
    amount: 110000,
    date: "2026-09-07",
    method: "TMoney (Togocom)",
    tranche: "Scolarité Complète (Année 2026-2027)",
    recordedBy: "Caisse Principale - Intendance"
  },
  {
    id: "PAY-007",
    receiptNumber: "REC-2026-00107",
    studentId: "STD-006",
    amount: 90000,
    date: "2026-09-08",
    method: "Versement Bancaire (ECOBANK)",
    tranche: "1ère & 2ème Tranches",
    recordedBy: "Caisse Principale - Intendance"
  },
  {
    id: "PAY-008",
    receiptNumber: "REC-2026-00108",
    studentId: "STD-007",
    amount: 55000,
    date: "2026-09-09",
    method: "Espèces (Guichet)",
    tranche: "1ère Tranche",
    recordedBy: "Caisse Principale - Intendance"
  },
  {
    id: "PAY-009",
    receiptNumber: "REC-2026-00109",
    studentId: "STD-008",
    amount: 95000,
    date: "2026-09-10",
    method: "TMoney (Togocom)",
    tranche: "Scolarité Complète 1ère D",
    recordedBy: "Caisse Principale - Intendance"
  },
  {
    id: "PAY-010",
    receiptNumber: "REC-2026-00110",
    studentId: "STD-009",
    amount: 45000,
    date: "2026-09-11",
    method: "Flooz / Mobile Money",
    tranche: "1ère Tranche 1ère A4",
    recordedBy: "Caisse Principale - Intendance"
  },
  {
    id: "PAY-011",
    receiptNumber: "REC-2026-00111",
    studentId: "STD-010",
    amount: 85000,
    date: "2026-09-11",
    method: "Versement Bancaire (UTB)",
    tranche: "Scolarité Complète 2nde CD",
    recordedBy: "Caisse Principale - Intendance"
  }
];

const attendanceRecords = [
  {
    id: "ATT-001",
    studentId: "STD-004",
    date: "2026-10-14",
    type: "Absence",
    durationHours: 2,
    subjectName: "Mathématiques",
    justified: false,
    reason: "Non justifiée — Convocation parentale envoyée",
    supervisor: "Surveillant Général M. K. Dzidzonu"
  },
  {
    id: "ATT-002",
    studentId: "STD-003",
    date: "2026-10-16",
    type: "Absence",
    durationHours: 4,
    subjectName: "Matinée complète",
    justified: true,
    reason: "Consultation médicale au CHU Sylvanus Olympio (Certificat médical fourni)",
    supervisor: "Surveillant Général M. K. Dzidzonu"
  },
  {
    id: "ATT-003",
    studentId: "STD-007",
    date: "2026-10-19",
    type: "Retard",
    durationHours: 1,
    subjectName: "Philosophie (07h00)",
    justified: false,
    reason: "Arrivée après la montée des couleurs nationales (07h15)",
    supervisor: "Censeur des Études"
  }
];

const timetable = [
  { day: "Lundi", slot: "07h00 - 09h00", TLE_D: "Mathématiques (M. Tchalla)", TLE_A4: "Français (Mme Dogbé)", TLE_C4: "Sciences Physiques (M. Agbeko)" },
  { day: "Lundi", slot: "09h00 - 11h00", TLE_D: "SVT (M. Mensah)", TLE_A4: "Philosophie (Mme Amégan)", TLE_C4: "Mathématiques (M. Tchalla)" },
  { day: "Lundi", slot: "15h00 - 17h00", TLE_D: "Français (Mme Dogbé)", TLE_A4: "Anglais (Mme Lawson)", TLE_C4: "Philosophie (Mme Amégan)" },
  { day: "Mardi", slot: "07h00 - 09h00", TLE_D: "Sciences Physiques (M. Agbeko)", TLE_A4: "Histoire-Géo (M. Kpatcha)", TLE_C4: "Mathématiques (M. Tchalla)" },
  { day: "Mardi", slot: "09h00 - 11h00", TLE_D: "Philosophie (Mme Amégan)", TLE_A4: "Allemand/Espagnol (M. Aziable)", TLE_C4: "SVT (M. Mensah)" },
  { day: "Mercredi", slot: "07h00 - 09h00", TLE_D: "Histoire-Géo (M. Kpatcha)", TLE_A4: "Philosophie (Mme Amégan)", TLE_C4: "Sciences Physiques (M. Agbeko)" },
  { day: "Mercredi", slot: "09h00 - 11h00", TLE_D: "EPS (Stade Scolaire)", TLE_A4: "EPS (Stade Scolaire)", TLE_C4: "EPS (Stade Scolaire)" },
  { day: "Jeudi", slot: "07h00 - 09h00", TLE_D: "SVT — Travaux Pratiques", TLE_A4: "Français — Dissertation", TLE_C4: "Mathématiques — Géométrie" },
  { day: "Jeudi", slot: "09h00 - 11h00", TLE_D: "Anglais (Mme Lawson)", TLE_A4: "ECM (M. Gbeassor)", TLE_C4: "Anglais (Mme Lawson)" },
  { day: "Vendredi", slot: "07h00 - 09h00", TLE_D: "Mathématiques (M. Tchalla)", TLE_A4: "Histoire-Géo (M. Kpatcha)", TLE_C4: "Sciences Physiques (M. Agbeko)" },
  { day: "Vendredi", slot: "09h00 - 11h00", TLE_D: "ECM (M. Gbeassor)", TLE_A4: "Mathématiques (M. Tchalla)", TLE_C4: "Français (Mme Dogbé)" },
  { day: "Vendredi", slot: "15h00 - 17h00", TLE_D: "Devoir Surveillé Hebdomadaire", TLE_A4: "Devoir Surveillé Hebdomadaire", TLE_C4: "Devoir Surveillé Hebdomadaire" }
];

function getInitialData() {
  return {
    classes,
    teachers,
    students,
    grades: buildInitialGrades(),
    tuitionPayments,
    attendanceRecords,
    timetable,
    tuitionRates: TUITION_RATES
  };
}

module.exports = {
  getInitialData
};
