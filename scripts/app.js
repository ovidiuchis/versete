// Versete de memorat
const comunitate2025 = [
  {
    ref: "Numeri 6.24-25",
    text: "Domnul să te binecuvânteze şi să te păzească! Domnul să facă să lumineze Faţa Lui peste tine şi să Se îndure de tine!",
  },
  {
    ref: "Estera 4.14",
    text: "Căci, dacă vei tăcea acum, ajutorul şi izbăvirea vor veni din altă parte pentru iudei, şi tu şi casa tatălui tău veţi pieri. Şi cine ştie dacă nu pentru o vreme ca aceasta ai ajuns la împărăţie?",
  },
  {
    ref: "Luca 4.18",
    text: "Duhul Domnului este peste Mine, pentru că M-a uns să vestesc săracilor Evanghelia, M-a trimis să tămăduiesc pe cei cu inima zdrobită, să propovăduiesc robilor de război slobozirea şi orbilor, căpătarea vederii…",
  },
  {
    ref: "Luca 6.37",
    text: "Nu judecaţi, şi nu veţi fi judecaţi; nu osândiţi, şi nu veţi fi osândiţi; iertaţi, şi vi se va ierta.",
  },
  {
    ref: "Luca 9.23",
    text: "Dacă voieşte cineva să vină după Mine, să se lepede de sine, să-şi ia crucea în fiecare zi şi să Mă urmeze.",
  },
  {
    ref: "Luca 10.27",
    text: "El a răspuns: „Să iubeşti pe Domnul Dumnezeul tău cu toată inima ta, cu tot sufletul tău, cu toată puterea ta şi cu tot cugetul tău şi pe aproapele tău ca pe tine însuţi.”",
  },
  {
    ref: "Luca 11.9",
    text: "De aceea şi Eu vă spun: „Cereţi, şi vi se va da; căutaţi, şi veţi găsi; bateţi, şi vi se va deschide.”",
  },
  {
    ref: "Luca 12.15",
    text: "Apoi le-a zis: „Vedeţi şi păziţi-vă de orice fel de lăcomie de bani, căci viaţa cuiva nu stă în belşugul avuţiei lui.”",
  },
  {
    ref: "Luca 12.32",
    text: "Nu te teme, turmă mică, pentru că Tatăl vostru vă dă cu plăcere Împărăţia.",
  },
  {
    ref: "Luca 19.10",
    text: "Pentru că Fiul omului a venit să caute şi să mântuiască ce era pierdut.",
  },
  {
    ref: "Luca 21.33",
    text: "Cerul şi pământul vor trece, dar cuvintele Mele nu vor trece.",
  },
];

function createVerseCard(verse) {
  const card = document.createElement("div");
  card.className = "verse-card";

  const ref = document.createElement("div");
  ref.className = "verse-ref";
  ref.textContent = verse.ref;

  const text = document.createElement("div");
  text.className = "verse-text blurred";
  text.textContent = verse.text;

  let clickCount = 0;
  text.addEventListener("click", function () {
    clickCount++;
    if (clickCount === 1) {
      // Show only the first word
      const firstWord = verse.text.split(" ")[0];
      text.innerHTML =
        `<span class="first-word">${firstWord}</span>` +
        `<span class="rest-blur">${verse.text.slice(firstWord.length)}</span>`;
      text.classList.remove("blurred");
      text.classList.add("partial");
    } else if (clickCount === 2) {
      // Show the full verse
      text.textContent = verse.text;
      text.classList.remove("partial");
      text.classList.remove("blurred");
    }
  });

  card.appendChild(ref);
  card.appendChild(text);
  return card;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function showActionButtons(show) {
  const actionButtons = document.getElementById("action-buttons");
  actionButtons.style.display = show ? "flex" : "none";
}

function showHero(show) {
  const hero = document.querySelector(".hero");
  if (hero) hero.style.display = show ? "block" : "none";
}

function renderVerses(collection) {
  const versesSection = document.getElementById("verses-section");
  versesSection.innerHTML = "";
  let verses = [];
  if (collection === "comunitate2025") {
    verses = comunitate2025.slice();
  }
  shuffleArray(verses);
  verses.forEach((verse) => {
    versesSection.appendChild(createVerseCard(verse));
  });
  versesSection.style.display = "block";
  showActionButtons(true);
  showHero(false);
}

function setupCollectionSelector() {
  const section = document.getElementById("collection-select-section");
  const versesSection = document.getElementById("verses-section");
  const backBtn = document.getElementById("back-btn");
  const refreshBtn = document.getElementById("refresh-btn");
  let currentCollection = null;

  section.addEventListener("click", function (e) {
    if (e.target.classList.contains("collection-btn")) {
      currentCollection = e.target.getAttribute("data-collection");
      section.style.display = "none";
      renderVerses(currentCollection);
      versesSection.scrollIntoView({ behavior: "smooth" });
    }
  });

  backBtn.addEventListener("click", function () {
    versesSection.style.display = "none";
    section.style.display = "flex";
    showActionButtons(false);
    showHero(true);
  });

  refreshBtn.addEventListener("click", function () {
    if (currentCollection) {
      renderVerses(currentCollection);
    }
  });
  // Show hero on load
  showHero(true);
}

document.addEventListener("DOMContentLoaded", setupCollectionSelector);
