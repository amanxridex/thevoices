const btn = document.getElementById("enterBtn");

// Fade out after 6 seconds
setTimeout(() => {
  btn.style.opacity = "0";
}, 6000);

// Change text + style + fade in again
setTimeout(() => {
  btn.innerText = "Enter Website";
  btn.classList.add("active");
  btn.style.opacity = "1";
}, 7500);
