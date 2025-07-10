// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2505-Cody"; // Make sure to change this!
const API = BASE + COHORT;

const API_URL = "https://fsa-puppy-bowl.herokuapp.com/api/2505-FTB-CT-WEB-PT";
const $form = document.querySelector("form");
const $main = document.querySelector("main");
const $loading = document.querySelector("#loading-screen")
let teams = [];

function showLoading () {
    $loading.setAttribute("style", "display:flex;");
}

function hideLoading () {
    $loading.setAttribute("style", "display:none;");
}

async function fetchAllPlayers () {
    try {
        // see "Get all players"
    } catch (err) {
        console.error(err.message);
    }
}

async function createPlayer (name, breed, imageUrl) {
    try {
        // see "Invite a new player"
        // remember methods and headers
        return json.data.newPlayer;
    } catch (err) {
        console.error(err.message);
    }
}

async function fetchPlayerById (id) {
    try {
        // see "Get a player by ID"
    } catch (err) {
        console.error(err.message);
    }
}

async function removePlayerById (id) {
    try {
        // see "Remove a player by ID"
        // remember to set method
    } catch (err) {
        console.error(err.message);
    }
}

async function fetchAllTeams () {
    try {
        // see "Get all teams"
    } catch (err) {
        console.error(err.message);
    }
}

async function renderAllPlayers () {
    const playerList = await fetchAllPlayers();
    // console.log(playerList);
    const $players = document.createElement("ul");
    $players.id = "player-list";
    playerList.forEach(player => {
        const $player = document.createElement("li");
        $player.className = "player-card";
        $player.innerHTML += `
        <h2>${player.name}</h2>
        <p>${player.breed}</p>
        <img src="${player.imageUrl}" alt="Picture of ${player.name}" />
        <section class="player-actions">
            <button class="details-btn">See Details</button>
            <button class="remove-btn">Remove Player</button>
        </section>
        `;
        $detailsBtn = $player.querySelector(".details-btn");
        $removeBtn = $player.querySelector(".remove-btn");

        $detailsBtn.addEventListener("click", async () => {
            showLoading();
            try {
                await renderSinglePlayer(player.id);
            } catch (err) {
                console.error(err.message);
            } finally {
                hideLoading();
            }
        });

        $removeBtn.addEventListener("click", async () => {
            try {
                const confirmRemove = confirm(`Are you sure you want to remove ${player.name} from the roster?`);
                if (!confirmRemove) return;
                showLoading();
                await removePlayerById(player.id);
                await renderAllPlayers();
            } catch (err) {
                console.error(err.message);
            } finally {
                hideLoading();
            }
        })

        $players.appendChild($player);
    });

    $main.innerHTML = "";
    $main.appendChild($players);
}

async function renderSinglePlayer (id) {
    const player = await fetchPlayerById(id);
    
    $main.innerHTML = `
    <section id="single-player">
        <h2>${player.name}/${player.team?.name || "Unassigned"} - ${player.status}</h2>
        <p>${player.breed}</p>
        <img src="${player.imageUrl}" alt="Picture of ${player.name}" />
        <button id="back-btn">Back to List</button>
    </section>
    `;

    $main.querySelector("#back-btn").addEventListener("click", async () => {
        showLoading();
        try {
            await renderAllPlayers();
        } catch (err) {
            console.error(err.message);
        } finally {
            hideLoading();
        }
    });
}

async function init () {
    try {
        await renderAllPlayers();
        teams = await fetchAllTeams();
    } catch (err) {
        console.error(err);
    } finally {
        hideLoading();
    }
}

$form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.querySelector("#new-name").value;
    const breed = document.querySelector("#new-breed").value;
    const image = document.querySelector("#new-image").value;
    
    showLoading();
    try {
        await createPlayer(name, breed, image);
        renderAllPlayers();
    } catch (err) {
        console.error(err.message);
    } finally {
        document.querySelector("#new-name").value = "";
        document.querySelector("#new-breed").value = "";
        document.querySelector("#new-image").value = "";
        hideLoading();
    }
})

init();
// createPlayer("tobey","dachshund","https://www.vidavetcare.com/wp-content/uploads/sites/234/2022/04/dachshund-dog-breed-info.jpeg");
// fetchAllPlayers();
// fetchPlayerById(38967);
// removePlayerById(38967);
// fetchAllTeams();