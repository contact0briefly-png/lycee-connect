/**
 * LycéeConnect — Application Frontend Principale
 * Connectée à l'API REST (/api/*)
 */

const state = {
  trimester: 1,
  students: [],
  classes: [],
  teachers: [],
  selectedStudentId: "STD-001",
  activeTab: "dashboard"
};

function formatFCFA(amount) {
  return Number(amount || 0).toLocaleString("fr-FR") + " FCFA";
}

function showToast(message) {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3500);
}

function getMentionBadge(mention) {
  const map = {
    "Très Bien": "badge-emerald",
    "Bien": "badge-blue",
    "Assez Bien": "badge-indigo",
    "Passable": "badge-amber",
    "Insuffisant": "badge-orange",
    "Très Insuffisant": "badge-red"
  };
  const cls = map[mention] || "badge-slate";
  return `<span class="badge ${cls}">${mention}</span>`;
}

async function apiGet(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
  return res.json();
}

async function apiPost(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur lors de l'opération");
  return data;
}

/* Navigation par onglets */
function switchTab(tabName) {
  state.activeTab = tabName;
  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `tab-${tabName}`);
  });

  const titles = {
    dashboard: [
      "Tableau de Bord de Direction",
      "Suivi académique (Séries A4, C4, D), délibérations et gestion financière en FCFA"
    ],
    students: [
      "Gestion des Élèves & Inscriptions",
      "Effectifs par série (Seconde, Première BAC I, Terminale BAC II) et dossiers parents"
    ],
    grades: [
      "Saisie des Notes (/20) & Coefficients",
      "Calcul automatique des moyennes de classe, compositions et points coefficientés"
    ],
    bulletins: [
      "Bulletins Scolaires Trimestriels Officiels",
      "Édition, classement par rang, décision du Conseil de Classe et impression A4"
    ],
    tuition: [
      "Écolage & Comptabilité Scolaire (FCFA)",
      "Suivi des tranches de scolarité et émission de reçus (TMoney, Flooz, Banque, Guichet)"
    ],
    schoollife: [
      "Vie Scolaire, Enseignants & Emploi du Temps",
      "Assiduité, répertoire des professeurs certifiés/agrégés et horaires hebdomadaires"
    ]
  };

  if (titles[tabName]) {
    document.getElementById("pageTitle").textContent = titles[tabName][0];
    document.getElementById("pageSubtitle").textContent = titles[tabName][1];
  }
}

/* Chargement du Tableau de Bord */
async function loadDashboard() {
  const data = await apiGet(`/api/dashboard?trimester=${state.trimester}`);
  const k = data.kpis;

  document.getElementById("sidebarSchoolName").textContent = data.school.name;
  document.getElementById("sidebarSchoolYear").textContent = data.school.academicYear;

  const kpiHtml = `
    <div class="kpi-card">
      <span class="kpi-label">Effectif Total Lycée</span>
      <span class="kpi-value">${k.totalStudents} Élèves</span>
      <span class="kpi-sub">👩 ${k.girlsCount} Filles • 👦 ${k.boysCount} Garçons (${k.totalClasses} classes)</span>
    </div>
    <div class="kpi-card">
      <span class="kpi-label">Moyenne Générale (${state.trimester}e Trim.)</span>
      <span class="kpi-value" style="color: var(--primary);">${k.schoolAverage.toFixed(2)} / 20</span>
      <span class="kpi-sub">Taux de réussite (≥ 10/20) : <strong>${k.passRate}%</strong></span>
    </div>
    <div class="kpi-card">
      <span class="kpi-label">Tableau d'Honneur (≥ 12/20)</span>
      <span class="kpi-value" style="color: var(--blue);">${k.honorRollCount} Élèves</span>
      <span class="kpi-sub">${k.passCount} élèves admis sur ${k.totalStudents}</span>
    </div>
    <div class="kpi-card">
      <span class="kpi-label">Recouvrement Écolage</span>
      <span class="kpi-value" style="color: var(--emerald);">${formatFCFA(k.totalTuitionCollected)}</span>
      <span class="kpi-sub">Taux : <strong>${k.tuitionRecoveryRate}%</strong> (Reste : ${formatFCFA(k.totalTuitionRemaining)})</span>
    </div>
  `;
  document.getElementById("dashboardKpis").innerHTML = kpiHtml;

  const classBody = document.querySelector("#classPerformanceTable tbody");
  classBody.innerHTML = data.classPerformance
    .map(
      (c) => `
      <tr>
        <td><strong>${c.name}</strong><br><small class="text-muted">${c.examTarget}</small></td>
        <td><span class="badge badge-slate">Série ${c.series}</span></td>
        <td>${c.effectif} / ${c.capacity}</td>
        <td><strong>${c.classAverage.toFixed(2)} / 20</strong></td>
        <td><span class="badge ${c.passRate >= 75 ? "badge-emerald" : "badge-amber"}">${c.passRate}%</span></td>
        <td>${c.topStudent}</td>
      </tr>
    `
    )
    .join("");

  const topBody = document.querySelector("#topStudentsTable tbody");
  topBody.innerHTML = data.topStudents
    .map(
      (s) => `
      <tr>
        <td><strong>#${s.rank}</strong></td>
        <td><strong>${s.name}</strong><br><small class="text-muted">${s.matricule}</small></td>
        <td><span class="badge badge-slate">${s.classId}</span></td>
        <td><strong style="color: var(--primary);">${s.generalAverage.toFixed(2)} / 20</strong></td>
        <td>${getMentionBadge(s.mention)}</td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="openStudentBulletin('${s.id}')">
            📄 Bulletin
          </button>
        </td>
      </tr>
    `
    )
    .join("");
}

