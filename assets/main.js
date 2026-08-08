const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const revealElements = document.querySelectorAll("[data-reveal]");
if (reducedMotion.matches || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8%", threshold: 0.08 });

  revealElements.forEach((element) => revealObserver.observe(element));
}

const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.querySelector(".site-nav");
if (navToggle && primaryNav) {
  const closeNavigation = () => {
    navToggle.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("is-open");
  };

  navToggle.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!open));
    primaryNav.classList.toggle("is-open", !open);
  });
  primaryNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeNavigation();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNavigation();
  });
}

const siteHeader = document.querySelector("[data-header]");
const main = document.querySelector("main");
if (siteHeader && main && "IntersectionObserver" in window) {
  const headerObserver = new IntersectionObserver(([entry]) => {
    siteHeader.classList.toggle("is-scrolled", !entry.isIntersecting);
  }, { rootMargin: "-80px 0px 0px", threshold: 0 });
  headerObserver.observe(main);
}

const sectionRailLinks = document.querySelectorAll(".section-rail a");
if (sectionRailLinks.length && "IntersectionObserver" in window) {
  const setActiveSection = (id) => sectionRailLinks.forEach((link) => {
    if (link.hash === `#${id}`) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActiveSection(entry.target.id);
    });
  }, { rootMargin: "-42% 0px -52%", threshold: 0 });
  sectionRailLinks.forEach((link) => sectionObserver.observe(document.querySelector(link.hash)));
}

const heroVideo = document.querySelector("[data-hero-video]");
const heroVideoLink = document.querySelector("[data-hero-video-link]");
if (heroVideo && heroVideoLink) {
  const markHeroReady = () => heroVideoLink.classList.add("is-ended");
  const work = document.querySelector("#work");
  const scrollToWork = () => {
    if (!work) return;
    history.pushState(null, "", "#work");
    work.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
  };

  heroVideo.addEventListener("ended", markHeroReady);
  heroVideoLink.addEventListener("click", (event) => {
    event.preventDefault();
    if (event.detail === 0 && heroVideoLink.classList.contains("is-ended")) scrollToWork();
  });
  heroVideoLink.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0 || !heroVideoLink.classList.contains("is-ended")) return;
    event.preventDefault();
    heroVideoLink.setPointerCapture(event.pointerId);
    heroVideoLink.classList.add("is-holding");
  });
  heroVideoLink.addEventListener("pointerup", (event) => {
    if (!heroVideoLink.classList.contains("is-holding")) return;
    heroVideoLink.classList.remove("is-holding");
    if (heroVideoLink.hasPointerCapture(event.pointerId)) heroVideoLink.releasePointerCapture(event.pointerId);
    scrollToWork();
  });
  heroVideoLink.addEventListener("pointercancel", () => heroVideoLink.classList.remove("is-holding"));

  if (reducedMotion.matches) {
    const freezeAtEnd = () => {
      heroVideo.currentTime = Math.max(0, heroVideo.duration - 0.08);
    };
    heroVideo.addEventListener("seeked", markHeroReady, { once: true });
    if (heroVideo.readyState >= 1) freezeAtEnd();
    else heroVideo.addEventListener("loadedmetadata", freezeAtEnd, { once: true });
  }
}

const videos = document.querySelectorAll("video[data-autoplay]");
if (videos.length && "IntersectionObserver" in window) {
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting && !reducedMotion.matches && !video.ended) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.35 });
  videos.forEach((video) => videoObserver.observe(video));
}

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});
