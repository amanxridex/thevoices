const API = "https://matka-backend-4fy1.onrender.com";

/* CREATE SUB ADMIN */
function createSubAdmin() {
  const username = document.getElementById("saUser").value.trim();
  const password = document.getElementById("saPass").value.trim();

  if (!username || !password) {
    alert("Username & password required");
    return;
  }

  fetch(API + "/admin/create-subadmin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("adminToken")
    },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(() => {
    document.getElementById("saUser").value = "";
    document.getElementById("saPass").value = "";
    loadSubAdmins();
  });
}

/* LOAD SUB ADMINS + REAL STATS */
function loadSubAdmins() {
  fetch(API + "/admin/subadmins", {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("adminToken")
    }
  })
  .then(res => res.json())
  .then(data => {
    const ul = document.getElementById("subAdminList");

    let totalUsers = 0;
    let totalWallet = 0;

    ul.innerHTML = "";
    document.getElementById("totalSubs").innerText = data.length;

    data.forEach(sa => {
      totalUsers += sa.users || 0;
      totalWallet += sa.balance || 0;

      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${sa.username}</strong><br>
        👥 Users: ${sa.users || 0}<br>
        💰 Wallet: ₹ ${sa.balance || 0}
      `;
      ul.appendChild(li);
    });

    document.getElementById("totalUsers").innerText = totalUsers;
    document.getElementById("totalWallet").innerText = "₹ " + totalWallet.toLocaleString();
  });
}

/* LOAD ON PAGE OPEN */
loadSubAdmins();
