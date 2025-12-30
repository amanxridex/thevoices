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
