/**
 * Service de calcul académique (Système sur 20, Coefficients, Mentions et Rang)
 */

const { SUBJECTS_BY_SERIES } = require("../config/schoolSystem");

/**
 * Arrondit un nombre à 2 décimales
 * @param {number} value
 * @returns {number}
 */
function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

/**
 * Calcule la moyenne d'une matière sur 20 à partir de :
 * - interrogation (/20)
 * - devoir (/20)
 * - composition (/20)
 * Formule standard des lycées francophones :
 *   Moyenne de classe = (Interrogation + Devoir) / 2
 *   Moyenne trimestrielle = (Moyenne de classe + Composition) / 2
 */
function computeSubjectAverage(interro, devoir, compo) {
  const i = Number(interro) || 0;
  const d = Number(devoir) || 0;
  const c = Number(compo) || 0;
  const classAvg = (i + d) / 2;
  const subjectAvg = (classAvg + c) / 2;
  return {
    interro: round2(i),
    devoir: round2(d),
    compo: round2(c),
    classAverage: round2(classAvg),
    average: round2(subjectAvg)
  };
}

/**
 * Retourne l'appréciation d'une matière selon la moyenne sur 20
 * @param {number} avg
 * @returns {string}
 */
function getSubjectAppreciation(avg) {
  if (avg >= 18) return "Excellent";
  if (avg >= 16) return "Très Bien";
  if (avg >= 14) return "Bien";
  if (avg >= 12) return "Assez Bien";
  if (avg >= 10) return "Passable";
  if (avg >= 8) return "Insuffisant";
  return "Faible";
}

/**
 * Retourne la mention, la distinction et l'appréciation du Conseil de Classe
 * selon la moyenne générale sur 20
 * @param {number} generalAverage
 */
function getCouncilDecision(generalAverage) {
  const avg = Number(generalAverage) || 0;
  if (avg >= 16) {
    return {
      mention: "Très Bien",
      honorRoll: true,
      distinction: "Tableau d'Honneur + Félicitations",
      councilComment: "Excellent travail ! Élève brillant(e) et exemplaire. Félicitations du Conseil de Classe.",
      badgeColor: "emerald"
    };
  }
  if (avg >= 14) {
    return {
      mention: "Bien",
      honorRoll: true,
      distinction: "Tableau d'Honneur + Encouragements",
      councilComment: "Très bon trimestre. Résultats solides et réguliers. Encouragements du Conseil de Classe.",
      badgeColor: "blue"
    };
  }
  if (avg >= 12) {
    return {
      mention: "Assez Bien",
      honorRoll: true,
      distinction: "Tableau d'Honneur",
      councilComment: "Bon ensemble. Maintenez ce cap pour progresser davantage au prochain trimestre.",
      badgeColor: "indigo"
    };
  }
  if (avg >= 10) {
    return {
      mention: "Passable",
      honorRoll: false,
      distinction: "Aucune distinction",
      councilComment: "Ensemble moyen. Peut mieux faire avec davantage de rigueur et de régularité dans l'étude.",
      badgeColor: "amber"
    };
  }
  if (avg >= 8) {
    return {
      mention: "Insuffisant",
      honorRoll: false,
      distinction: "Avertissement Travail",
      councilComment: "Résultats insuffisants. Un sursaut immédiat est indispensable au prochain trimestre.",
      badgeColor: "orange"
    };
  }
  return {
    mention: "Très Insuffisant",
    honorRoll: false,
    distinction: "Blâme Travail",
    councilComment: "Ensemble très faible. Manque de travail manifeste. Ressaisissez-vous impérativement.",
    badgeColor: "red"
  };
}

/**
 * Génère le bilan détaillé des notes d'un élève pour un trimestre donné
 * @param {object} student - Objet élève (avec series, classId, etc.)
 * @param {Array} studentGrades - Liste des notes de l'élève pour ce trimestre
 */
function computeStudentTrimesterReport(student, studentGrades = []) {
  const subjects = SUBJECTS_BY_SERIES[student.series] || SUBJECTS_BY_SERIES.D;
  const gradesBySubject = {};
  for (const g of studentGrades) {
    gradesBySubject[g.subjectCode] = g;
  }

  let totalCoefficient = 0;
  let totalWeightedPoints = 0;

  const subjectRows = subjects.map((sub) => {
    const raw = gradesBySubject[sub.code] || { interro: 10, devoir: 10, compo: 10 };
    const computed = computeSubjectAverage(raw.interro, raw.devoir, raw.compo);
    const weightedPoints = round2(computed.average * sub.coefficient);

    totalCoefficient += sub.coefficient;
    totalWeightedPoints += weightedPoints;

    return {
      subjectCode: sub.code,
      subjectName: sub.name,
      category: sub.category,
      coefficient: sub.coefficient,
      interro: computed.interro,
      devoir: computed.devoir,
      classAverage: computed.classAverage,
      compo: computed.compo,
      average: computed.average,
      weightedPoints,
      appreciation: getSubjectAppreciation(computed.average),
      teacherName: raw.teacherName || "Prof. Titulaire"
    };
  });

  const generalAverage = totalCoefficient > 0 ? round2(totalWeightedPoints / totalCoefficient) : 0;
  const decision = getCouncilDecision(generalAverage);

  return {
    studentId: student.id,
    totalCoefficient,
    totalWeightedPoints: round2(totalWeightedPoints),
    generalAverage,
    ...decision,
    subjects: subjectRows
  };
}

/**
 * Calcule le classement (rang) de tous les élèves d'une classe pour un trimestre
 * Gère les ex-aequo (ex: "1er", "2e", "2e ex", "4e")
 */
function computeClassRanking(classStudents, allGradesForTrimester) {
  const reports = classStudents.map((student) => {
    const sGrades = allGradesForTrimester.filter((g) => g.studentId === student.id);
    const report = computeStudentTrimesterReport(student, sGrades);
    return {
      student,
      ...report
    };
  });

  reports.sort((a, b) => b.generalAverage - a.generalAverage);

  const averages = reports.map((r) => r.generalAverage);
  const classStats = {
    effectif: reports.length,
    classAverage: reports.length > 0 ? round2(averages.reduce((s, v) => s + v, 0) / reports.length) : 0,
    highestAverage: reports.length > 0 ? Math.max(...averages) : 0,
    lowestAverage: reports.length > 0 ? Math.min(...averages) : 0,
    passCount: reports.filter((r) => r.generalAverage >= 10).length,
    passRate: reports.length > 0
      ? round2((reports.filter((r) => r.generalAverage >= 10).length / reports.length) * 100)
      : 0
  };

  let currentRank = 1;
  return reports.map((item, idx) => {
    const isExAequo = idx > 0 && item.generalAverage === reports[idx - 1].generalAverage;
    if (!isExAequo) {
      currentRank = idx + 1;
    }
    const suffix = currentRank === 1 ? (item.student.gender === "F" ? "1ère" : "1er") : `${currentRank}ème`;
    const rankLabel = isExAequo ? `${suffix} ex` : suffix;

    return {
      ...item,
      rank: currentRank,
      rankLabel,
      classStats
    };
  });
}

module.exports = {
  round2,
  computeSubjectAverage,
  getSubjectAppreciation,
  getCouncilDecision,
  computeStudentTrimesterReport,
  computeClassRanking
};
