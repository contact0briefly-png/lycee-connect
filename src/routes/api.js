const express = require("express");
const router = express.Router();
const {
  SCHOOL_INFO,
  SERIES,
  SUBJECTS_BY_SERIES,
  TUITION_RATES,
  TRIMESTERS
} = require("../config/schoolSystem");
const {
  round2,
  computeStudentTrimesterReport,
  computeClassRanking
} = require("../services/gradeCalculator");
const { loadStore, saveStore, resetStore } = require("../services/store");

/**
 * GET /api/config
 * Retourne le référentiel du système scolaire (séries, coefficients, frais FCFA, trimestres)
 */
router.get("/config", (req, res) => {
  res.json({
    school: SCHOOL_INFO,
    series: SERIES,
    subjectsBySeries: SUBJECTS_BY_SERIES,
    tuitionRates: TUITION_RATES,
    trimesters: TRIMESTERS
  });
});

/**
 * Calcule la situation financière (Écolage FCFA) de chaque élève
 */
function buildStudentTuitionSummary(students, payments) {
  return students.map((student) => {
    const rate = TUITION_RATES[student.level] || TUITION_RATES["Tle"];
    const totalDue = rate.totalAnnual;
    const studentPayments = payments.filter((p) => p.studentId === student.id);
    const totalPaid = studentPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const balance = Math.max(0, totalDue - totalPaid);
    const progressPercent = totalDue > 0 ? Math.min(100, Math.round((totalPaid / totalDue) * 100)) : 100;

    let status = "En cours";
    if (balance === 0) status = "Soldé";
    else if (progressPercent < 50) status = "Relance requise";

    return {
      studentId: student.id,
      matricule: student.matricule,
      studentName: `${student.lastName} ${student.firstName}`,
      classId: student.classId,
      level: student.level,
      series: student.series,
      guardianName: student.guardianName,
      guardianPhone: student.guardianPhone,
      totalDue,
      totalPaid,
      balance,
      progressPercent,
      status,
      payments: studentPayments
    };
  });
}

/**
 * GET /api/dashboard
 * Statistiques globales pour le tableau de bord du Proviseur / Censeur
 */
router.get("/dashboard", (req, res) => {
  const trimester = Number(req.query.trimester) || 1;
  const db = loadStore();
  const trimesterGrades = db.grades.filter((g) => Number(g.trimester) === trimester);

  const studentReports = db.students.map((student) => {
    const sGrades = trimesterGrades.filter((g) => g.studentId === student.id);
    return {
      student,
      ...computeStudentTrimesterReport(student, sGrades)
    };
  });

  studentReports.sort((a, b) => b.generalAverage - a.generalAverage);

  const avgList = studentReports.map((r) => r.generalAverage);
  const schoolAverage = avgList.length > 0
    ? round2(avgList.reduce((s, v) => s + v, 0) / avgList.length)
    : 0;
  const passCount = studentReports.filter((r) => r.generalAverage >= 10).length;
  const honorRollCount = studentReports.filter((r) => r.honorRoll).length;
  const passRate = studentReports.length > 0 ? round2((passCount / studentReports.length) * 100) : 0;

  const tuitionSummaries = buildStudentTuitionSummary(db.students, db.tuitionPayments);
  const totalTuitionExpected = tuitionSummaries.reduce((s, t) => s + t.totalDue, 0);
  const totalTuitionCollected = tuitionSummaries.reduce((s, t) => s + t.totalPaid, 0);
  const tuitionRecoveryRate = totalTuitionExpected > 0
    ? round2((totalTuitionCollected / totalTuitionExpected) * 100)
    : 0;

  const classPerformance = db.classes.map((cls) => {
    const clsStudents = db.students.filter((s) => s.classId === cls.id);
    const ranking = computeClassRanking(clsStudents, trimesterGrades);
    const stats = ranking[0]?.classStats || {
      effectif: 0,
      classAverage: 0,
      highestAverage: 0,
      lowestAverage: 0,
      passRate: 0
    };
    return {
      ...cls,
      effectif: clsStudents.length,
      ...stats,
      topStudent: ranking[0]
        ? `${ranking[0].student.lastName} ${ranking[0].student.firstName} (${ranking[0].generalAverage.toFixed(2)}/20)`
        : "—"
    };
  });

  res.json({
    school: SCHOOL_INFO,
    trimester,
    kpis: {
      totalStudents: db.students.length,
      girlsCount: db.students.filter((s) => s.gender === "F").length,
      boysCount: db.students.filter((s) => s.gender === "M").length,
      totalTeachers: db.teachers.length,
      totalClasses: db.classes.length,
      schoolAverage,
      passRate,
      passCount,
      honorRollCount,
      totalTuitionExpected,
      totalTuitionCollected,
      totalTuitionRemaining: Math.max(0, totalTuitionExpected - totalTuitionCollected),
      tuitionRecoveryRate
    },
    topStudents: studentReports.slice(0, 5).map((r, i) => ({
      rank: i + 1,
      id: r.student.id,
      matricule: r.student.matricule,
      name: `${r.student.lastName} ${r.student.firstName}`,
      classId: r.student.classId,
      series: r.student.series,
      generalAverage: r.generalAverage,
      mention: r.mention,
      distinction: r.distinction
    })),
    classPerformance
  });
});

