const IMG = document.querySelector('img');
const FETCH_BUTTON = document.querySelector('button');

class AnimalSource {
	constructor(id) {
		this.id = id;
	}

	fetchRandomImage() {
		throw new Error('Not Yet Implemented')
	}
}

class RandomDuck extends AnimalSource {
	constructor() {
		super('random-duck')
	}

	fetchRandomImage() {
		return fetch('https://api.codetabs.com/v1/proxy?quest=https://random-d.uk/api/v2/random')
			.then(response => response.json())
			.then(data => {
				IMG.src = data.url
			})
	}
}

class AxoltlAPI extends AnimalSource {
	constructor() {
		super('axoltlapi')
	}

	fetchRandomImage() {
		return fetch('https://api.codetabs.com/v1/proxy?quest=https://axoltlapi.herokuapp.com/')
			.then(response => response.json())
			.then(data => {
				IMG.src = data.url
			})
	}
}

class ZooAnimalAPI extends AnimalSource {
	constructor() {
		super('zoo-animal-api')
	}

	fetchRandomImage() {
		return fetch('https://zoo-animal-api.herokuapp.com/animals/rand')
			.then(response => response.json())
			.then(data => {
				IMG.src = data.image_link
			})
	}
}

class DogCEO extends AnimalSource {
	constructor() {
		super('dog-ceo')
	}

	fetchRandomImage() {
		return fetch('https://dog.ceo/api/breeds/image/random')
			.then(response => response.json())
			.then(data => {
				IMG.src = data.message
			})
	}
}

const SOURCES = [RandomDuck, AxoltlAPI, ZooAnimalAPI, DogCEO]

function fetchRandomImage() {
	const source = SOURCES[Math.floor(Math.random() * SOURCES.length)]
	return new source().fetchRandomImage();
}

FETCH_BUTTON.addEventListener('click', () => fetchRandomImage())