/* Chargement de la liste des élèves */
async function loadStudents() {
  const search = document.getElementById("studentSearchInput").value.trim();
  const classId = document.getElementById("studentClassFilter").value;
  const series = document.getElementById("studentSeriesFilter").value;

  const params = new URLSearchParams({ trimester: state.trimester });
  if (search) params.set("search", search);
  if (classId) params.set("classId", classId);
  if (series) params.set("series", series);

  const students = await apiGet(`/api/students?${params.toString()}`);
  const allStudents = await apiGet(`/api/students?trimester=${state.trimester}`);
  state.students = allStudents;

  populateStudentSelectors(allStudents);

  const tbody = document.querySelector("#studentsTable tbody");
  tbody.innerHTML = students
    .map(
      (s) => `
      <tr>
        <td><code>${s.matricule}</code></td>
        <td>
          <strong>${s.lastName} ${s.firstName}</strong><br>
          <small class="text-muted">Né(e) le ${s.birthDate} à ${s.birthPlace} • ${s.neighborhood}</small>
        </td>
        <td>${s.gender}</td>
        <td>
          <strong>${s.classId}</strong>
          <span class="badge badge-slate">Série ${s.series}</span>
        </td>
        <td><strong>${s.generalAverage.toFixed(2)} / 20</strong> ${getMentionBadge(s.mention)}</td>
        <td><strong>${s.rankLabel}</strong></td>
        <td>
          <span class="badge ${s.tuitionStatus === "Soldé" ? "badge-emerald" : s.tuitionStatus === "En cours" ? "badge-amber" : "badge-red"}">
            ${s.tuitionStatus}
          </span><br>
          <small class="text-muted">${formatFCFA(s.tuitionPaid)} / ${formatFCFA(s.tuitionDue)}</small>
        </td>
        <td>
          ${s.guardianName}<br>
          <small class="text-muted">${s.guardianPhone}</small>
        </td>
        <td>
          <div style="display:flex; gap:0.35rem;">
            <button class="btn btn-outline btn-sm" onclick="openStudentGrades('${s.id}')">📝 Notes</button>
            <button class="btn btn-primary btn-sm" onclick="openStudentBulletin('${s.id}')">📄 Bulletin</button>
          </div>
        </td>
      </tr>
    `
    )
    .join("");
}

function populateStudentSelectors(students) {
  const ids = [
    "gradesStudentSelect",
    "bulletinStudentSelect",
    "tuitionStudentSelect",
    "attendanceStudentSelect"
  ];
  ids.forEach((selId) => {
    const el = document.getElementById(selId);
    if (!el) return;
    const currentVal = el.value || state.selectedStudentId;
    el.innerHTML = students
      .map(
        (s) =>
          `<option value="${s.id}" ${s.id === currentVal ? "selected" : ""}>${s.lastName} ${s.firstName} (${s.classId} - ${s.matricule})</option>`
      )
      .join("");
  });
}

