// Navigation, theme, typewriter, project filters, email copy, scroll effects and particles
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const menuToggle = $("#menuToggle");
const navLinks = $("#navLinks");
menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
$$(".nav-link").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

const themeToggle = $("#themeToggle");
const savedTheme = localStorage.getItem("lokesh-theme");
if (savedTheme) document.documentElement.dataset.theme = savedTheme;
themeToggle.textContent = document.documentElement.dataset.theme === "light" ? "☾" : "☼";
themeToggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  if (next === "dark") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = next;
  localStorage.setItem("lokesh-theme", next);
  themeToggle.textContent = next === "light" ? "☾" : "☼";
});

const roles = ["AWS Cloud", "Cloud Infrastructure", "Linux & DevOps", "Problem Solving"];
let roleIndex = 0, charIndex = 0, deleting = false;
const typedRole = $("#typedRole");
function typeRole() {
  const current = roles[roleIndex];
  typedRole.textContent = current.slice(0, charIndex);
  if (!deleting && charIndex < current.length) { charIndex++; setTimeout(typeRole, 85); }
  else if (!deleting) { deleting = true; setTimeout(typeRole, 1250); }
  else if (charIndex > 0) { charIndex--; setTimeout(typeRole, 42); }
  else { deleting = false; roleIndex = (roleIndex + 1) % roles.length; setTimeout(typeRole, 300); }
}
typeRole();

$$(".filter-btn").forEach(button => button.addEventListener("click", () => {
  $$(".filter-btn").forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  const filter = button.dataset.filter;
  $$(".project-card").forEach(card => {
    card.classList.toggle("hidden", filter !== "all" && card.dataset.category !== filter);
  });
}));

$("#copyEmail").addEventListener("click", async () => {
  const status = $("#copyStatus");
  try {
    await navigator.clipboard.writeText("lokiloki2560@gmail.com");
    status.textContent = "Email address copied.";
  } catch {
    status.textContent = "Copy not available in this browser. Email: lokiloki2560@gmail.com";
  }
});
$("#year").textContent = new Date().getFullYear();

const header = $(".site-header");
const sections = $$("main section[id]");
function updateScroll() {
  header.classList.toggle("scrolled", window.scrollY > 20);
  let active = "home";
  sections.forEach(section => { if (window.scrollY >= section.offsetTop - 160) active = section.id; });
  $$(".nav-link").forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${active}`));
}
window.addEventListener("scroll", updateScroll, { passive: true });
updateScroll();

// Lightweight canvas particles; automatically scales to the viewport.
const canvas = $("#particles"), ctx = canvas.getContext("2d");
let particles = [], width = 0, height = 0;
function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth; height = window.innerHeight;
  canvas.width = width * ratio; canvas.height = height * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  const count = Math.min(65, Math.floor(width / 22));
  particles = Array.from({length: count}, () => ({
    x: Math.random() * width, y: Math.random() * height,
    vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25,
    r: Math.random() * 1.5 + .5
  }));
}
function drawParticles() {
  ctx.clearRect(0, 0, width, height);
  const light = document.documentElement.dataset.theme === "light";
  const tint = light ? "rgba(48,103,160," : "rgba(105,170,220,";
  particles.forEach((p, i) => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = tint + ".55)"; ctx.fill();
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j], dx = p.x - q.x, dy = p.y - q.y, distance = Math.hypot(dx, dy);
      if (distance < 115) {
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = tint + (1 - distance / 115) * .12 + ")"; ctx.lineWidth = .6; ctx.stroke();
      }
    }
  });
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) requestAnimationFrame(drawParticles);
}
resizeCanvas(); drawParticles();
window.addEventListener("resize", resizeCanvas);
