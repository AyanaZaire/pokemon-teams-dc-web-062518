const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener('DOMContentLoaded', function(){
  getFetch()
})

function render(trainer){
  let main = document.querySelector('main')
  let div = document.createElement('div')
  let p = document.createElement('p')
  div.className = 'card'
  div.id = `div-${trainer.id}`
  let addButton = document.createElement('button')
  addButton.id = `add-button-${trainer.id}`
  let ul = document.createElement('ul')
  ul.id = `ul-${trainer.id}`
  // let releaseButton = document.createElement('button')
  // releaseButton.className = 'release'
  // releaseButton.id = `release-button-${trainer.id}`

  main.appendChild(div)
  div.appendChild(p)
  div.appendChild(addButton)
  div.appendChild(ul)

  p.innerHTML = `${trainer.name}`
  addButton.innerHTML = 'Add Pokemon'
  let pokemonArray = trainer.pokemons
  let trainerId = div.id.split('-')[1]
  // let pokemonId
  pokemonArray.forEach(pokemon => {
    // pokemonId = pokemon.id
    if (pokemon.trainer_id == trainerId){
      let ulElement = document.getElementById(`ul-${trainer.id}`)
      ulElement.innerHTML += `<li>${pokemon.nickname} (${pokemon.species})` + '<button class=' + 'release id=' + `pokemon-${pokemon.id}` + '> Release </button>' + '</li>'
    }
  })

  addButton.addEventListener('click', addClickHandler)

  pokemonArray.forEach(pokemon => {
    let releaseButton = document.getElementById(`pokemon-${pokemon.id}`)
    releaseButton.addEventListener('click', releaseClickHandler)
  })

}

function getFetch(){
  fetch(TRAINERS_URL)
  .then(response => response.json())
  .then(json => {
    // console.log(json)
    json.forEach( trainer => {
      // console.log(trainer)
      render(trainer)
    })
  })
}

function addClickHandler(event){
  // debugger
  // console.log(event.target)
  trainerId = parseInt(event.target.id.split("-")[2])
  fetch(POKEMONS_URL, {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      trainer_id: trainerId
    })
  })
  .then(response => response.json())
  .then(json => {
    // debugger
    // console.log(json)
    let ulElement = document.getElementById(`ul-${trainerId}`)
    if (ulElement.querySelectorAll('li').length >= 6) {
      alert("Cant Add More Than 6 Pokemon!")
    } else {
      let pokemon = json
      let ulElement = document.getElementById(`ul-${trainerId}`)
      ulElement.innerHTML += `<li>${pokemon.nickname} (${pokemon.species})` + '<button class=' + 'release id=' + `pokemon-${pokemon.id}` + '> Release </button>' + '</li>'
    }
  })
}

function releaseClickHandler(event){
  // console.log(event.target.id.split("-")[1])
  event.stopPropagation()
  let pokemonId = event.target.id.split("-")[1]
  fetch(`http://localhost:3000/pokemons/${pokemonId}`, {
    method: "DELETE"
  })
  .then(response => response.json())
  .then(json => {
    let pokemonElement = event.target.parentNode
    let ulElement = event.target.parentNode.parentNode
    ulElement.removeChild(pokemonElement)
  })
}
