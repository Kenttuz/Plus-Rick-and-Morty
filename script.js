const CharacterId = document.getElementById('CharacterId')
const CharacterName = document.getElementById('CharacterName')
const Content = document.getElementById('Content')
const CharacterImage = document.getElementById('CharacterImage')
const GoButton = document.getElementById('GoButton')
const CleanButton = document.getElementById('CleanButton')

const fetchAllCharacters = (params = '') => {
    return fetch(`https://rickandmortyapi.com/api/character${params}`)
        .then(response => response.json())
        .then(data => {
            return data.results
        })
}

const fetchCharacterById = value => {
    const result = fetch(`https://rickandmortyapi.com/api/character/${value}`)
        .then(response => response.json())
        .then(data => {
            return [data]
        })
    return result
}

const fetchCharactersByName = name => {
    return fetch(`https://rickandmortyapi.com/api/character/?name=${name}`)
        .then(response => response.json())
        .then(data => {
            return data.results
        })
}

// Função para exibir os personagens com base nos campos selecionados
const displayCharacters = (characters, filters) => {
    Content.innerHTML = '' // Limpa o conteúdo antes de adicionar novos elementos
    characters.forEach(character => {
        const characterInfo = document.createElement('div')
        characterInfo.className = 'character flex gap-2 max-md:mx-3 flex-col'

        const characterImage = document.createElement('img')
        characterImage.className = 'w-full max-h-[90%]'
        characterImage.src = character.image
        characterImage.alt = character.name
        characterInfo.appendChild(characterImage)

        if (filters.length === 0) {
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
                    Array.isArray(character[key])
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
        } else {
            filters.forEach(key => {
                if (character.hasOwnProperty(key)) {
                    const infoParagraph = document.createElement('p')
                    if (key === 'origin') {
                        infoParagraph.innerHTML = `<strong>${key}:</strong> ${character[key].name}`
                    } else {
                        infoParagraph.innerHTML = `<strong>${key}:</strong> ${character[key]}`
                    }
                    characterInfo.appendChild(infoParagraph)
                }
            })
        }

        Content.appendChild(characterInfo)
    })
}

const getQueryParams = () => {
    let params = []
    if (CharacterName.value) params.push(`name=${CharacterName.value}`)
    const checkboxes = document.querySelectorAll(
        'input[type="checkbox"]:checked'
    )
    checkboxes.forEach(checkbox => {
        const value = checkbox.getAttribute('value')
        if (value) {
            params.push(`${checkbox.name}=${value}`)
        }
    })

    return params.length ? `?${params.join('&')}` : ''
}

const getSelectedFilters = () => {
    const filters = ['name', 'status', 'gender', 'species', 'origin', 'episode']
    return filters.filter(key => {
        const checkbox = document.getElementById(key)
        return checkbox && checkbox.checked
    })
}
/*
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
*/

const keys = ['name', 'status', 'gender', 'species', 'origin', 'episode'] //cria um array com as keys do input checkbox

/**
 * Generates a new object based on the checked checkboxes and their corresponding values from the result object.
 *
 * @param {Object} result - The result object containing the data to be filtered.
 * @return {Object} A new object containing the filtered data based on the checked checkboxes.

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
} */

GoButton.addEventListener('click', async event => {
    event.preventDefault() // previne o comportamento padrão do botão (recarregar a página)
    Content.innerHTML = '' // Limpa o conteúdo antes de adicionar novos elementos

    const queryParams = getQueryParams()
    const selectedFilters = getSelectedFilters()

    if (CharacterId.value) {
        const character = await fetchCharacterById(CharacterId.value)
        displayCharacters(character, selectedFilters)
    } else if (CharacterName.value) {
        const characters = await fetchCharactersByName(CharacterName.value)
        displayCharacters(characters, selectedFilters)
    } else if (queryParams) {
        const characters = await fetchAllCharacters(queryParams)
        displayCharacters(characters, selectedFilters)
    } else {
        const allCharacters = await fetchAllCharacters()
        displayCharacters(allCharacters, selectedFilters)
    }
})

CleanButton.addEventListener('click', async event => {
    event.preventDefault() // previne o comportamento padrão do botão (recarregar a página)
    CharacterId.value = ''
    CharacterName.value = ''
    document
        .querySelectorAll('input[type="checkbox"]')
        .forEach(checkbox => (checkbox.checked = false))
    Content.innerHTML = ''
    const allCharacters = await fetchAllCharacters()
    displayCharacters(allCharacters, getSelectedFilters())
})
window.addEventListener('load', async () => {
    const allCharacters = await fetchAllCharacters()
    displayCharacters(allCharacters, getSelectedFilters())
})
