// Versete de memorat
let currentMode = "verset"; // "verset" or "referinta"
let heroVerses = [];

async function loadHeroVerses() {
  const response = await fetch("hero-verses.json");
  heroVerses = await response.json();
}

// Dynamically detect collections based on JSON files in the root directory
const collectionFiles = [
  "comunitate2025.json",
  "scriptura.json",
  // Add more collection files here as needed
];

const collections = {};
collectionFiles.forEach((file) => {
  const name = file.replace(/\.json$/, "");
  collections[name] = {
    data: [],
    file,
    map: (v) => {
      // Try to normalize structure: prefer {ref, text}, else {reference, text}
      if (v.ref && v.text) return v;
      if (v.reference && v.text) return { ref: v.reference, text: v.text };
      return v;
    },
  };
});

async function loadCollection(name) {
  if (!collections[name]) return;
  const response = await fetch(collections[name].file);
  collections[name].data = await response.json();
}

async function loadAllCollections() {
  await Promise.all(Object.keys(collections).map(loadCollection));
}

function getCollectionVerses(name) {
  if (!collections[name]) return [];
  return collections[name].data.map(collections[name].map);
}

function setRandomHeroVerse() {
  if (!heroVerses.length) return;
  const idx = Math.floor(Math.random() * heroVerses.length);
  const hero = document.querySelector(".hero blockquote");
  if (hero) {
    hero.innerHTML = `„${heroVerses[idx].text}”<span class="hero-ref">${heroVerses[idx].ref}</span>`;
  }
}

function createVerseCard(verse) {
  const card = document.createElement("div");
  card.className = "verse-card";
  card.style.cursor = "pointer";

  const ref = document.createElement("div");
  ref.className = "verse-ref";
  ref.textContent = verse.ref;

  const text = document.createElement("div");
  text.className = "verse-text";
  text.textContent = verse.text;

  let clickCount = 0;
  card.addEventListener("click", function () {
    clickCount++;
    if (currentMode === "verset") {
      if (clickCount === 1) {
        const firstWord = verse.text.split(" ")[0];
        text.innerHTML =
          `<span class="first-word">${firstWord}</span>` +
          `<span class="rest-blur">${verse.text.slice(
            firstWord.length
          )}</span>`;
        text.classList.remove("blurred");
        text.classList.add("partial");
      } else if (clickCount === 2) {
        text.textContent = verse.text;
        text.classList.remove("partial", "blurred");
      }
    } else if (currentMode === "referinta") {
      const colonIdx = verse.ref.indexOf(":");
      if (clickCount === 1) {
        if (colonIdx !== -1) {
          ref.innerHTML = `<span class="first-word">${verse.ref.slice(
            0,
            colonIdx + 1
          )}</span><span class="rest-blur">${verse.ref.slice(
            colonIdx + 1
          )}</span>`;
        } else {
          ref.innerHTML = `<span class="first-word">${verse.ref}</span>`;
        }
        ref.classList.remove("blurred");
        ref.classList.add("partial");
      } else if (clickCount === 2) {
        ref.textContent = verse.ref;
        ref.classList.remove("partial", "blurred");
      }
    }
  });

  if (currentMode === "verset") {
    text.classList.add("blurred");
  } else if (currentMode === "referinta") {
    ref.classList.add("blurred");
  }

  card.appendChild(ref);
  card.appendChild(text);
  return card;
}

function updateModeButtons() {
  document
    .getElementById("mode-verset")
    .classList.toggle("mode-active", currentMode === "verset");
  document
    .getElementById("mode-referinta")
    .classList.toggle("mode-active", currentMode === "referinta");
}

function showModeButtons(show) {
  document.getElementById("mode-buttons").style.display = show
    ? "flex"
    : "none";
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function showActionButtons(show) {
  document.getElementById("action-buttons").style.display = show
    ? "flex"
    : "none";
}

function showHero(show) {
  const hero = document.querySelector(".hero");
  if (hero) hero.style.display = show ? "block" : "none";
}

function renderVerses(collection) {
  const versesSection = document.getElementById("verses-section");
  versesSection.innerHTML = "";
  let verses = getCollectionVerses(collection);
  shuffleArray(verses);
  verses.forEach((verse) => {
    versesSection.appendChild(createVerseCard(verse));
  });
  versesSection.style.display = "block";
  showActionButtons(true);
  showHero(false);
  showModeButtons(true);
  // Remove main.scrollIntoView to prevent scrolling past mode buttons
}

function setupCollectionSelector() {
  const section = document.getElementById("collection-select-section");
  const versesSection = document.getElementById("verses-section");
  const backBtn = document.getElementById("back-btn");
  const refreshBtn = document.getElementById("refresh-btn");
  const modeVersetBtn = document.getElementById("mode-verset");
  const modeReferintaBtn = document.getElementById("mode-referinta");
  let currentCollection = null;

  section.addEventListener("click", function (e) {
    if (e.target.classList.contains("collection-btn")) {
      currentCollection = e.target.getAttribute("data-collection");
      section.style.display = "none";
      renderVerses(currentCollection);
      // Ensure mode buttons are visible at the very top of the viewport
      window.scrollTo({
        top:
          document.getElementById("mode-buttons").getBoundingClientRect().top +
          window.scrollY -
          8,
        behavior: "smooth",
      });
    }
  });

  backBtn.addEventListener("click", function () {
    versesSection.style.display = "none";
    section.style.display = "flex";
    showActionButtons(false);
    showHero(true);
    showModeButtons(false);
  });

  refreshBtn.addEventListener("click", function () {
    if (currentCollection) {
      renderVerses(currentCollection);
    }
  });

  modeVersetBtn.addEventListener("click", function () {
    if (currentMode !== "verset") {
      currentMode = "verset";
      updateModeButtons();
      if (currentCollection) renderVerses(currentCollection);
    }
  });
  modeReferintaBtn.addEventListener("click", function () {
    if (currentMode !== "referinta") {
      currentMode = "referinta";
      updateModeButtons();
      if (currentCollection) renderVerses(currentCollection);
    }
  });
  // Show hero on load
  showHero(true);
  showModeButtons(false);
}

// On DOMContentLoaded, load the JSON first, then setup

document.addEventListener("DOMContentLoaded", async function () {
  // Always hide action buttons, mode buttons, and verses section on load
  document.getElementById("action-buttons").classList.add("hidden");
  document.getElementById("mode-buttons").classList.add("hidden");
  document.getElementById("verses-section").classList.add("hidden");
  document.getElementById("action-buttons").style.display = "none";
  document.getElementById("mode-buttons").style.display = "none";
  document.getElementById("verses-section").style.display = "none";

  await Promise.all([loadAllCollections(), loadHeroVerses()]);
  setRandomHeroVerse();
  setupCollectionSelector();

  const siteTitle = document.getElementById("site-title");
  if (siteTitle) {
    siteTitle.style.cursor = "pointer";
    siteTitle.onclick = function () {
      document.getElementById("collection-select-section").style.display =
        "flex";
      document.getElementById("verses-section").style.display = "none";
      document.getElementById("action-buttons").style.display = "none";
      const hero = document.querySelector(".hero");
      if (hero) hero.style.display = "block";
      document.getElementById("mode-buttons").style.display = "none";
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  }
});
