// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "2505-Cody";
const API = `${BASE}/${COHORT}`;

const $main = document.getElementById("content");
const $loading = document.getElementById("loading-screen");
const $form = document.querySelector("form");

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

// === Fetch Single Player By ID ===
async function fetchPlayerById(id) {
  try {
    const res = await fetch(`${API}/players/${id}`);
    const json = await res.json();
    return json.data.player;
  } catch (error) {
    console.error("Failed to fetch player by ID:", error);
    $main.innerHTML = "<p>Unable to load player details.</p>";
  }
}

// === Create Player ===
async function createPlayer(name, breed, imageUrl = "", status = "bench") {
  try {
    const res = await fetch(`${API}/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, breed, imageUrl, status })
    });

    const json = await res.json();

    if (json.success) {
      return json.data.newPlayer;
    } else {
      throw new Error("Failed to create player.");
    }
  } catch (error) {
    console.error("Error creating player:", error);
    alert("Failed to add new puppy. Please try again.");
  }
}

// === Render All Players ===
function renderAllPlayers() {
  $main.innerHTML = "";
  const $ul = document.createElement("ul");
  $ul.classList.add("player-list");

  players.forEach(player => {
    const $li = document.createElement("li");
    $li.classList.add("player-card");

    $li.innerHTML = `
      <h2>${player.name}</h2>
      <img src="${player.imageUrl}" alt="${player.name}" />
      <button class="details-btn">See Details</button>
    `;

    const $detailsBtn = $li.querySelector(".details-btn");
    $detailsBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      renderSinglePlayer(player.id);
    });

    $ul.appendChild($li);
  });

  $main.appendChild($ul);
}

// === Render Single Player Details ===
async function renderSinglePlayer(id) {
  showLoading();
  try {
    const player = await fetchPlayerById(id);

    if (!player) {
      $main.innerHTML = "<p>Player not found.</p>";
      return;
    }

    $main.innerHTML = `
      <section class="single-player">
        <h2>${player.name}</h2>
        <img src="${player.imageUrl}" alt="Picture of ${player.name}" />
        <p><strong>ID:</strong> ${player.id}</p>
        <p><strong>Breed:</strong> ${player.breed}</p>
        <p><strong>Status:</strong> ${player.status}</p>
        <p><strong>Team:</strong> ${player.team?.name || "Unassigned"}</p>
        <button id="back-btn">Back to List</button>
      </section>
    `;

    document.getElementById("back-btn").addEventListener("click", () => {
      renderAllPlayers();
    });

  } catch (error) {
    console.error("Error rendering single player:", error);
    $main.innerHTML = "<p>Error loading player details.</p>";
  } finally {
    hideLoading();
  }
}

// === Form Submit Handler ===
$form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("new-name").value.trim();
  const breed = document.getElementById("new-breed").value.trim();
  const imageUrl = document.getElementById("new-image").value.trim();
  const status = document.getElementById("new-status").value;

  if (!name || !breed) {
    alert("Please enter both name and breed.");
    return;
  }

  showLoading();
  try {
    await createPlayer(name, breed, imageUrl, status);
    await fetchAllPlayers(); // Refresh list
    $form.reset();
  } catch (error) {
    console.error("Form submission error:", error);
  } finally {
    hideLoading();
  }
});

// === Init ===
fetchAllPlayers();
