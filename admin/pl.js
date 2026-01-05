const API = "https://matka-backend-4fy1.onrender.com";

/* ===============================
   DOM READY
================================ */
document.addEventListener("DOMContentLoaded", () => {
  loadTopSummary();
  loadSubAdminSummary();
  loadSubAdminTable();
  loadBreakdown();

  const applyBtn = document.getElementById("applyDate");
  if (applyBtn) {
    applyBtn.addEventListener("click", () => {
      const qp = selectedDate();
      console.log("APPLY DATE:", qp || "NO DATE");

      loadTopSummary();
      loadBreakdown();
    });
  }
});

/* ===============================
   AUTH HEADER
================================ */
function authHeader() {
  const token = localStorage.getItem("adminToken");
  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  };
}

/* ===============================
   DATE HANDLER (HTML ✔)
================================ */
function selectedDate() {
  const input = document.getElementById("plDate"); // ✅ FIXED ID
  if (!input || !input.value) return "";

  // input[type=date] → YYYY-MM-DD
  return `?date=${input.value}`;
}

/* =====================================
   1. TOP SUMMARY
===================================== */
async function loadTopSummary() {
  try {
    const res = await fetch(
      `${API}/admin/pl/summary${selectedDate()}`,
      { headers: authHeader(), cache: "no-store" }
    );

    const data = await res.json();

    document.querySelector(".stats .card.profit h2").innerText =
      `₹ ${fmt(data.totalProfit)}`;

    document.querySelector(".stats .card.loss h2").innerText =
      `₹ ${fmt(data.totalLoss)}`;

    document.querySelector(".stats .card.neutral h2").innerText =
      `₹ ${fmt(data.netPL)}`;

    document.querySelector(".stats .card.neutral span").innerText =
      "LIVE BETTING P/L";

  } catch (e) {
    console.error("TOP SUMMARY ERROR:", e);
  }
}

/* =====================================
   2. SUBADMIN SUMMARY
===================================== */
async function loadSubAdminSummary() {
  try {
    const res = await fetch(`${API}/admin/subadmin-stats`, {
      headers: authHeader(),
      cache: "no-store"
    });

    const data = await res.json();
    const subs = data.subAdmins || [];

    document.querySelector(
      ".subadmin-summary .card.profit h2"
    ).innerText = subs.length;

    let total = 0;
    subs.forEach(s => total += s.balance || 0);

    document.querySelector(
      ".subadmin-summary .card.neutral h2"
    ).innerText = `₹ ${fmt(total)}`;

    if (!subs.length) return;

    const worst = subs.reduce((a, b) => a.balance < b.balance ? a : b);
    const best  = subs.reduce((a, b) => a.balance > b.balance ? a : b);

    document.querySelector(
      ".subadmin-summary .card.loss h2"
    ).innerText = `₹ ${fmt(worst.balance)}`;

    document.querySelector(
      ".subadmin-summary .card.loss span"
    ).innerText = `SubAdmin • ${worst.username}`;

    document.querySelector(
      ".subadmin-summary .card.profit:last-child h2"
    ).innerText = `₹ ${fmt(best.balance)}`;

    document.querySelector(
      ".subadmin-summary .card.profit:last-child span"
    ).innerText = `SubAdmin • ${best.username}`;

  } catch (e) {
    console.error("SUBADMIN SUMMARY ERROR:", e);
  }
}

/* =====================================
   3. SUBADMIN TABLE
===================================== */
async function loadSubAdminTable() {
  try {
    const res = await fetch(`${API}/admin/subadmins`, {
      headers: authHeader(),
      cache: "no-store"
    });

    const subs = await res.json();
    const table = document.querySelector(".subadmin-section table");

    table.querySelectorAll("tr:not(:first-child)").forEach(r => r.remove());

    subs.forEach(sa => {
      const risk =
        sa.balance < -5000 ? "HIGH" :
        sa.balance < 0 ? "MEDIUM" : "LOW";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${sa.username}</td>
        <td>—</td>
        <td>—</td>
        <td class="${sa.balance >= 0 ? "profit" : "loss"}">
          ₹ ${fmt(sa.balance)}
        </td>
        <td class="${risk.toLowerCase()}">${risk}</td>
      `;
      table.appendChild(tr);
    });

  } catch (e) {
    console.error("SUBADMIN TABLE ERROR:", e);
  }
}

/* =====================================
   4. BREAKDOWN
===================================== */
async function loadBreakdown() {
  try {
    const res = await fetch(
      `${API}/admin/pl/breakdown${selectedDate()}`,
      { headers: authHeader(), cache: "no-store" }
    );

    const data = await res.json();

    /* MARKET */
    const marketTable =
      document.querySelector(".tables .table-card:first-child table");
    marketTable.querySelectorAll("tr:not(:first-child)").forEach(r => r.remove());

    Object.entries(data.markets || {}).forEach(([name, m]) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${name}</td>
        <td>₹ ${fmt(m.bet)}</td>
        <td>₹ ${fmt(m.win)}</td>
        <td class="${m.pl >= 0 ? "profit" : "loss"}">
          ₹ ${fmt(m.pl)}
        </td>
      `;
      marketTable.appendChild(tr);
    });

    /* GAME */
    const gameTable =
      document.querySelector(".tables .table-card:nth-child(2) table");
    gameTable.querySelectorAll("tr:not(:first-child)").forEach(r => r.remove());

    Object.entries(data.games || {}).forEach(([g, v]) => {
      const risk =
        v.bet > 5000 ? "HIGH" :
        v.bet > 2000 ? "MEDIUM" : "LOW";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${g}</td>
        <td>₹ ${fmt(v.bet)}</td>
        <td class="${risk.toLowerCase()}">${risk}</td>
      `;
      gameTable.appendChild(tr);
    });

    /* NUMBERS */
    const numTable =
      document.querySelector(".table-card.danger table");
    numTable.querySelectorAll("tr:not(:first-child)").forEach(r => r.remove());

    Object.values(data.numbers || {})
      .sort((a, b) => b.bet - a.bet)
      .slice(0, 5)
      .forEach(n => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${n.number}</td>
          <td>${n.game}</td>
          <td>₹ ${fmt(n.bet)}</td>
        `;
        numTable.appendChild(tr);
      });

  } catch (e) {
    console.error("BREAKDOWN ERROR:", e);
  }
}

/* ===============================
   UTILS
================================ */
function fmt(n) {
  return Number(n || 0).toLocaleString("en-IN");
}
