document.getElementById("year").textContent = new Date().getFullYear();

const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Stagger each section's reveal elements so a section "presents" itself as a
// cascade (title, then text, then cards) instead of everything popping at once.
document.querySelectorAll("section").forEach((section) => {
  section.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = Math.min(i * 70, 420) + "ms";
  });
});

const revealTargets = document.querySelectorAll(".reveal");
if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealTargets.forEach((el) => el.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  revealTargets.forEach((el) => revealObserver.observe(el));
}

// Side dot navigation: click to scroll, sync active state + dark/light styling
const dotButtons = document.querySelectorAll("#sideDots button");
const sideDots = document.getElementById("sideDots");
const darkSections = new Set(["top", "sobre", "contato"]);

dotButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = document.getElementById(btn.dataset.target);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

const sectionIds = Array.from(dotButtons).map((b) => b.dataset.target);
const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

function updateActiveDot() {
  let current = sections[0];
  const scrollPos = window.scrollY + 140;
  sections.forEach((sec) => {
    if (sec.offsetTop <= scrollPos) current = sec;
  });
  dotButtons.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.target === current.id);
  });
  sideDots.classList.toggle("on-dark", darkSections.has(current.id));
}

window.addEventListener("scroll", updateActiveDot, { passive: true });
updateActiveDot();

// Video posters: load the YouTube/Vimeo iframe only when the viewer clicks play,
// instead of loading all 6 embeds up front.
document.querySelectorAll(".video-poster").forEach((btn) => {
  btn.addEventListener("click", () => {
    const frame = btn.closest(".video-frame");
    const src = frame.dataset.src;
    const label = btn.getAttribute("aria-label") || "";
    const isVimeo = src.includes("vimeo.com");

    const iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = label.replace(/^Reproduzir:\s*/, "");
    iframe.loading = "lazy";
    iframe.frameBorder = "0";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allow = isVimeo
      ? "autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
      : "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;

    frame.replaceChildren(iframe);
  });
});
