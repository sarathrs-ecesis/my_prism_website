"use strict";
const icons = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z"/><path d="M9 21v-8h6v8"/>',
  car: '<path d="m5 7 2-4h10l2 4 2 3v8H3v-8Z"/><path d="M3 10h18M6 14h2m8 0h2M5 18v3m14-3v3"/>',
  plane: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="m11 13 11-11"/>',
  file: '<path d="M14 2H5v20h14V7Z"/><path d="M14 2v5h5M8 12h8m-8 4h6"/>',
  layers: '<path d="m12 3 10 5-10 5L2 8Zm-10 9 10 5 10-5M2 16l10 5 10-5"/>',
  flag: '<path d="M5 22V3m0 1c5-4 9 4 14 0v10c-5 4-9-4-14 0"/>',
  shield:
    '<path d="M12 2 3 6v6c0 5 6 9 9 10 3-1 9-5 9-10V6Z"/><path d="m8 12 3 3 5-6"/>',
  message: '<path d="M21 3H3v15h4v4l5-4h9Z"/><path d="M7 8h10M7 12h7"/>',
  calendar:
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18m-13 4h1m3 0h1m3 0h1m-9 3h1m3 0h1"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>',
  folder: '<path d="M3 5h7l2 3h9v12H3Z"/>',
  receipt:
    '<path d="m5 2 2 2 2-2 3 2 3-2 2 2 2-2v20l-2-2-2 2-3-2-3 2-2-2-2 2Z"/><path d="M8 8h8m-8 4h8m-8 4h5"/>',
  link: '<path d="m10 13 4-4m-6 7-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m2 1 2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0" transform="translate(1 0)"/>',
};
document.querySelectorAll("[data-icon]").forEach((el) => {
  const path = icons[el.dataset.icon];
  if (path)
    el.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true">' + path + "</svg>";
});
const menuButton = document.querySelector(".menu-toggle");
const nav = document.getElementById("main-nav");
function closeMenu() {
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
}
menuButton.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") === "true";
  nav.classList.toggle("open", !expanded);
  menuButton.setAttribute("aria-expanded", String(!expanded));
  menuButton.setAttribute(
    "aria-label",
    expanded ? "Open navigation" : "Close navigation",
  );
});
nav
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("open")) {
    closeMenu();
    menuButton.focus();
  }
});
const tabs = Array.from(
  document.querySelectorAll('.product-tabs [role="tab"]'),
);
function selectTab(tab) {
  tabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute("aria-controls")).hidden =
      !selected;
  });
}
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (e) => {
    let next;
    if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (e.key === "ArrowLeft")
      next = (index - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    selectTab(tabs[next]);
    tabs[next].focus();
  });
});
// Language & Translations
let currentLang = localStorage.getItem("prism-lang") || "en";
let translations = {};

let activeQuestionKey = "renewal";

function getExample(key, lang = currentLang) {
  const t = translations[lang] || translations.en;
  if (!t) {
    const defaults = {
      renewal: {
        question: "When does my home policy renew?",
        answer: "The renewal date in this sample policy is <strong>31 December 2026</strong>. Check the policy’s notice period before making any changes.",
        source: "Home-policy.pdf · Example document",
      },
      documents: {
        question: "Where is the receipt for my laptop?",
        answer: "In this example, <strong>Laptop-receipt.pdf</strong> is stored alongside the home contents policy, so the policy and supporting paperwork are easy to find together.",
        source: "Laptop-receipt.pdf · Example document",
      },
      next: {
        question: "What should I check before renewal?",
        answer: "Start with the <strong>renewal date and notice period</strong> shown in your policy. Review its terms and contact your insurer if you need to clarify any details.",
        source: "Illustrative checklist · Check your policy terms",
      },
    };
    return defaults[key] || defaults.renewal;
  }
  if (key === "renewal") {
    return {
      question: t.q_renewal,
      answer: t.a_renewal,
      source: t.src_renewal,
    };
  } else if (key === "documents") {
    return {
      question: t.q_documents,
      answer: t.a_documents,
      source: t.src_documents,
    };
  } else if (key === "next") {
    return {
      question: t.q_next,
      answer: t.a_next,
      source: t.src_next,
    };
  }
  return null;
}

function updateActiveExample() {
  const example = getExample(activeQuestionKey, currentLang);
  if (!example) return;

  const qEl = document.getElementById("sample-question");
  const aEl = document.getElementById("sample-answer");
  const sEl = document.getElementById("sample-source");

  if (qEl) qEl.textContent = example.question;
  if (aEl) aEl.innerHTML = example.answer;
  if (sEl) sEl.textContent = example.source;
}

