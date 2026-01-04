/* =====================================
   SUPER D – SUPERADMIN P&L DASHBOARD
   pl.js (MATCHED WITH server.js)
===================================== */

document.addEventListener("DOMContentLoaded", () => {
  loadSubAdminSummary();
  loadSubAdminTable();
});

/* -------------------------------------
   AUTH HEADER (ADMIN JWT)
------------------------------------- */
function authHeader() {
  const token = localStorage.getItem("adminToken");
  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  };
}

/* -------------------------------------
   1. TOP SUMMARY CARDS
------------------------------------- */
async function loadSubAdminSummary() {
  try {
    const res = await fetch("/admin/subadmin-stats", {
      headers: authHeader()
    });

    const data = await res.json();
    const subs = data.subAdmins || [];

    let totalProfit = 0;
    let totalLoss = 0;

    subs.forEach(s => {
      if (s.balance >= 0) totalProfit += s.balance;
      else totalLoss += Math.abs(s.balance);
    });

    const netPL = totalProfit - totalLoss;

    // Top cards
    document.querySelector(".card.profit h2").innerText =
      `₹ ${fmt(totalProfit)}`;

    document.querySelector(".card.loss h2").innerText =
      `₹ ${fmt(totalLoss)}`;

    document.querySelector(".card.neutral h2").innerText =
      `₹ ${fmt(netPL)}`;

    document.querySelector(".risk small").innerText =
      "Calculated from SubAdmin balances";

    // SubAdmin overview cards
    document.querySelector(
      ".subadmin-summary .card.profit h2"
    ).innerText = subs.length;

    document.querySelector(
      ".subadmin-summary .card.neutral h2"
    ).innerText = `₹ ${fmt(netPL)}`;

    const worst = subs.reduce((a, b) => (a.balance < b.balance ? a : b), subs[0]);
    const best  = subs.reduce((a, b) => (a.balance > b.balance ? a : b), subs[0]);

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
    console.error("SUMMARY LOAD ERROR:", err);
  }
}

/* -------------------------------------
   2. SUBADMIN TABLE
------------------------------------- */
async function loadSubAdminTable() {
  try {
    const res = await fetch("/admin/subadmins", {
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

/* -------------------------------------
   UTILS
------------------------------------- */
function fmt(n) {
  return Number(n || 0).toLocaleString("en-IN");
}
