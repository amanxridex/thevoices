const API = "https://matka-backend-4fy1.onrender.com";

/* ================= LOGIN ================= */
function login() {
  fetch(API + "/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: document.getElementById("username").value,
      password: document.getElementById("password").value
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem("adminToken", data.token);
        location.href = "dashboard.html";
      } else {
        document.getElementById("error").innerText = "Invalid login";
      }
    });
}

/* ================= LOGOUT ================= */
function logout() {
  localStorage.removeItem("adminToken");
  location.href = "login.html";
}

/* ================= CREATE SUB ADMIN ================= */
function createSubAdmin() {
  fetch(API + "/admin/create-subadmin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("adminToken")
    },
    body: JSON.stringify({
      username: document.getElementById("saUser").value,
      password: document.getElementById("saPass").value
    })
  })
    .then(res => res.json())
    .then(() => {
      document.getElementById("saUser").value = "";
      document.getElementById("saPass").value = "";
      loadSubAdmins();
    });
}

/* ================= LOAD SUB ADMINS ================= */
function loadSubAdmins() {
  fetch(API + "/admin/subadmins", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("adminToken")
    }
  })
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("subAdminList");
      if (!list) return;

      list.innerHTML = "";
      document.getElementById("totalSubs").innerText = data.length;

      let totalUsers = 0;
      let totalWallet = 0;

      data.forEach(sa => {
        totalUsers += sa.users || 0;
        totalWallet += sa.balance || 0;

        list.innerHTML += `
          <div class="subadmin-row">
            <div><strong>${sa.username}</strong></div>
            <div>${sa.users || 0}</div>
            <div>₹ ${sa.balance || 0}</div>
            <div><button class="action-btn">View</button></div>
          </div>
        `;
      });

      document.getElementById("totalUsers").innerText = totalUsers;
      document.getElementById("totalWallet").innerText = "₹ " + totalWallet;
    });
}

/* ================= AUTO LOAD ================= */
if (location.pathname.includes("subadmins")) {
  loadSubAdmins();
}