document.querySelectorAll("[data-question]").forEach((button) =>
  button.addEventListener("click", () => {
    activeQuestionKey = button.dataset.question;
    document.querySelectorAll("[data-question]").forEach((item) => {
      const isAct = item === button;
      item.classList.toggle("active", isAct);
      item.setAttribute("aria-pressed", String(isAct));
    });
    updateActiveExample();
  }),
);

function applyTranslations(lang) {
  const t = translations[lang];
  if (!t) return;

  document.documentElement.setAttribute("lang", lang);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (t[key] !== undefined) {
      el.innerHTML = t[key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (t[key] !== undefined) {
      el.placeholder = t[key];
    }
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria-label");
    if (t[key] !== undefined) {
      el.setAttribute("aria-label", t[key]);
    }
  });

  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    if (t[key] !== undefined) {
      el.setAttribute("title", t[key]);
    }
  });

  document.querySelectorAll("[data-i18n-opt]").forEach((el) => {
    const key = el.getAttribute("data-i18n-opt");
    if (t[key] !== undefined) {
      el.textContent = t[key];
    }
  });

  // Update Language Toggle Button UI
  const langToggle = document.getElementById("lang-toggle");
  const flagEn = document.querySelector(".lang-flag-en");
  const flagDe = document.querySelector(".lang-flag-de");
  const langLabel = document.getElementById("lang-label");

  if (lang === "en") {
    if (flagEn) flagEn.style.display = "none";
    if (flagDe) flagDe.style.display = "inline-flex";
    if (langLabel) langLabel.textContent = "DE";
    if (langToggle) {
      const toggleTitle = t.lang_toggle_title_de || "Auf Englisch wechseln";
      langToggle.setAttribute("title", toggleTitle);
      langToggle.setAttribute("aria-label", toggleTitle);
    }
  } else {
    if (flagEn) flagEn.style.display = "inline-flex";
    if (flagDe) flagDe.style.display = "none";
    if (langLabel) langLabel.textContent = "EN";
    if (langToggle) {
      const toggleTitle = t.lang_toggle_title_en || "Switch to German";
      langToggle.setAttribute("title", toggleTitle);
      langToggle.setAttribute("aria-label", toggleTitle);
    }
  }

  updateActiveExample();
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("prism-lang", lang);
  applyTranslations(lang);
}

// Language toggle click handler
const langToggleBtn = document.getElementById("lang-toggle");
if (langToggleBtn) {
  langToggleBtn.addEventListener("click", () => {
    const nextLang = currentLang === "en" ? "de" : "en";
    setLanguage(nextLang);
  });
}

// Load translations from JSON file
async function initTranslations() {
  try {
    const res = await fetch("translations.json");
    if (res.ok) {
      translations = await res.json();
    }
  } catch (err) {
    console.warn("Could not fetch translations.json (e.g. running locally without server), using fallback:", err);
  }
  applyTranslations(currentLang);
}

initTranslations();
document.getElementById("year").textContent = String(new Date().getFullYear());

// Theme toggle logic
const themeToggle = document.getElementById("theme-toggle");

function getActiveTheme() {
  const saved = localStorage.getItem("prism-theme");
  if (saved === "light" || saved === "dark") {
    return saved;
  }
  return document.documentElement.getAttribute("data-theme") || "dark";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("prism-theme", theme);

  const isDark = theme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  if (themeToggle) {
    themeToggle.setAttribute("aria-label", label);
    themeToggle.setAttribute("title", label);
    themeToggle.setAttribute("aria-pressed", String(isDark));
  }

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute("content", isDark ? "#13131C" : "#ffffff");
  }
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current =
      document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
  });
}

// Initial state sync
applyTheme(getActiveTheme());

// Google Apps Script Web App URL (replace with your deployed URL if needed)
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyjSW4tGEXXiqmQikpscroFOOt_Efs9krTax-JxR6NEEMwQWKGy3Y7Vcc9D8ERPm3ql/exec";

let toastTimeout = null;

function showToast(title, message, duration = 4500) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  const strong = toast.querySelector(".toast-content strong");
  const span = toast.querySelector(".toast-content span");

  if (strong && title) strong.textContent = title;
  if (span && message) span.textContent = message;

  if (toastTimeout) {
    clearTimeout(toastTimeout);
    toastTimeout = null;
  }

  toast.classList.remove("translate-y-[-150%]", "opacity-0", "toast-hidden");
  toast.classList.add("translate-y-0", "opacity-100", "toast-visible");

  toastTimeout = setTimeout(() => {
    hideToast();
  }, duration);
}