/* Chargement de l'éditeur de notes (/20) */
async function loadGradesEditor() {
  const select = document.getElementById("gradesStudentSelect");
  const studentId = select.value || state.selectedStudentId;
  state.selectedStudentId = studentId;

  const data = await apiGet(`/api/grades?studentId=${studentId}&trimester=${state.trimester}`);
  const { student, report } = data;

  document.getElementById("gradesSummaryBanner").innerHTML = `
    <div>
      <strong>Élève :</strong> ${student.lastName} ${student.firstName} (<code>${student.matricule}</code>) •
      <strong>Classe :</strong> ${student.classId} (Série ${student.series})
    </div>
    <div>
      <strong>Total Coefficients :</strong> ${report.totalCoefficient} •
      <strong>Total Points :</strong> ${report.totalWeightedPoints.toFixed(2)} pts •
      <strong>Moyenne Générale :</strong> <span style="font-size:1.15rem; color:var(--primary); font-weight:800;">${report.generalAverage.toFixed(2)} / 20</span>
      ${getMentionBadge(report.mention)}
    </div>
  `;

  const tbody = document.querySelector("#gradesEditorTable tbody");
  tbody.innerHTML = report.subjects
    .map(
      (sub) => `
      <tr>
        <td><strong>${sub.subjectName}</strong></td>
        <td><span class="badge badge-slate">${sub.category}</span></td>
        <td><strong>× ${sub.coefficient}</strong></td>
        <td>
          <input type="number" class="grade-input" id="interro-${sub.subjectCode}" min="0" max="20" step="0.25" value="${sub.interro}" />
        </td>
        <td>
          <input type="number" class="grade-input" id="devoir-${sub.subjectCode}" min="0" max="20" step="0.25" value="${sub.devoir}" />
        </td>
        <td><strong>${sub.classAverage.toFixed(2)}</strong></td>
        <td>
          <input type="number" class="grade-input" id="compo-${sub.subjectCode}" min="0" max="20" step="0.25" value="${sub.compo}" />
        </td>
        <td><strong style="color: var(--primary);">${sub.average.toFixed(2)} / 20</strong></td>
        <td><strong>${sub.weightedPoints.toFixed(2)}</strong></td>
        <td>${sub.appreciation}</td>
        <td>
          <button class="btn btn-primary btn-sm" onclick="saveSubjectGrade('${student.id}', '${sub.subjectCode}')">
            💾 Enregistrer
          </button>
        </td>
      </tr>
    `
    )
    .join("");
}

window.saveSubjectGrade = async function (studentId, subjectCode) {
  const interro = document.getElementById(`interro-${subjectCode}`).value;
  const devoir = document.getElementById(`devoir-${subjectCode}`).value;
  const compo = document.getElementById(`compo-${subjectCode}`).value;

  await apiPost("/api/grades", {
    studentId,
    trimester: state.trimester,
    subjectCode,
    interro,
    devoir,
    compo
  });

  showToast(`Notes de ${subjectCode} mises à jour et moyenne recalculée !`);
  await loadGradesEditor();
  await loadDashboard();
  await loadBulletin();
};

