const API = "https://matka-backend-4fy1.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  loadTopSummary();        // REAL BETTING P&L
  loadSubAdminSummary();  // SETTLEMENT VIEW
  loadSubAdminTable();
  loadBreakdown();
});

/* ---------------- AUTH HEADER ---------------- */
function authHeader() {
  const token = localStorage.getItem("adminToken");
  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  };
}

/* =====================================
   1. TOP SUMMARY (REAL BETTING P&L)
===================================== */
async function loadTopSummary() {
  try {
    const res = await fetch(`${API}/admin/pl/summary`, {
      headers: authHeader()
    });

    if (!res.ok) throw new Error("Top summary failed");

    const data = await res.json();

    document.querySelector(".stats .card.profit h2").innerText =
      `₹ ${fmt(data.totalProfit)}`;

    document.querySelector(".stats .card.loss h2").innerText =
      `₹ ${fmt(data.totalLoss)}`;

    document.querySelector(".stats .card.neutral h2").innerText =
      `₹ ${fmt(data.netPL)}`;

    document.querySelector(".stats .card.neutral span").innerText =
      "LIVE BETTING P/L";

  } catch (err) {
    console.error("TOP SUMMARY ERROR:", err);
  }
}

/* =====================================
   2. SUBADMIN SUMMARY (SETTLEMENT)
===================================== */
async function loadSubAdminSummary() {
  try {
    const res = await fetch(`${API}/admin/subadmin-stats`, {
      headers: authHeader()
    });

    const data = await res.json();
    const subs = data.subAdmins || [];

    let total = 0;
    subs.forEach(sa => total += sa.balance || 0);

    document.querySelector(
      ".subadmin-summary .card.profit h2"
    ).innerText = subs.length;

    document.querySelector(
      ".subadmin-summary .card.neutral h2"
    ).innerText = `₹ ${fmt(total)}`;

    const worst = subs.reduce((a, b) => a.balance < b.balance ? a : b, subs[0]);
    const best  = subs.reduce((a, b) => a.balance > b.balance ? a : b, subs[0]);

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

  } catch (err) {
    console.error("SUBADMIN SUMMARY ERROR:", err);
  }
}

/* =====================================
   3. SUBADMIN TABLE (SETTLEMENT)
===================================== */
async function loadSubAdminTable() {
  try {
    const res = await fetch(`${API}/admin/subadmins`, {
      headers: authHeader()
    });

    const subs = await res.json();
    const table = document.querySelector(
      ".subadmin-section .table-card table"
    );

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

  } catch (err) {
    console.error("SUBADMIN TABLE ERROR:", err);
  }
}

async function loadBreakdown() {
  try {
    const res = await fetch(`${API}/admin/pl/breakdown`, {
      headers: authHeader()
    });
    if (!res.ok) throw new Error("Breakdown API failed");

    const data = await res.json();

    /* ---------- MARKET TABLE ---------- */
    const marketTable = document.querySelector(
      ".tables .table-card:first-child table"
    );
    marketTable.querySelectorAll("tr:not(:first-child)").forEach(r => r.remove());

    Object.entries(data.markets).forEach(([name, m]) => {
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

    /* ---------- GAME TABLE ---------- */
    const gameTable = document.querySelector(
      ".tables .table-card:nth-child(2) table"
    );
    gameTable.querySelectorAll("tr:not(:first-child)").forEach(r => r.remove());

    Object.entries(data.games).forEach(([game, g]) => {
      const exposure =
        g.bet > 5000 ? "HIGH" :
        g.bet > 2000 ? "MEDIUM" : "LOW";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${game}</td>
        <td>₹ ${fmt(g.bet)}</td>
        <td class="${exposure.toLowerCase()}">${exposure}</td>
      `;
      gameTable.appendChild(tr);
    });

    /* ---------- HIGH RISK NUMBERS ---------- */
    const numTable = document.querySelector(
      ".table-card.danger table"
    );
    numTable.querySelectorAll("tr:not(:first-child)").forEach(r => r.remove());

    Object.values(data.numbers)
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

  } catch (err) {
    console.error("BREAKDOWN LOAD ERROR:", err);
  }
}

/* ---------------- UTILS ---------------- */
function fmt(n) {
  return Number(n || 0).toLocaleString("en-IN");
}
