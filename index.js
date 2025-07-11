// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "2505-Cody";
const API = `${BASE}/${COHORT}`;

const $main = document.getElementById("content");
const $loading = document.getElementById("loading-screen");

// === State ===
let players = [];

// === Loading Control ===
function showLoading() {
  $loading.style.display = "flex";
}

function hideLoading() {
  $loading.style.display = "none";
}

// === Fetch All Players ===
async function fetchAllPlayers() {
  showLoading();
  try {
    const res = await fetch(`${API}/players`);
    const json = await res.json();
    players = json.data.players;
    renderAllPlayers();
  } catch (error) {
    console.error("Failed to fetch players:", error);
    $main.innerHTML = "<p>Unable to load players. Try again later.</p>";
  } finally {
    hideLoading();
  }
}

// === Render All Players ===
function renderAllPlayers() {
  $main.innerHTML = ""; // Clear previous content
  const $ul = document.createElement("ul");
  $ul.classList.add("player-list");

  players.forEach(player => {
    const $li = document.createElement("li");
    $li.classList.add("player-card");

    $li.innerHTML = `
      <h2>${player.name}</h2>
      <img src="${player.imageUrl}" alt="${player.name}" />
    `;

    $ul.appendChild($li);
  });

  $main.appendChild($ul);
}

// === Init ===
fetchAllPlayers();
