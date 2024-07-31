const CharacterId = document.getElementById('CharacterId')
const Content = document.getElementById('Content')
const CharacterImage = document.getElementById('CharacterImage')
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

    resultAll.map(character => {
        const characterDiv = document.createElement('div')
        characterDiv.className = 'character flex gap-2 max-md:mx-3 flex-col'
        const characterInfo = document.createElement('div')
        const characterImage = document.createElement('img')
        characterImage.className = '"w-full max-h-[90%]'

        characterImage.src = character.image
        characterImage.alt = character.name

        characterDiv.appendChild(characterImage)
        characterDiv.appendChild(characterInfo)

        Content.appendChild(characterDiv)
        for (const key in character) {
            if (
                character.hasOwnProperty(key) &&
                key !== 'image' &&
                key !== 'type' &&
                key !== 'url' &&
                key !== 'created' &&
                typeof character[key] !== 'object'
            ) {
                const infoParagraph = document.createElement('p')
                infoParagraph.innerHTML = `<strong>${key}:</strong> ${character[key]}`
                characterInfo.appendChild(infoParagraph)
            } else if (
                character.hasOwnProperty(key) &&
                Array.isArray(character[key]) === true
            ) {
                const resultArray = character[key].join('\r\n')
                const infoParagraph = document.createElement('p')
                infoParagraph.innerHTML = `<strong>${key}:</strong> ${resultArray}`
                characterInfo.appendChild(infoParagraph)
            } else if (character.hasOwnProperty(key) && key === 'origin') {
                const infoParagraph = document.createElement('p')
                infoParagraph.innerHTML = `<strong>${key}:</strong> ${character[key].name}`
                characterInfo.appendChild(infoParagraph)
            }
        }
    })
}

const keys = ['name', 'status', 'gender', 'species', 'origin', 'episode'] //cria um array com as keys do input checkbox

/**
 * Generates a new object based on the checked checkboxes and their corresponding values from the result object.
 *
 * @param {Object} result - The result object containing the data to be filtered.
 * @return {Object} A new object containing the filtered data based on the checked checkboxes.
 */
const resultCheck = result => {
    const characterDiv = document.createElement('div')
    characterDiv.className = 'character flex gap-2 max-md:mx-3 flex-col'
    const characterInfo = document.createElement('div')
    const characterImage = document.createElement('img')
    characterImage.className = '"w-full max-h-[90%]'

    characterImage.src = result.image
    characterImage.alt = result.name

    characterDiv.appendChild(characterImage)
    characterDiv.appendChild(characterInfo)

    Content.appendChild(characterDiv)

    keys.map(key => document.getElementById(key)).map(element => {
        if (
            element.checked === true &&
            typeof result[element.name] !== 'object'
        ) {
            const newTextElem = document.createElement('p')
            newTextElem.innerHTML = `
            <strong>${element.name}:</strong> ${result[element.name]}`
            characterInfo.appendChild(newTextElem)
        } else if (
            element.checked === true &&
            Array.isArray(result[element.name]) === true
        ) {
            const resultArray = result[element.name].join('\r\n')
            const newTextElem = document.createElement('p')
            newTextElem.innerHTML = `
            <strong>${element.name}:</strong> ${resultArray}`
            characterInfo.appendChild(newTextElem)
        } else if (element.checked === true && element.name === 'origin') {
            const newTextElem = document.createElement('p')
            newTextElem.innerHTML = `
            <strong>${element.name}:</strong> ${result[element.name].name}`
            characterInfo.appendChild(newTextElem)
        }
    })
}

GoButton.addEventListener('click', async event => {
    event.preventDefault() // previne o comportamento padrão do botão (recarregar a página)
    Content.innerHTML = '' // Limpa o conteúdo antes de adicionar novos elementos
    const checkIsChecked = keys.some(
        key => document.getElementById(key).checked
    )
    if (CharacterId.value === '' && !checkIsChecked) {
        alert('É necessário fazer um filtro antes de pesquisar!!')
        displayAllCharacters()
    } else {
        if (CharacterId.value && checkIsChecked) {
            const resultSearch = await fetchApi(CharacterId.value)
            resultCheck(resultSearch)
        } else if (CharacterId.value && !checkIsChecked) {
            const resultSearch = await fetchApi(CharacterId.value)
            Content.innerHTML = `
            <p><strong>Name:</strong> ${resultSearch.name}</p>
            <p><strong>Status:</strong> ${resultSearch.status}</p>
            <p><strong>Specie:</strong> ${resultSearch.species}</p>
            <p><strong>Gender:</strong> ${resultSearch.gender}</p>`

            const characterDiv = document.createElement('div')
            characterDiv.className = 'character flex gap-2 max-md:mx-3 flex-col'
            const characterInfo = document.createElement('div')
            const characterImage = document.createElement('img')
            characterImage.className = '"w-full max-h-[90%]'

            characterImage.src = resultSearch.image
            characterImage.alt = resultSearch.name

            characterDiv.appendChild(characterImage)
            characterDiv.appendChild(characterInfo)

            Content.appendChild(characterDiv)

            Content.appendChild(characterDiv)
        } else if (!CharacterId.value && checkIsChecked) {
            const resultAll = await fetchAllCharacters()
            resultAll.forEach(character => {
                resultCheck(character)
            })
        } else {
            displayAllCharacters()
        }
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
