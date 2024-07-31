const CharacterId = document.getElementById('CharacterId')
const Content = document.getElementById('Content')
const Image = document.getElementById('Image')
const GoButton = document.getElementById('GoButton')
const CleanButton = document.getElementById('CleanButton')

const fetchAllCharacters = () => {
    return fetch('https://rickandmortyapi.com/api/character')
        .then(response => response.json())
        .then(data => {
            return data.results
        })
}

const fetchApi = value => {
    const result = fetch(`https://rickandmortyapi.com/api/character/${value}`)
        .then(response => response.json())
        .then(data => {
            return data
        })
    return result
}

const displayAllCharacters = async () => {
    const resultAll = await fetchAllCharacters()
    Content.innerHTML = '' // Limpa o conteúdo antes de adicionar novos elementos

    resultAll.forEach(character => {
        const characterDiv = document.createElement('div')
        characterDiv.classList.add('character')

        const characterInfo = document.createElement('pre')
        characterInfo.textContent = JSON.stringify(character, null, 2)

        const characterImage = document.createElement('img')
        characterImage.src = character.image
        characterImage.alt = character.name

        characterDiv.appendChild(characterInfo)
        characterDiv.appendChild(characterImage)

        Content.appendChild(characterDiv)
    })
}

const keys = ['episode', 'gender', 'name', 'origin', 'species', 'status'] //cria um array com as keys do input checkbox

/**
 * Generates a new object based on the checked checkboxes and their corresponding values from the result object.
 *
 * @param {Object} result - The result object containing the data to be filtered.
 * @return {Object} A new object containing the filtered data based on the checked checkboxes.
 */
const resultCheck = result => {
    const newObject = {}

    keys.map(key => document.getElementById(key)).map(element => {
        if (element.checked) {
            newObject[element.name] = result[element.name]
        }
    })

    return newObject
}

GoButton.addEventListener('click', async event => {
    event.preventDefault() // previne o comportamento padrão do botão (recarregar a página)
    const checkIsChecked = keys.some(
        key => document.getElementById(key).checked
    )
    const resultSearch = await fetchApi(CharacterId.value)
    if (CharacterId.value && checkIsChecked) {
        // Content.textContent = `${JSON.stringify(resultSearch, null, 2)}` //só é possível usar essas config add usando o pre no html
        Content.textContent = JSON.stringify(resultCheck(resultSearch), null, 2)
        Image.src = `${resultSearch.image}`
    } else if (CharacterId.value && !checkIsChecked) {
        // Content.textContent = `${JSON.stringify(resultSearch, null, 2)}` //só é possível usar essas config add usando o pre no html
        Content.textContent = JSON.stringify(resultSearch, null, 2)
        Image.src = `${resultSearch.image}`
    } else if (!CharacterId.value && checkIsChecked) {
        const resultAll = await fetchAllCharacters()
        const resultAllChecked = resultAll.map(character =>
            resultCheck(character)
        )
        resultAll.forEach(character => (Image.src = character.image))

        Content.textContent = JSON.stringify(resultAllChecked, null, 2)
    } else {
        displayAllCharacters()
    }
})

CleanButton.addEventListener('click', event => {
    event.preventDefault() // previne o comportamento padrão do botão (recarregar a página)
    CharacterId.value = ''
    Content.textContent = ''
    Image.src = ''
    keys.map(key => document.getElementById(key)).forEach(
        element => (element.checked = false)
    )
    displayAllCharacters()
})

window.addEventListener('load', displayAllCharacters)
