const IMG = document.querySelector('img');
const FETCH_BUTTON = document.querySelector('button');
const SOURCE_SELECT = document.querySelector('#sources');

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

class BunniesIO extends AnimalSource {
	constructor() {
		super('bunnies-io')
	}

	fetchRandomImage() {
		return fetch('https://api.bunnies.io/v2/loop/random/?media=mp4,av1')
			.then(response => response.json())
			.then(data => {
				IMG.src = data.media.poster
			})
	}
}

class RandomFox extends AnimalSource {
	constructor() {
		super('randomfox')
	}

	fetchRandomImage() {
		return fetch('https://randomfox.ca/floof/')
			.then(response => response.json())
			.then(data => {
				IMG.src = data.image
			})
	}
}

class FishWatch extends AnimalSource {
	constructor() {
		super('fishwatch')
	}

	fetchRandomImage() {
		return fetch('https://api.codetabs.com/v1/proxy?quest=https://www.fishwatch.gov/api/species')
			.then(response => response.json())
			.then(data => {
				const fish = data[Math.floor(Math.random() * data.length)]
				const images = fish['Image Gallery'];
				images.push(fish['Species Illustration Photo']);
				const image = images[Math.floor(Math.random() * images.length)]
				IMG.src = image.src;
			})
	}
}

const SOURCES = [RandomDuck, AxoltlAPI, ZooAnimalAPI, DogCEO, BunniesIO, RandomFox, FishWatch]

function fetchRandomImage() {
	const selectedID = SOURCE_SELECT.value;

	const source = selectedID
		? SOURCES.find(source => new source().id === selectedID)
		: SOURCES[Math.floor(Math.random() * SOURCES.length)];

	return new source().fetchRandomImage();
}

FETCH_BUTTON.addEventListener('click', () => fetchRandomImage())


for (const source of SOURCES) {
	const instance = new source();

	const option = document.createElement('option')
	option.value = instance.id
	option.textContent = instance.id

	SOURCE_SELECT.appendChild(option);
}