/**
 * GET /api/students
 */
router.get("/students", (req, res) => {
  const trimester = Number(req.query.trimester) || 1;
  const { classId, series, search } = req.query;
  const db = loadStore();
  const trimesterGrades = db.grades.filter((g) => Number(g.trimester) === trimester);
  const tuitionMap = {};
  for (const t of buildStudentTuitionSummary(db.students, db.tuitionPayments)) {
    tuitionMap[t.studentId] = t;
  }

  let list = db.students.map((student) => {
    const classStudents = db.students.filter((s) => s.classId === student.classId);
    const ranking = computeClassRanking(classStudents, trimesterGrades);
    const myRank = ranking.find((r) => r.student.id === student.id);
    const tuition = tuitionMap[student.id];

    return {
      ...student,
      generalAverage: myRank ? myRank.generalAverage : 0,
      mention: myRank ? myRank.mention : "—",
      rankLabel: myRank ? myRank.rankLabel : "—",
      tuitionStatus: tuition ? tuition.status : "—",
      tuitionPaid: tuition ? tuition.totalPaid : 0,
      tuitionDue: tuition ? tuition.totalDue : 0
    };
  });

  if (classId) {
    list = list.filter((s) => s.classId === classId);
  }
  if (series) {
    list = list.filter((s) => s.series === series);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (s) =>
        s.firstName.toLowerCase().includes(q) ||
        s.lastName.toLowerCase().includes(q) ||
        s.matricule.toLowerCase().includes(q)
    );
  }

  res.json(list);
});

/**
 * POST /api/students
 * Inscrire un nouvel élève et initialiser ses notes par défaut
 */
router.post("/students", (req, res) => {
  const db = loadStore();
  const {
    firstName,
    lastName,
    gender = "M",
    birthDate = "2008-05-15",
    birthPlace = "Lomé",
    classId = "TLE-D",
    status = "Nouveau",
    neighborhood = "Lomé",
    guardianName = "Parent / Tuteur",
    guardianPhone = "+228 90 00 00 00",
    initialDeposit = 0
  } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).json({ error: "Le nom et le prénom de l'élève sont obligatoires." });
  }

  const cls = db.classes.find((c) => c.id === classId) || db.classes[0];
  const nextNumber = db.students.length + 1;
  const id = `STD-${String(nextNumber).padStart(3, "0")}`;
  const matricule = `LMEL-2026-${String(nextNumber).padStart(3, "0")}`;

  const newStudent = {
    id,
    matricule,
    firstName: firstName.trim(),
    lastName: lastName.trim().toUpperCase(),
    gender,
    birthDate,
    birthPlace,
    classId: cls.id,
    level: cls.level,
    series: cls.series,
    status,
    neighborhood,
    guardianName,
    guardianPhone,
    enrollmentDate: new Date().toISOString().slice(0, 10)
  };

  db.students.push(newStudent);

  // Initialiser les matières de la série pour les trimestres 1 et 2
  const subjects = SUBJECTS_BY_SERIES[cls.series] || SUBJECTS_BY_SERIES.D;
  for (const trimester of [1, 2]) {
    for (const sub of subjects) {
      db.grades.push({
        id: `GRD-${id}-T${trimester}-${sub.code}`,
        studentId: id,
        classId: cls.id,
        trimester,
        subjectCode: sub.code,
        subjectName: sub.name,
        coefficient: sub.coefficient,
        interro: 12,
        devoir: 12,
        compo: 12,
        teacherName: "Prof. Titulaire"
      });
    }
  }

  // Enregistrer le versement initial d'écolage s'il est fourni
  if (Number(initialDeposit) > 0) {
    const payIndex = db.tuitionPayments.length + 101;
    db.tuitionPayments.unshift({
      id: `PAY-${Date.now()}`,
      receiptNumber: `REC-2026-00${payIndex}`,
      studentId: id,
      amount: Number(initialDeposit),
      date: new Date().toISOString().slice(0, 10),
      method: "Guichet Intendance / Mobile Money",
      tranche: "1ère Tranche (Inscription)",
      recordedBy: "Caisse Principale - Intendance"
    });
  }

  saveStore(db);
  res.status(201).json(newStudent);
});

