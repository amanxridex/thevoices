const API = "https://matka-backend-4fy1.onrender.com";

// ---------- LOGIN ----------
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

// ---------- LOGOUT ----------
function logout() {
  localStorage.removeItem("adminToken");
  location.href = "login.html";
}

// ---------- CREATE SUB ADMIN ----------
function createSubAdmin() {
  fetch(API + "/admin/create-subadmin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("adminToken")
    },
    body: JSON.stringify({
      username: document.getElementById("saUser").value,
      password: document.getElementById("saPass").value
    })
  })
  .then(res => res.json())
  .then(() => loadSubAdmins());
}

// ---------- LOAD SUB ADMINS ----------
function loadSubAdmins() {
  fetch(API + "/admin/subadmins", {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("adminToken")
    }
  })
  .then(res => res.json())
  .then(data => {
    const ul = document.getElementById("subAdminList");
    if (!ul) return;
    ul.innerHTML = "";
    data.forEach(sa => {
      const li = document.createElement("li");
      li.innerText = sa.username;
      ul.appendChild(li);
    });
  });
}

if (location.pathname.includes("subadmins")) {
  loadSubAdmins();
}
