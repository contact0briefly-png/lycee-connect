const test = require("node:test");
const assert = require("node:assert/strict");
const {
  computeSubjectAverage,
  getCouncilDecision,
  computeStudentTrimesterReport,
  computeClassRanking
} = require("../src/services/gradeCalculator");

test("computeSubjectAverage calcule correctement la moyenne de classe et la moyenne trimestrielle sur 20", () => {
  // Interro = 14, Devoir = 16 -> Moyenne de classe = 15
  // Composition = 17 -> Moyenne trimestrielle = (15 + 17) / 2 = 16
  const res = computeSubjectAverage(14, 16, 17);
  assert.equal(res.classAverage, 15);
  assert.equal(res.average, 16);
});

test("getCouncilDecision attribue les mentions et distinctions officielles du lycée", () => {
  const tb = getCouncilDecision(16.5);
  assert.equal(tb.mention, "Très Bien");
  assert.equal(tb.honorRoll, true);
  assert.match(tb.distinction, /Félicitations/);

  const passable = getCouncilDecision(10.5);
  assert.equal(passable.mention, "Passable");
  assert.equal(passable.honorRoll, false);

  const insuffisant = getCouncilDecision(8.5);
  assert.equal(insuffisant.mention, "Insuffisant");
  assert.match(insuffisant.distinction, /Avertissement/);
});

test("computeStudentTrimesterReport applique les coefficients officiels de la Série D (Total Coef = 22)", () => {
  const student = { id: "STD-TEST", series: "D", gender: "F" };
  const grades = [
    { subjectCode: "SVT", interro: 16, devoir: 16, compo: 16 }, // Coef 4 -> 64
    { subjectCode: "MAT", interro: 15, devoir: 15, compo: 15 }, // Coef 4 -> 60
    { subjectCode: "PCT", interro: 14, devoir: 14, compo: 14 }  // Coef 3 -> 42
  ];
  const report = computeStudentTrimesterReport(student, grades);
  assert.equal(report.totalCoefficient, 22);
  assert.ok(report.generalAverage > 11 && report.generalAverage < 15);
});

test("computeClassRanking classe les élèves par ordre décroissant et gère les rangs (1ère, 2ème)", () => {
  const students = [
    { id: "S1", firstName: "Afi", lastName: "KOFFI", gender: "F", series: "D" },
    { id: "S2", firstName: "Yao", lastName: "MENSAH", gender: "M", series: "D" }
  ];
  const grades = [
    { studentId: "S1", subjectCode: "SVT", interro: 18, devoir: 18, compo: 18 },
    { studentId: "S2", subjectCode: "SVT", interro: 12, devoir: 12, compo: 12 }
  ];

  const ranking = computeClassRanking(students, grades);
  assert.equal(ranking[0].student.id, "S1");
  assert.equal(ranking[0].rankLabel, "1ère");
  assert.equal(ranking[1].student.id, "S2");
  assert.equal(ranking[1].rankLabel, "2ème");
});