/**
 * GET /api/classes
 */
router.get("/classes", (req, res) => {
  const db = loadStore();
  const result = db.classes.map((cls) => {
    const studentsInClass = db.students.filter((s) => s.classId === cls.id);
    const subjects = SUBJECTS_BY_SERIES[cls.series] || [];
    const totalCoefficient = subjects.reduce((s, sub) => s + sub.coefficient, 0);
    return {
      ...cls,
      effectif: studentsInClass.length,
      totalCoefficient,
      subjects
    };
  });
  res.json(result);
});

/**
 * GET /api/teachers
 */
router.get("/teachers", (req, res) => {
  const db = loadStore();
  res.json(db.teachers);
});

/**
 * GET /api/grades
 * Récupère les notes d'un élève pour un trimestre donné
 */
router.get("/grades", (req, res) => {
  const { studentId, trimester = 1 } = req.query;
  const db = loadStore();
  if (!studentId) {
    return res.status(400).json({ error: "Veuillez spécifier studentId." });
  }
  const student = db.students.find((s) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: "Élève introuvable." });
  }
  const sGrades = db.grades.filter(
    (g) => g.studentId === studentId && Number(g.trimester) === Number(trimester)
  );
  const report = computeStudentTrimesterReport(student, sGrades);
  res.json({
    student,
    trimester: Number(trimester),
    report
  });
});

/**
 * POST /api/grades
 * Enregistre ou met à jour une note (Interrogation, Devoir, Composition sur 20)
 */
router.post("/grades", (req, res) => {
  const { studentId, trimester = 1, subjectCode, interro, devoir, compo } = req.body;
  if (!studentId || !subjectCode) {
    return res.status(400).json({ error: "studentId et subjectCode sont requis." });
  }
  const db = loadStore();
  const student = db.students.find((s) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: "Élève introuvable." });
  }

  const clamp = (val) => Math.max(0, Math.min(20, Number(val) || 0));
  const existing = db.grades.find(
    (g) =>
      g.studentId === studentId &&
      Number(g.trimester) === Number(trimester) &&
      g.subjectCode === subjectCode
  );

  if (existing) {
    existing.interro = clamp(interro);
    existing.devoir = clamp(devoir);
    existing.compo = clamp(compo);
  } else {
    const subjects = SUBJECTS_BY_SERIES[student.series] || SUBJECTS_BY_SERIES.D;
    const sub = subjects.find((s) => s.code === subjectCode) || {
      code: subjectCode,
      name: subjectCode,
      coefficient: 2
    };
    db.grades.push({
      id: `GRD-${studentId}-T${trimester}-${subjectCode}`,
      studentId,
      classId: student.classId,
      trimester: Number(trimester),
      subjectCode: sub.code,
      subjectName: sub.name,
      coefficient: sub.coefficient,
      interro: clamp(interro),
      devoir: clamp(devoir),
      compo: clamp(compo),
      teacherName: "Prof. Titulaire"
    });
  }

  saveStore(db);
  const sGrades = db.grades.filter(
    (g) => g.studentId === studentId && Number(g.trimester) === Number(trimester)
  );
  const report = computeStudentTrimesterReport(student, sGrades);
  res.json({
    message: "Notes mises à jour avec succès",
    report
  });
});

/**
 * GET /api/bulletins/:studentId
 * Génère le bulletin scolaire officiel complet d'un élève pour un trimestre donné
 */
