const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

let modal = document.getElementsByClassName("modal")[0];

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" onclick="openPokemonCard(${pokemon.id})">
            <span class="number">${"000".slice(0,-String(pokemon.id).length)+pokemon.id}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

function openPokemonCard(pokemon_id) {
    const pokemon = {
        url: `https://pokeapi.co/api/v2/pokemon/${pokemon_id}`,
    }

    pokeApi.getPokemonDetail(pokemon).then((pokemonDetails) => {
        const pokemonCard = document.getElementById("pokemon-profile");
        pokemonCard.innerHTML = generatePokemonCard(pokemonDetails);
        modal.style.display = "block";
    })

}

function closePokemonCard() {
    modal.style.display = "none";    
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
      closePokemonCard();
    }
}

function generatePokemonCard(pokeDetails) {

    function getTypesList(types) {
        let ul = "";
        types.forEach(type => {
            ul += `<li class="${type}">${type}</li>`                 
        });
        return ul
    }
    
    return `
    <div class="profile-header">
        <div class="profile-name">${pokeDetails.name} <span class="profile-id">${"000".slice(0,-String(pokeDetails.id).length)+pokeDetails.id}</span></div>
        <div class="close-button" onclick="closePokemonCard()"></div>
    </div>
    <div class="profile-body">
        <div class="profile-image">
            <img src="${pokeDetails.photo}" alt="">
        </div>
        <div class="profile-info">
            <div class="table-row">
                <div class="table-header">
                    Height
                </div>
                <div class="table-data">${pokeDetails.height} m</div>
            </div>
            <div class="table-row">
                <div class="table-header">
                    Weight
                </div>
                <div class="table-data">${pokeDetails.weight} kg</div>
            </div><div class="table-row">
                <div class="table-header">
                    Ability
                </div>
                <div class="table-data" style="text-transform: capitalize">${pokeDetails.ability}</div>
            </div>                   
        </div>
    </div>
    <div class="stats-info">
        <h1>Stats</h1>
        <table>
            <tr>
            <th>HP</th>
            <td>
                <div class="progress-bar">
                    <div class="progress-level" style="width: ${pokeDetails.stats.hp / 1.5}%;">
                    </div>
                    <div class="progress-label">${pokeDetails.stats.hp}</div>
                </div>
            </td>
            </tr>
            <tr>
                <th>Atack</th>
                <td>
                    <div class="progress-bar">
                        <div class="progress-level" style="width: ${pokeDetails.stats.attack / 1.5}%;">
                        </div>
                        <div class="progress-label">${pokeDetails.stats.attack}</div>
                    </div>
                </td>
            </tr>
            <tr>
                <th>Defense</th>
                <td><div class="progress-bar">
                    <div class="progress-level" style="width: ${pokeDetails.stats.defense / 1.5}%;">
                    </div>
                    <div class="progress-label">${pokeDetails.stats.defense}</div>
                </div></td>
            </tr>
            <tr>
                <th>Speed</th>
                <td><div class="progress-bar">
                    <div class="progress-level" style="width: ${pokeDetails.stats.speed / 1.5}%;">
                    </div>
                    <div class="progress-label">${pokeDetails.stats.speed}</div>
                </div></td>
            </tr>
        </table>
    </div>
    <div class="type-info">
        <h1>Type</h1>
        <ul class="type-info-list">
            ${getTypesList(pokeDetails.types)}
        </ul>
    </div>`
}