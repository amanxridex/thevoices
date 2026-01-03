let currentMarketId = null;

function editMarket(id) {
  currentMarketId = id;
  document.getElementById("editModal").style.display = "block";
}

function saveMarket() {
  fetch(API + "/admin/market/" + currentMarketId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("adminToken")
    },
    body: JSON.stringify({
      name: editName.value,
      openTime: editOpen.value,
      closeTime: editClose.value
    })
  })
  .then(() => location.reload());
}

function deleteMarket() {
  const ok = confirm(
    "⚠️ Are you sure?\n\nThis market will be permanently deleted.\nThis action cannot be undone."
  );

  if (!ok) return;

  fetch(API + "/api/markets/" + currentMarketId, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("adminToken")
    }
  })
  .then(res => res.json())
  .then(() => {
    closeModal();
    loadMarkets();
  })
  .catch(() => alert("Delete failed"));
}
