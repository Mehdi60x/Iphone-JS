/* =========================================================
   Loader
========================================================= */
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    setTimeout(() => loader.classList.add("hidden"), 350);
});

/* =========================================================
   Custom cursor (smooth follow + magnetic hover)
========================================================= */
const cursor = document.getElementById("cursor");
const cursorDot = document.getElementById("cursorDot");
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorX = mouseX;
let cursorY = mouseY;

window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
});

function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll("a, button, .model, .feature-card, img").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
});

/* Magnetic buttons: pull toward cursor on hover */
document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${relX * 0.25}px, ${relY * 0.35}px)`;
    });
    el.addEventListener("mouseleave", () => {
        el.style.transform = "";
    });
});

/* =========================================================
   Logo: color cycle on click (synced across navbar + footer)
========================================================= */
const logos = document.querySelectorAll(".logo");
const logoPalette = ["#0071e3", "#34c759", "#ff9f0a", "#ff375f", "#af52de", "#5e5ce6"];
let logoIndex = 0;

function cycleLogoColor() {
    logoIndex = (logoIndex + 1) % logoPalette.length;
    document.documentElement.style.setProperty("--logo-color", logoPalette[logoIndex]);

    logos.forEach((logo) => {
        logo.classList.remove("bump");
        requestAnimationFrame(() => logo.classList.add("bump"));
    });
}

logos.forEach((logo) => logo.addEventListener("click", cycleLogoColor));

/* =========================================================
   Navbar: blur on scroll + mobile menu toggle
========================================================= */
const navbar = document.getElementById("navbar");
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");

window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
});

burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        burger.classList.remove("active");
        navLinks.classList.remove("open");
    });
});

/* =========================================================
   Model switcher: crossfade phone + background color tint
========================================================= */
const phoneImg = document.getElementById("phoneImg");
const heroSection = document.getElementById("home");
const colorName = document.getElementById("colorName");
const models = document.querySelectorAll(".model");

function switchModel(model) {
    const { img, color, name, theme } = model.dataset;
    if (phoneImg.src.includes(img.replace("./", ""))) return;

    models.forEach((m) => m.classList.remove("active"));
    model.classList.add("active");

    phoneImg.classList.add("swap");
    colorName.classList.add("fade");

    setTimeout(() => {
        phoneImg.src = img;
        colorName.textContent = name;
        heroSection.style.background = color;
        heroSection.classList.toggle("hero--dark", theme === "dark");
        navbar.classList.toggle("navbar--dark", theme === "dark");
        phoneImg.classList.remove("swap");
        colorName.classList.remove("fade");
    }, 280);
}

models.forEach((model) => {
    model.addEventListener("click", () => switchModel(model));
});

/* =========================================================
   Phone 3D tilt following the mouse
========================================================= */
const phoneStage = document.getElementById("phoneStage");

phoneStage.addEventListener("mousemove", (e) => {
    const rect = phoneStage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    phoneImg.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 18}deg) scale(1.04)`;
});

phoneStage.addEventListener("mouseleave", () => {
    phoneImg.style.transform = "rotateY(0) rotateX(0) scale(1)";
});

/* =========================================================
   Hero blobs: subtle parallax on mouse move
========================================================= */
const heroBg = document.getElementById("heroBg");
const blobs = heroBg.querySelectorAll(".blob");

window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    blobs.forEach((blob, i) => {
        const depth = (i + 1) * 10;
        blob.style.translate = `${x * depth}px ${y * depth}px`;
    });
});

/* =========================================================
   Scroll reveal via IntersectionObserver (with stagger)
========================================================= */
const revealEls = document.querySelectorAll("[data-reveal]");

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add("in-view"), i * 90);
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);

revealEls.forEach((el) => revealObserver.observe(el));

/* =========================================================
   Animated stat counters
========================================================= */
const statNumbers = document.querySelectorAll(".stat-number");

function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                statObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.5 }
);

statNumbers.forEach((el) => statObserver.observe(el));
