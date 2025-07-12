
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

// === Fetch Single Player By ID ===
async function fetchPlayerById(id) {
  showLoading();
  try {
    const res = await fetch(`${API}/players/${id}`);
    const json = await res.json();
    return json.data.player;
  } catch (error) {
    console.error("Failed to fetch player by ID:", error);
    $main.innerHTML = "<p>Unable to load player details.</p>";
  } finally {
    hideLoading();
  }
}


=======
// === Render Default Message ===
function renderDefaultMessage() {
  const $message = document.createElement("section");
  $message.className = "default-message";
  $message.innerHTML = `<p>Select a puppy to see more details.</p>`;
  $main.appendChild($message);
}


// === Render All Players ===
function renderAllPlayers() {
  $main.innerHTML = "";
  const $ul = document.createElement("ul");
  $ul.classList.add("player-list");


  players.forEach(player => {
=======
  players.forEach((player) => {
=======
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

      <button class="details-btn">See Details</button>
    `;

    
=======

      <button class="details-btn">See Details</button>
      <button class="remove-btn">Remove Player</button>
    `;

    // Details button event

    const $detailsBtn = $li.querySelector(".details-btn");
    $detailsBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      renderSinglePlayer(player.id);
    });


    $ul.appendChild($li);
  });

  $main.appendChild($ul);
=======
    // Remove button event
    const $removeBtn = $li.querySelector(".remove-btn");
    $removeBtn.addEventListener("click", async (event) => {
      event.stopPropagation();
      const confirmRemove = confirm(
        `Are you sure you want to remove ${player.name} from the roster?`
      );
      if (!confirmRemove) return;
      showLoading();
      try {
        await removePlayerById(player.id);
        await fetchAllPlayers();
      } catch (err) {
        console.error(err);
      } finally {
        hideLoading();
      }
    });

    $ul.appendChild($li);
  });

renderDefaultMessage();
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

=======
    document.getElementById("back-btn").addEventListener("click", () => {
      fetchAllPlayers();
    });

  } catch (error) {
    console.error("Error rendering single player:", error);
    $main.innerHTML = "<p>Error loading player details.</p>";
  } finally {
    hideLoading();
  }
}


=======
// === Remove Player By ID ===
async function removePlayerById(id) {
  try {
    const res = await fetch(`${API}/players/${id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (!json.success) {
      throw new Error("Failed to remove player");
    }
  } catch (error) {
    console.error("Failed to remove player:", error);
    alert("Could not remove player.");
  }
=======
    `;

    $ul.appendChild($li);
  });

  $main.appendChild($ul);

}


// === Init ===
fetchAllPlayers();
