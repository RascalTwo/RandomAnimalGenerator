const IMG = document.querySelector('img');
const FETCH_BUTTON = document.querySelector('button');
const SOURCE_SELECT = document.querySelector('#sources');
const SPECIES_SELECT = document.querySelector('#species');
const FIELDSET = document.querySelector('fieldset');

class AnimalSource {
	constructor(id, name, ...species) {
		this.id = id;
		this.name = name;
		this.lastSaved = 0;
		this.species = species
	}

	isStale() {
		return Date.now() - this.lastSaved > 86400000;
	}

	load() {
		const localData = localStorage.getItem('urag-' + this.id);
		if (!localData) return this;
		Object.assign(this, JSON.parse(localData));

		return this;
	}

	save() {
		this.lastSaved = Date.now();
		localStorage.setItem('urag-' + this.id, JSON.stringify(this))
	}

	fetchRandomImage() {
		throw new Error('Not Yet Implemented')
	}
}

class RandomDuck extends AnimalSource {
	constructor() {
		super('random-duck', 'Random Duck', 'Bird')
	}

	fetchRandomImage() {
		return fetch('https://api.codetabs.com/v1/proxy?quest=https://random-d.uk/api/v2/random')
			.then(response => response.json())
			.then(data => data.url)
	}
}

class AxoltlAPI extends AnimalSource {
	constructor() {
		super('axoltlapi', 'Axoltl API', 'Axolotl')
	}

	fetchRandomImage() {
		return fetch('https://api.codetabs.com/v1/proxy?quest=https://axoltlapi.herokuapp.com/')
			.then(response => response.json())
			.then(data => data.url)
	}
}

class ZooAnimalAPI extends AnimalSource {
	constructor() {
		super('zoo-animal-api', 'Zoo Animal API')
	}

	fetchRandomImage() {
		return fetch('https://zoo-animal-api.herokuapp.com/animals/rand')
			.then(response => response.json())
			.then(data => data.image_link)
	}
}

class DogCEO extends AnimalSource {
	constructor() {
		super('dog-ceo', 'Dog CEO', 'Dog')
	}

	fetchRandomImage() {
		return fetch('https://dog.ceo/api/breeds/image/random')
			.then(response => response.json())
			.then(data => data.message)
	}
}

class BunniesIO extends AnimalSource {
	constructor() {
		super('bunnies-io', 'Bunnies IO', 'Bunny')
	}

	fetchRandomImage() {
		return fetch('https://api.bunnies.io/v2/loop/random/?media=mp4,av1')
			.then(response => response.json())
			.then(data => data.media.poster)
	}
}

class RandomFox extends AnimalSource {
	constructor() {
		super('randomfox', 'Random Fox', 'Fox')
	}

	fetchRandomImage() {
		return fetch('https://randomfox.ca/floof/')
			.then(response => response.json())
			.then(data => data.image)
	}
}

class FishWatch extends AnimalSource {
	constructor() {
		super('fishwatch', 'Fish Watch', 'Fish')
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
		return image.src;
	}
}

class RandomDog extends AnimalSource {
	constructor() {
		super('random.dog', 'Random Dog', 'Dog')
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
		} while (filename.endsWith('.mp4'));

		return 'https://random.dog/' + filename;
	}
}

class ElephantAPI extends AnimalSource {
	constructor() {
		super('elephant-api', 'Elephant API', 'Elephant')
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
		return 'https://elephant-api.herokuapp.com/pictures/' + filename;
	}
}

class TheCatAPI extends AnimalSource {
	constructor() {
		super('thecatapi', 'The Cat API', 'Cat')
	}

	fetchRandomImage() {
		return fetch('https://api.thecatapi.com/v1/images/search')
			.then(response => response.json())
			.then(data => data[0].url)
	}
}

class Shibe extends AnimalSource {
	constructor() {
		super('shibe', 'Shibe', 'Dog', 'Cat', 'Bird')
	}

	fetchRandomImage(species) {
		if (species === 'Dog') species = 'Shibe'

		return fetch(`https://api.codetabs.com/v1/proxy?quest=http://shibe.online/api/${species.toLowerCase()}s?count=1&urls=true`)
			.then(response => response.json())
			.then(data => data[0])
	}
}


/** @type {AnimalSource[]} */
const SOURCES = [RandomDuck, AxoltlAPI, ZooAnimalAPI, DogCEO, BunniesIO, RandomFox, FishWatch, RandomDog, ElephantAPI, TheCatAPI, Shibe].map(Source => new Source().load());

function fetchRandomImage() {
	FIELDSET.disabled = true;
	const selectedID = SOURCE_SELECT.value;
	const selectedSpecies = SPECIES_SELECT.value;

	const possibleSources = selectedSpecies
		? SOURCES.filter(source => source.species.includes(selectedSpecies))
		: SOURCES;

	const source = selectedID
		? possibleSources.find(source => source.id === selectedID)
		: possibleSources[Math.floor(Math.random() * possibleSources.length)];

	return source.fetchRandomImage(source.species[Math.floor(Math.random() * source.species.length)])
		.catch(err => alert(err.message))
		.then((url) => new Promise((resolve, reject) => {
			IMG.addEventListener('load', resolve, { once: true })
			IMG.addEventListener('error', () => reject(new Error('Image failed to load')), { once: true })
			IMG.src = url;
		}))
		.catch(err => alert(err.message))
		.then(() => {
			FIELDSET.disabled = false;
		})
}

FETCH_BUTTON.addEventListener('click', () => fetchRandomImage())


for (const source of SOURCES) {
	const option = document.createElement('option')
	option.value = source.id
	option.textContent = source.name

	SOURCE_SELECT.appendChild(option);
}

function renderSpecies() {
	const selectedSource = SOURCE_SELECT.value;
	const sources = selectedSource
		? [SOURCES.find(source => source.id === selectedSource)]
		: SOURCES

	const oldValue = SPECIES_SELECT.value;

	while (SPECIES_SELECT.childElementCount > 1) SPECIES_SELECT.children[1].remove()

	for (const species of [...new Set(sources.flatMap(source => source.species))]) {
		const option = document.createElement('option')
		option.textContent = species

		SPECIES_SELECT.appendChild(option);
	}

	SPECIES_SELECT.value = oldValue;
	if (!SPECIES_SELECT.value) SPECIES_SELECT.value = '';
}

function renderSources() {
	const species = SPECIES_SELECT.value;

	const oldValue = SOURCE_SELECT.value;

	while (SOURCE_SELECT.childElementCount > 1) SOURCE_SELECT.children[1].remove()

	for (const source of SOURCES) {
		if (species && !source.species.includes(species)) continue
		const option = document.createElement('option')
		option.value = source.id
		option.textContent = source.name

		SOURCE_SELECT.appendChild(option);
	}

	SOURCE_SELECT.value = oldValue;
	if (!SOURCE_SELECT.value) SOURCE_SELECT.value = '';
}

SPECIES_SELECT.addEventListener('change', renderSources);
SOURCE_SELECT.addEventListener('change', renderSpecies);

renderSources()
renderSpecies()
