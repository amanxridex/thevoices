/* ================================
   SUPER D – PROFIT & LOSS DASHBOARD
   Frontend Logic (pl.js)
   ================================ */

document.addEventListener("DOMContentLoaded", () => {
  loadSummary();
  loadSubAdmins();
  loadMarketPL();
});

/* -------------------------------
   1. SUMMARY (TOP CARDS)
-------------------------------- */
async function loadSummary() {
  try {
    const res = await fetch("/api/admin/pl/summary");
    const data = await res.json();

    // Expecting:
    // data = { totalProfit, totalLoss, netPL, riskPercent }

    document.querySelector(".card.profit h2").innerText =
      `₹ ${format(data.totalProfit)}`;

    document.querySelector(".card.loss h2").innerText =
      `₹ ${format(data.totalLoss)}`;

    document.querySelector(".card.neutral h2").innerText =
      `₹ ${format(data.netPL)}`;

    document.querySelector(".risk small").innerText =
      `${data.riskPercent}% Exposure`;

  } catch (err) {
    console.error("Summary load failed", err);
  }
}

/* -------------------------------
   2. SUBADMIN TABLE
-------------------------------- */
async function loadSubAdmins() {
  try {
    const res = await fetch("/api/admin/pl/subadmins");
    const subadmins = await res.json();

    // Expecting array of:
    // { name, totalBet, totalWin, netPL, risk }

    const table = document.querySelector(
      ".table-card table tbody"
    );

    if (!table) return;

    table.innerHTML = "";

    subadmins.forEach(sa => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${sa.name}</td>
        <td>₹ ${format(sa.totalBet)}</td>
        <td>₹ ${format(sa.totalWin)}</td>
        <td class="${sa.netPL >= 0 ? "profit" : "loss"}">
          ₹ ${format(sa.netPL)}
        </td>
        <td class="${sa.risk.toLowerCase()}">${sa.risk}</td>
      `;

      table.appendChild(tr);
    });

  } catch (err) {
    console.error("SubAdmin load failed", err);
  }
}

/* -------------------------------
   3. MARKET WISE P/L
-------------------------------- */
async function loadMarketPL() {
  try {
    const res = await fetch("/api/admin/pl/markets");
    const markets = await res.json();

    // Expecting array of:
    // { market, bet, win, pl }

    const tables = document.querySelectorAll(".tables table");
    const marketTable = tables[0];

    if (!marketTable) return;

    const rows = marketTable.querySelectorAll("tr");
    rows.forEach((r, i) => i !== 0 && r.remove());

    markets.forEach(m => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${m.market}</td>
        <td>₹ ${format(m.bet)}</td>
        <td>₹ ${format(m.win)}</td>
        <td class="${m.pl >= 0 ? "profit" : "loss"}">
          ₹ ${format(m.pl)}
        </td>
      `;
      marketTable.appendChild(tr);
    });

  } catch (err) {
    console.error("Market P/L load failed", err);
  }
}

/* -------------------------------
   UTILS
-------------------------------- */
function format(num) {
  return Number(num || 0).toLocaleString("en-IN");
}
