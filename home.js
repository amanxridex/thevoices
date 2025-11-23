// Popup open/close
const popup = document.getElementById("popup");
// activate glow effect on button
document.querySelector(".book-btn").classList.add("glow");
document.getElementById("openPopup").onclick = () => popup.style.display = "flex";
document.getElementById("closePopup").onclick = () => popup.style.display = "none";

// Scroll reveal animations
const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target); // animate once
      }
    });
  },
  { threshold: 0.15 }
);

reveals.forEach(el => observer.observe(el));

// PARTICLES EFFECT
const particles = document.getElementById("particles");

function createParticle() {
  const p = document.createElement("span");
  const size = Math.random() * 5 + 2;
  p.classList.add("particle");
  p.style.width = size + "px";
  p.style.height = size + "px";
  p.style.left = Math.random() * window.innerWidth + "px";
  p.style.animationDuration = Math.random() * 5 + 3 + "s";
  particles.appendChild(p);

  setTimeout(() => p.remove(), 8000);
}

setInterval(createParticle, 300);

// PARALLAX SCROLL EFFECT
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  document.querySelector(".bg-container").style.transform = `translateY(${y * 0.25}px)`;
});
  