/* Chargement du Bulletin Scolaire Officiel */
async function loadBulletin() {
  const select = document.getElementById("bulletinStudentSelect");
  const studentId = select.value || state.selectedStudentId;
  state.selectedStudentId = studentId;

  const b = await apiGet(`/api/bulletins/${studentId}?trimester=${state.trimester}`);
  const { school, trimester, classInfo, student, academic, attendance } = b;
  const stats = academic.classStats;

  const rowsHtml = academic.subjects
    .map(
      (sub) => `
      <tr>
        <td><strong>${sub.subjectName}</strong></td>
        <td style="text-align:center;"><strong>${sub.coefficient}</strong></td>
        <td style="text-align:center;">${sub.interro.toFixed(2)}</td>
        <td style="text-align:center;">${sub.devoir.toFixed(2)}</td>
        <td style="text-align:center;">${sub.classAverage.toFixed(2)}</td>
        <td style="text-align:center;">${sub.compo.toFixed(2)}</td>
        <td style="text-align:center; font-weight:700;">${sub.average.toFixed(2)}</td>
        <td style="text-align:center; font-weight:700;">${sub.weightedPoints.toFixed(2)}</td>
        <td>${sub.appreciation}</td>
        <td><small>${sub.teacherName}</small></td>
      </tr>
    `
    )
    .join("");

  document.getElementById("bulletinSheet").innerHTML = `
    <div class="bulletin-header">
      <div class="bulletin-header-col">
        <strong>${school.ministry}</strong><br />
        ${school.inspection}<br />
        <strong>${school.name}</strong><br />
        <em>« ${school.motto} »</em><br />
        Tél : ${school.phone}
      </div>

      <div class="bulletin-header-center">
        <div class="flag-bar" style="width: 140px; margin: 0 auto 0.4rem auto;">
          <span class="flag-green"></span>
          <span class="flag-yellow"></span>
          <span class="flag-red"></span>
        </div>
        <div class="bulletin-title-box">
          <strong>BULLETIN TRIMESTRIEL DE NOTES</strong><br />
          <small>${trimester.name} (${trimester.period})</small>
        </div>
      </div>

      <div class="bulletin-header-col" style="text-align:right;">
        <strong>${school.country.toUpperCase()}</strong><br />
        <em>${school.countryMotto}</em><br /><br />
        <strong>Année Scolaire : ${school.academicYear}</strong>
      </div>
    </div>

    <div class="bulletin-student-box">
      <div>
        <strong>Nom & Prénoms :</strong> ${student.lastName} ${student.firstName}<br />
        <strong>Matricule :</strong> <code>${student.matricule}</code><br />
        <strong>Sexe :</strong> ${student.gender === "F" ? "Féminin" : "Masculin"} (${student.status})
      </div>
      <div>
        <strong>Date & Lieu de naissance :</strong> ${student.birthDate} à ${student.birthPlace}<br />
        <strong>Parent / Tuteur :</strong> ${student.guardianName} (${student.guardianPhone})
      </div>
      <div>
        <strong>Classe :</strong> ${classInfo ? classInfo.name : student.classId} (Série ${student.series})<br />
        <strong>Effectif de la classe :</strong> ${stats.effectif} élèves<br />
        <strong>Professeur Titulaire :</strong> ${classInfo ? classInfo.mainTeacher : "—"}
      </div>
    </div>

    <table class="bulletin-table">
      <thead>
        <tr>
          <th style="text-align:left;">Matières</th>
          <th>Coef</th>
          <th>Interro /20</th>
          <th>Devoir /20</th>
          <th>Moy. Classe</th>
          <th>Compo /20</th>
          <th>Moyenne /20</th>
          <th>Points (M×C)</th>
          <th>Appréciations</th>
          <th>Professeurs</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
      <tfoot>
        <tr style="background:#f1f5f9; font-weight:800;">
          <td>TOTAUX DU TRIMESTRE</td>
          <td style="text-align:center;">${academic.totalCoefficient}</td>
          <td colspan="5" style="text-align:right;">Total des Points Coefficientés :</td>
          <td style="text-align:center;">${academic.totalWeightedPoints.toFixed(2)}</td>
          <td colspan="2">Moyenne : ${academic.generalAverage.toFixed(2)} / 20</td>
        </tr>
      </tfoot>
    </table>

    <div class="bulletin-footer-grid">
      <div class="bulletin-box">
        <h4>Résultats & Classement de l'Élève</h4>
        <p><strong>Moyenne Générale :</strong> <span style="font-size:1.15rem; font-weight:800; color:var(--primary);">${academic.generalAverage.toFixed(2)} / 20</span></p>
        <p><strong>Rang dans la classe :</strong> <strong>${academic.rankLabel}</strong> sur ${stats.effectif} élèves</p>
        <p><strong>Mention :</strong> ${academic.mention}</p>
        <p><strong>Distinction :</strong> <strong>${academic.distinction}</strong></p>
      </div>

      <div class="bulletin-box">
        <h4>Profil de la Classe & Assiduité</h4>
        <p><strong>Moyenne de la classe :</strong> ${stats.classAverage.toFixed(2)} / 20</p>
        <p><strong>Plus forte moyenne :</strong> ${stats.highestAverage.toFixed(2)} / 20</p>
        <p><strong>Plus faible moyenne :</strong> ${stats.lowestAverage.toFixed(2)} / 20</p>
        <p><strong>Absences :</strong> ${attendance.totalAbsenceHours}h (dont ${attendance.unjustifiedHours}h non justifiées) • <strong>Retards :</strong> ${attendance.delaysCount}</p>
      </div>

      <div class="bulletin-box">
        <h4>Décision du Conseil de Classe & Visa</h4>
        <p style="font-style:italic; margin-bottom:0.8rem;">« ${academic.councilComment} »</p>
        <div style="display:flex; justify-content:space-between; margin-top:1.2rem; font-size:0.78rem;">
          <div><strong>Le Professeur Titulaire</strong><br /><br /><em>Signé</em></div>
          <div style="text-align:right;"><strong>Fait à Lomé, le ${b.generatedAt}</strong><br /><strong>Le Proviseur</strong><br /><em>Cachet & Signature</em></div>
        </div>
      </div>
    </div>
  `;
}

