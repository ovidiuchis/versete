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
  "sioniada2025.json",
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
        // Hide checkBtn after hint is shown
        checkBtn.style.opacity = "0";
        setTimeout(() => {
          checkBtn.style.display = "none";
        }, 250);
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
        // Hide checkBtn after hint is shown
        checkBtn.style.opacity = "0";
        setTimeout(() => {
          checkBtn.style.display = "none";
        }, 250);
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

  // Add 'Verifică' button (eye icon)
  const checkBtn = document.createElement("button");
  checkBtn.className = "check-btn";
  checkBtn.title = "Verifică";
  checkBtn.innerHTML =
    '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 4C5.45455 4 1.81818 7.27273 1 10C1.81818 12.7273 5.45455 16 10 16C14.5455 16 18.1818 12.7273 19 10C18.1818 7.27273 14.5455 4 10 4ZM10 14C7.23864 14 5 11.7614 5 9C5 6.23864 7.23864 4 10 4C12.7614 4 15 6.23864 15 9C15 11.7614 12.7614 14 10 14ZM10 6C8.34315 6 7 7.34315 7 9C7 10.6569 8.34315 12 10 12C11.6569 12 13 10.6569 13 9C13 7.34315 11.6569 6 10 6Z" fill="#3b5ba9"/></svg>';
  checkBtn.addEventListener("click", function (e) {
    e.stopPropagation(); // Prevent triggering card click
    if (currentMode === "verset") {
      text.textContent = verse.text;
      text.classList.remove("blurred", "partial");
      clickCount = 2; // Mark as fully revealed
    } else if (currentMode === "referinta") {
      ref.textContent = verse.ref;
      ref.classList.remove("blurred", "partial");
      clickCount = 2;
    }
    checkBtn.disabled = true;
    checkBtn.classList.add("checked");
    checkBtn.style.opacity = "0";
    setTimeout(() => {
      checkBtn.style.display = "none";
    }, 250);
  });
  card.appendChild(checkBtn);

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
  // Remove any existing collection title row above mode buttons
  const modeButtons = document.getElementById("mode-buttons");
  const prevTitleRow = document.querySelector(".collection-title-row");
  if (prevTitleRow && prevTitleRow.parentNode) {
    prevTitleRow.parentNode.removeChild(prevTitleRow);
  }
  let verses = getCollectionVerses(collection);

  // Add collection title, right arrow, and count label
  const collectionTitleRow = document.createElement("div");
  collectionTitleRow.className = "collection-title-row";
  const title = document.createElement("span");
  title.className = "collection-title";
  const btn = document.querySelector(`button[data-collection='${collection}']`);
  title.textContent = btn ? btn.textContent.trim() : collection;
  // Arrow
  const arrow = document.createElement("span");
  arrow.className = "collection-title-arrow";
  arrow.textContent = "→";
  // Count label
  const countLabel = document.createElement("span");
  countLabel.className = "verses-count-label";
  countLabel.textContent = `${verses.length} versete`;
  collectionTitleRow.appendChild(title);
  collectionTitleRow.appendChild(arrow);
  collectionTitleRow.appendChild(countLabel);

  // Insert the title row above the mode buttons
  if (modeButtons && modeButtons.parentNode) {
    modeButtons.parentNode.insertBefore(collectionTitleRow, modeButtons);
  }

  shuffleArray(verses);
  verses.forEach((verse) => {
    versesSection.appendChild(createVerseCard(verse));
  });
  versesSection.style.display = "block";
  showActionButtons(true);
  showHero(false);
  showModeButtons(true);
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
      // Add a new state to the browser history
      history.pushState(
        { collection: currentCollection },
        "",
        "#" + currentCollection
      );
    }
  });

  // Listen for browser back/forward navigation
  window.addEventListener("popstate", function (event) {
    if (!event.state || !event.state.collection) {
      // No collection selected, go to index/home
      section.style.display = "flex";
      document.getElementById("verses-section").style.display = "none";
      showActionButtons(false);
      showHero(true);
      showModeButtons(false);
      // Remove collection title row if present
      const prevTitleRow = document.querySelector(".collection-title-row");
      if (prevTitleRow && prevTitleRow.parentNode) {
        prevTitleRow.parentNode.removeChild(prevTitleRow);
      }
    } else {
      // Optionally, handle forward navigation to a collection
      // renderVerses(event.state.collection);
    }
  });

  backBtn.addEventListener("click", function () {
    versesSection.style.display = "none";
    section.style.display = "flex";
    showActionButtons(false);
    showHero(true);
    showModeButtons(false);
    // Remove collection title row if present
    const prevTitleRow = document.querySelector(".collection-title-row");
    if (prevTitleRow && prevTitleRow.parentNode) {
      prevTitleRow.parentNode.removeChild(prevTitleRow);
    }
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
      // Remove collection title row if present
      const prevTitleRow = document.querySelector(".collection-title-row");
      if (prevTitleRow && prevTitleRow.parentNode) {
        prevTitleRow.parentNode.removeChild(prevTitleRow);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  }
});