function hideToast() {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.classList.remove("translate-y-0", "opacity-100", "toast-visible");
  toast.classList.add("translate-y-[-150%]", "opacity-0", "toast-hidden");

  if (toastTimeout) {
    clearTimeout(toastTimeout);
    toastTimeout = null;
  }
}

window.showToast = showToast;
window.hideToast = hideToast;

async function handleWaitlistSubmit(event, inputId) {
  event.preventDefault();

  const input = document.getElementById(inputId);

  if (!input) return;

  const email = input.value.trim();

  if (!email) return;

  const form = input.closest("form");
  const button = form ? form.querySelector("button[type='submit']") : null;

  const originalBtnContent = button ? button.innerHTML : "";
  const t = translations[currentLang] || {};
  const submittingWaitlistText = t.waitlist_submitting || (currentLang === "de" ? "Wird eingetragen..." : "Joining...");

  if (button) {
    button.disabled = true;
    button.innerHTML = `<span class="button-loading"><span class="button-spinner" aria-hidden="true"></span><span>${submittingWaitlistText}</span></span>`;
  }

  try {
    if (
      GOOGLE_SCRIPT_URL &&
      !GOOGLE_SCRIPT_URL.includes("YOUR_GOOGLE_APPS_SCRIPT")
    ) {
      const params = new URLSearchParams();

      params.append("email", email);
      params.append("timestamp", new Date().toLocaleString());
      params.append(
        "source",
        inputId === "hero-email" ? "Hero Section" : "Footer Section",
      );

      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });
    } else {
      throw new Error("Google Apps Script URL is not configured.");
    }

    // Show success toast
    const toastTitle = t.toast_title || (currentLang === "de" ? "Sie sind auf der Warteliste!" : "You're on the waitlist!");
    const toastMsg = t.toast_message || (currentLang === "de" ? "Wir benachrichtigen Sie, wenn MyPrism 360 startet." : "We'll notify you when MyPrism 360 launches.");
    showToast(toastTitle, toastMsg);

    input.value = "";
  } catch (error) {
    console.error("Error submitting waitlist email:", error);
  } finally {
    if (button) {
      button.disabled = false;
      button.innerHTML = originalBtnContent;

      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }
    }
  }
}

window.handleWaitlistSubmit = handleWaitlistSubmit;

async function handleContactSubmit(event) {
  event.preventDefault();

  const form = event.target;

  const nameInput = form.querySelector("#contact-name");
  const emailInput = form.querySelector("#contact-email");
  const topicInput = form.querySelector("#contact-topic");
  const messageInput = form.querySelector("#contact-message");

  const button = form.querySelector("button[type='submit']");
  const originalBtnContent = button ? button.innerHTML : "";
  const t = translations[currentLang] || {};
  const submittingContactText = t.contact_submitting || (currentLang === "de" ? "Nachricht wird gesendet..." : "Sending message...");

  const name = nameInput ? nameInput.value.trim() : "";
  const email = emailInput ? emailInput.value.trim() : "";
  const topic = topicInput ? topicInput.value : "";
  const message = messageInput ? messageInput.value.trim() : "";

  if (!name || !email || !message) {
    return;
  }

  if (button) {
    button.disabled = true;
    button.innerHTML = `<span class="button-loading"><span class="button-spinner" aria-hidden="true"></span><span>${submittingContactText}</span></span>`;
  }

  try {
    if (
      GOOGLE_SCRIPT_URL &&
      !GOOGLE_SCRIPT_URL.includes("YOUR_GOOGLE_APPS_SCRIPT")
    ) {
      const params = new URLSearchParams();

      params.append("name", name);
      params.append("email", email);
      params.append("topic", topic);
      params.append("message", message);
      params.append("timestamp", new Date().toLocaleString());
      params.append("source", "Contact Form");

      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });
    } else {
      throw new Error("Google Apps Script URL is not configured.");
    }

    // Show inline feedback inside the contact form (toast is not shown for contact form)
    const feedback = document.getElementById("contact-feedback");
    if (feedback) {
      feedback.hidden = false;
      setTimeout(() => {
        feedback.hidden = true;
      }, 7000);
    }

    form.reset();
  } catch (error) {
    console.error("Error submitting contact form:", error);
  } finally {
    if (button) {
      button.disabled = false;
      button.innerHTML = originalBtnContent;
    }
  }
}

window.handleContactSubmit = handleContactSubmit;

// Hide contact inline feedback on new input
const contactFormEl = document.getElementById("contact-form");
if (contactFormEl) {
  contactFormEl.addEventListener("input", () => {
    const feedback = document.getElementById("contact-feedback");
    if (feedback && !feedback.hidden) {
      feedback.hidden = true;
    }
  });
}