router.get("/bulletins/:studentId", (req, res) => {
  const { studentId } = req.params;
  const trimester = Number(req.query.trimester) || 1;
  const db = loadStore();

  const student = db.students.find((s) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: "Élève introuvable." });
  }

  const cls = db.classes.find((c) => c.id === student.classId);
  const classStudents = db.students.filter((s) => s.classId === student.classId);
  const trimesterGrades = db.grades.filter((g) => Number(g.trimester) === trimester);

  const ranking = computeClassRanking(classStudents, trimesterGrades);
  const studentRankedReport = ranking.find((r) => r.student.id === studentId);

  const studentAttendance = db.attendanceRecords.filter((a) => a.studentId === studentId);
  const totalAbsenceHours = studentAttendance
    .filter((a) => a.type === "Absence")
    .reduce((sum, a) => sum + Number(a.durationHours || 0), 0);
  const unjustifiedHours = studentAttendance
    .filter((a) => a.type === "Absence" && !a.justified)
    .reduce((sum, a) => sum + Number(a.durationHours || 0), 0);
  const delaysCount = studentAttendance.filter((a) => a.type === "Retard").length;

  const trimesterInfo = TRIMESTERS.find((t) => t.id === trimester) || TRIMESTERS[0];

  res.json({
    school: SCHOOL_INFO,
    trimester: trimesterInfo,
    classInfo: cls,
    student,
    academic: studentRankedReport,
    attendance: {
      totalAbsenceHours,
      unjustifiedHours,
      delaysCount
    },
    generatedAt: new Date().toISOString().slice(0, 10)
  });
});

/**
 * GET /api/tuition
 * Suivi des frais de scolarité (Écolage en FCFA) et historique des reçus
 */
router.get("/tuition", (req, res) => {
  const db = loadStore();
  const summaries = buildStudentTuitionSummary(db.students, db.tuitionPayments);
  const enrichedPayments = db.tuitionPayments.map((p) => {
    const st = db.students.find((s) => s.id === p.studentId);
    return {
      ...p,
      studentName: st ? `${st.lastName} ${st.firstName}` : p.studentId,
      matricule: st ? st.matricule : "—",
      classId: st ? st.classId : "—"
    };
  });

  res.json({
    currency: "FCFA",
    rates: TUITION_RATES,
    summaries,
    payments: enrichedPayments
  });
});

/**
 * POST /api/tuition
 * Enregistrer un nouveau règlement d'écolage en FCFA et générer un reçu
 */
router.post("/tuition", (req, res) => {
  const { studentId, amount, method = "TMoney / Flooz", tranche = "Versement Scolarité" } = req.body;
  if (!studentId || !amount || Number(amount) <= 0) {
    return res.status(400).json({ error: "Élève et montant valide (> 0 FCFA) requis." });
  }

  const db = loadStore();
  const student = db.students.find((s) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: "Élève introuvable." });
  }

  const receiptNumber = `REC-2026-00${db.tuitionPayments.length + 101}`;
  const payment = {
    id: `PAY-${Date.now()}`,
    receiptNumber,
    studentId,
    amount: Number(amount),
    date: new Date().toISOString().slice(0, 10),
    method,
    tranche,
    recordedBy: "Caisse Principale - Intendance"
  };

  db.tuitionPayments.unshift(payment);
  saveStore(db);

  res.status(201).json({
    message: "Paiement enregistré avec succès",
    payment: {
      ...payment,
      studentName: `${student.lastName} ${student.firstName}`,
      matricule: student.matricule,
      classId: student.classId
    }
  });
});

/**
 * GET /api/attendance
 */
router.get("/attendance", (req, res) => {
  const db = loadStore();
  const enriched = db.attendanceRecords.map((rec) => {
    const st = db.students.find((s) => s.id === rec.studentId);
    return {
      ...rec,
      studentName: st ? `${st.lastName} ${st.firstName}` : rec.studentId,
      matricule: st ? st.matricule : "—",
      classId: st ? st.classId : "—"
    };
  });
  res.json(enriched);
});

/**
 * POST /api/attendance
 */
router.post("/attendance", (req, res) => {
  const {
    studentId,
    type = "Absence",
    durationHours = 2,
    subjectName = "Cours",
    justified = false,
    reason = "À justifier"
  } = req.body;

  if (!studentId) {
    return res.status(400).json({ error: "studentId est requis." });
  }

  const db = loadStore();
  const newRecord = {
    id: `ATT-${Date.now()}`,
    studentId,
    date: new Date().toISOString().slice(0, 10),
    type,
    durationHours: Number(durationHours) || 1,
    subjectName,
    justified: Boolean(justified),
    reason,
    supervisor: "Surveillant Général"
  };

  db.attendanceRecords.unshift(newRecord);
  saveStore(db);
  res.status(201).json(newRecord);
});

/**
 * GET /api/timetable
 */
router.get("/timetable", (req, res) => {
  const db = loadStore();
  res.json(db.timetable);
});

/**
 * POST /api/reset
 */
router.post("/reset", (req, res) => {
  const data = resetStore();
  res.json({
    message: "Base de données de démonstration réinitialisée avec succès.",
    studentsCount: data.students.length
  });
});

module.exports = router;
