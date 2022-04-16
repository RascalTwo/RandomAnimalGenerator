const IMG = document.querySelector('img');
const FETCH_BUTTON = document.querySelector('button');
const SOURCE_SELECT = document.querySelector('#sources');

class AnimalSource {
	constructor(id) {
		this.id = id;
		this.lastSaved = 0;
	}

	isStale(){
		const diff = Date.now() - this.lastSaved;
		return diff > 86400000;
	}

	load(){
		const localData = localStorage.getItem('urag-' + this.id);
		if (!localData) return this;
		Object.assign(this, JSON.parse(localData));

		return this;
	}

	save(){
		this.lastSaved = Date.now();
		localStorage.setItem('urag-' + this.id, JSON.stringify(this))
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
		this.fishes = [];
	}

	async fetchRandomImage() {
		if (this.isStale()) {
			this.fishes = await fetch('https://api.codetabs.com/v1/proxy?quest=https://www.fishwatch.gov/api/species').then(response => response.json())
			this.save();
		}

		const fish = this.fishes[Math.floor(Math.random() * this.fishes.length)]
		const images = fish['Image Gallery'];
		images.push(fish['Species Illustration Photo']);
		const image = images[Math.floor(Math.random() * images.length)]
		IMG.src = image.src;
	}
}

class RandomDog extends AnimalSource {
	constructor() {
		super('random.dog')
		this.filenames = [];
	}

	async fetchRandomImage() {
		if (this.isStale()) {
			this.filenames = await fetch('https://random.dog/doggos').then(response => response.json())
			this.save();
		}

		let filename = '';
		do {
			filename = this.filenames[Math.floor(Math.random() * this.filenames.length)]
		} while(filename.endsWith('.mp4'));

		IMG.src = 'https://random.dog/' + filename;
	}
}

/** @type {AnimalSource[]} */
const SOURCES = [RandomDuck, AxoltlAPI, ZooAnimalAPI, DogCEO, BunniesIO, RandomFox, FishWatch, RandomDog].map(Source => new Source().load());

function fetchRandomImage() {
	const selectedID = SOURCE_SELECT.value;

	const source = selectedID
		? SOURCES.find(source => source.id === selectedID)
		: SOURCES[Math.floor(Math.random() * SOURCES.length)];

	return source.fetchRandomImage();
}

FETCH_BUTTON.addEventListener('click', () => fetchRandomImage())


for (const source of SOURCES) {
	const option = document.createElement('option')
	option.value = source.id
	option.textContent = source.id

	SOURCE_SELECT.appendChild(option);
}