const IMG = document.querySelector('img');
const FETCH_BUTTON = document.querySelector('button');
const SOURCE_SELECT = document.querySelector('#sources');

class AnimalSource {
	constructor(id, name) {
		this.id = id;
		this.name = name;
		this.lastSaved = 0;
	}

	isStale(){
		return Date.now() - this.lastSaved > 86400000;
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
		super('random-duck', 'Random Duck')
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
		super('axoltlapi', 'Axoltl API')
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
		super('zoo-animal-api', 'Zoo Animal API')
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
		super('dog-ceo', 'Dog CEO')
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
		super('bunnies-io', 'Bunnies IO')
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
		super('randomfox', 'Random Fox')
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
		super('fishwatch', 'Fish Watch')
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
		super('random.dog', 'Random Dog')
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

class ElephantAPI extends AnimalSource {
	constructor() {
		super('elephant-api', 'Elephant API')
		this.filenames = [];
	}

	async fetchRandomImage() {
		if (this.isStale()) {
			this.filenames = await fetch('https://api.codetabs.com/v1/proxy?quest=https://elephant-api.herokuapp.com/elephants')
				.then(response => response.json())
				.then(data =>
					data.map(elephant => elephant.image)
						.filter(url => url && url !== "https://elephant-api.herokuapp.com/pictures/missing.jpg")
						.map(url => url.split('/').at(-1))
				);
			this.save();
		}

		const filename = this.filenames[Math.floor(Math.random() * this.filenames.length)]
		IMG.src = 'https://elephant-api.herokuapp.com/pictures/' + filename;
	}
}

class TheCatAPI extends AnimalSource {
	constructor() {
		super('thecatapi', 'The Cat API')
	}

	fetchRandomImage() {
		return fetch('https://api.thecatapi.com/v1/images/search')
			.then(response => response.json())
			.then(data => {
				IMG.src = data[0].url
			})
	}
}

class Shibe extends AnimalSource {
	constructor() {
		super('shibe', 'Shibe')
	}

	fetchRandomImage() {
		return fetch('https://api.codetabs.com/v1/proxy?quest=http://shibe.online/api/shibes?count=1&urls=true')
			.then(response => response.json())
			.then(data => {
				IMG.src = data[0]
			})
	}
}


/** @type {AnimalSource[]} */
const SOURCES = [RandomDuck, AxoltlAPI, ZooAnimalAPI, DogCEO, BunniesIO, RandomFox, FishWatch, RandomDog, ElephantAPI, TheCatAPI, Shibe].map(Source => new Source().load());

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
	option.textContent = source.name

	SOURCE_SELECT.appendChild(option);
}