/* Chargement de l'Écolage (FCFA) */
async function loadTuition() {
  const data = await apiGet("/api/tuition");

  const summariesBody = document.querySelector("#tuitionSummariesTable tbody");
  summariesBody.innerHTML = data.summaries
    .map(
      (s) => `
      <tr>
        <td><strong>${s.studentName}</strong><br><small class="text-muted">${s.matricule}</small></td>
        <td><span class="badge badge-slate">${s.classId}</span></td>
        <td>${formatFCFA(s.totalDue)}</td>
        <td><strong style="color: var(--emerald);">${formatFCFA(s.totalPaid)}</strong></td>
        <td><strong style="color: ${s.balance > 0 ? "var(--red)" : "var(--text-muted)"};">${formatFCFA(s.balance)}</strong></td>
        <td style="min-width:120px;">
          <div class="progress-track">
            <div class="progress-fill" style="width:${s.progressPercent}%;"></div>
          </div>
          <small class="text-muted">${s.progressPercent}% réglé</small>
        </td>
        <td>
          <span class="badge ${s.status === "Soldé" ? "badge-emerald" : s.status === "En cours" ? "badge-amber" : "badge-red"}">
            ${s.status}
          </span>
        </td>
      </tr>
    `
    )
    .join("");

  const paymentsBody = document.querySelector("#tuitionPaymentsTable tbody");
  paymentsBody.innerHTML = data.payments
    .map(
      (p) => `
      <tr>
        <td><code>${p.receiptNumber}</code></td>
        <td>${p.date}</td>
        <td><strong>${p.studentName}</strong> (${p.matricule})</td>
        <td><span class="badge badge-slate">${p.classId}</span></td>
        <td>${p.tranche}</td>
        <td>${p.method}</td>
        <td><strong style="color: var(--emerald);">${formatFCFA(p.amount)}</strong></td>
      </tr>
    `
    )
    .join("");
}

/* Chargement de la Vie Scolaire, Enseignants & Emploi du Temps */
async function loadSchoolLife() {
  const [attendance, teachers, timetable] = await Promise.all([
    apiGet("/api/attendance"),
    apiGet("/api/teachers"),
    apiGet("/api/timetable")
  ]);

  document.querySelector("#attendanceTable tbody").innerHTML = attendance
    .map(
      (a) => `
      <tr>
        <td>${a.date}</td>
        <td><strong>${a.studentName}</strong></td>
        <td><span class="badge badge-slate">${a.classId}</span></td>
        <td><span class="badge ${a.type === "Absence" ? "badge-orange" : "badge-amber"}">${a.type}</span></td>
        <td>${a.durationHours}h</td>
        <td>${a.reason}</td>
        <td>
          <span class="badge ${a.justified ? "badge-emerald" : "badge-red"}">
            ${a.justified ? "Justifiée" : "Non justifiée"}
          </span>
        </td>
      </tr>
    `
    )
    .join("");

  document.querySelector("#teachersTable tbody").innerHTML = teachers
    .map(
      (t) => `
      <tr>
        <td><strong>${t.name}</strong></td>
        <td><span class="badge badge-indigo">${t.subjectName}</span></td>
        <td>${t.grade}</td>
        <td>${t.classes.join(", ")}</td>
        <td><small>${t.phone}</small></td>
      </tr>
    `
    )
    .join("");

  document.querySelector("#timetableTable tbody").innerHTML = timetable
    .map(
      (row) => `
      <tr>
        <td><strong>${row.day}</strong></td>
        <td><code>${row.slot}</code></td>
        <td>${row.TLE_D}</td>
        <td>${row.TLE_A4}</td>
        <td>${row.TLE_C4}</td>
      </tr>
    `
    )
    .join("");
}

/* Fonctions d'accès rapide depuis les tableaux */
window.openStudentBulletin = async function (studentId) {
  state.selectedStudentId = studentId;
  const sel = document.getElementById("bulletinStudentSelect");
  if (sel) sel.value = studentId;
  switchTab("bulletins");
  await loadBulletin();
};

window.openStudentGrades = async function (studentId) {
  state.selectedStudentId = studentId;
  const sel = document.getElementById("gradesStudentSelect");
  if (sel) sel.value = studentId;
  switchTab("grades");
  await loadGradesEditor();
};

/* Initialisation globale */
async function initApp() {
  const classes = await apiGet("/api/classes");
  state.classes = classes;
  const classFilter = document.getElementById("studentClassFilter");
  classFilter.innerHTML =
    `<option value="">Toutes les classes</option>` +
    classes.map((c) => `<option value="${c.id}">${c.name} (Série ${c.series})</option>`).join("");

  await loadStudents();
  await Promise.all([loadDashboard(), loadGradesEditor(), loadBulletin(), loadTuition(), loadSchoolLife()]);

  // Événements de navigation
  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  // Changement de trimestre
  document.getElementById("globalTrimesterSelect").addEventListener("change", async (e) => {
    state.trimester = Number(e.target.value);
    await Promise.all([loadDashboard(), loadStudents(), loadGradesEditor(), loadBulletin()]);
    showToast(`Affichage basculé sur le ${state.trimester === 1 ? "1er" : "2ème"} Trimestre`);
  });

  // Filtres élèves
  ["studentSearchInput", "studentClassFilter", "studentSeriesFilter"].forEach((id) => {
    document.getElementById(id).addEventListener("input", () => loadStudents());
    document.getElementById(id).addEventListener("change", () => loadStudents());
  });

  // Changement d'élève dans Notes & Bulletins
  document.getElementById("gradesStudentSelect").addEventListener("change", () => loadGradesEditor());
  document.getElementById("bulletinStudentSelect").addEventListener("change", () => loadBulletin());

  // Impression du bulletin
  document.getElementById("btnPrintBulletin").addEventListener("click", () => {
    window.print();
  });

  // Formulaire de paiement d'écolage
  document.getElementById("tuitionPaymentForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const studentId = document.getElementById("tuitionStudentSelect").value;
    const amount = document.getElementById("tuitionAmountInput").value;
    const method = document.getElementById("tuitionMethodSelect").value;
    const tranche = document.getElementById("tuitionTrancheSelect").value;

    const result = await apiPost("/api/tuition", { studentId, amount, method, tranche });
    showToast(`Reçu ${result.payment.receiptNumber} émis (${formatFCFA(amount)}) !`);
    await Promise.all([loadTuition(), loadDashboard(), loadStudents()]);
  });

  // Formulaire d'assiduité
  document.getElementById("attendanceForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const studentId = document.getElementById("attendanceStudentSelect").value;
    const type = document.getElementById("attendanceTypeSelect").value;
    const durationHours = document.getElementById("attendanceHoursInput").value;
    const reason = document.getElementById("attendanceReasonInput").value;
    const justified = document.getElementById("attendanceJustifiedInput").checked;

    await apiPost("/api/attendance", { studentId, type, durationHours, reason, justified });
    document.getElementById("attendanceReasonInput").value = "";
    showToast(`${type} enregistrée dans le registre de vie scolaire.`);
    await Promise.all([loadSchoolLife(), loadBulletin()]);
  });

  // Modale d'inscription d'élève
  const modal = document.getElementById("newStudentModal");
  document.getElementById("btnOpenNewStudentModal").addEventListener("click", () => {
    modal.classList.remove("hidden");
  });
  document.getElementById("btnCloseNewStudentModal").addEventListener("click", () => {
    modal.classList.add("hidden");
  });
  document.getElementById("btnCancelNewStudent").addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  document.getElementById("newStudentForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      lastName: document.getElementById("nsLastName").value,
      firstName: document.getElementById("nsFirstName").value,
      gender: document.getElementById("nsGender").value,
      birthDate: document.getElementById("nsBirthDate").value,
      birthPlace: document.getElementById("nsBirthPlace").value,
      classId: document.getElementById("nsClassId").value,
      neighborhood: document.getElementById("nsNeighborhood").value,
      guardianName: document.getElementById("nsGuardianName").value,
      guardianPhone: document.getElementById("nsGuardianPhone").value,
      initialDeposit: document.getElementById("nsInitialDeposit").value
    };

    const created = await apiPost("/api/students", payload);
    modal.classList.add("hidden");
    e.target.reset();
    showToast(`Élève ${created.lastName} ${created.firstName} (${created.matricule}) inscrit avec succès !`);
    state.selectedStudentId = created.id;
    await Promise.all([loadStudents(), loadDashboard(), loadGradesEditor(), loadBulletin(), loadTuition()]);
  });

  // Réinitialisation des données de démo
  document.getElementById("btnResetDemo").addEventListener("click", async () => {
    await apiPost("/api/reset", {});
    showToast("Base de données de démonstration réinitialisée !");
    await Promise.all([loadStudents(), loadDashboard(), loadGradesEditor(), loadBulletin(), loadTuition(), loadSchoolLife()]);
  });
}

document.addEventListener("DOMContentLoaded", initApp);
