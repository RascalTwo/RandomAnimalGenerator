const IMG = document.querySelectorAll('img');
const FETCH_BUTTON = document.querySelector('button');
const IMG_COUNT = document.querySelector('input');
const SOURCE_SELECT = document.querySelector('#sources');
const SPECIES_SELECT = document.querySelector('#species');
const FIELDSET = document.querySelector('fieldset');

class AnimalSource {
	constructor(id, name, ...species) {
		this.id = id;
		this.name = name;
		this.species = species
		this.lastSaved = 0;
	}

	fetchCORS(url) {
		return this.fetch('https://api.codetabs.com/v1/proxy?quest=' + url).then(response => response.json()).catch(() => {
			throw new Error('Likely being rate-limtied by CORs Proxy')
		})
	}

	fetch(url) {
		return fetch(url).then(response => response.json())
	}

	isStale() {
		return Date.now() - this.lastSaved > 86400000;
	}

	async prePopulate() {
		throw new Error('Not Yet Implemented')
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

	/**
	 * @returns {Promise<{ id?: string, imageURL: string}>}
	 */
	async fetchRandomImageInfo() {
		throw new Error('Not Yet Implemented')
	}

	/**
	 * @returns {Promise<string>}
	 */
	async fetchImageURLById(id, species) {
		return id;
	}

	/**
	 * @returns {Promise<{ id?: string, imageURL: string}>}
	 */
	async fetchImageInfoByID(id, species) {
		return {
			id,
			imageURL: await this.fetchImageURLById(id, species)
		}
	}
}

class RandomDuck extends AnimalSource {
	constructor() {
		super('random-duck', 'Random Duck', 'Bird')
	}

	fetchRandomImageInfo() {
		return this.fetchCORS('https://random-d.uk/api/v2/random')
			.then(data => ({
				id: data.url.split('/').at(-1),
				imageURL: data.url
			}))
	}

	async fetchImageURLById(id) {
		return 'https://random-d.uk/api/' + id;
	}
}

class AxoltlAPI extends AnimalSource {
	constructor() {
		super('axoltlapi', 'Axoltl API', 'Axolotl')
	}

	fetchRandomImageInfo() {
		return this.fetchCORS('https://axoltlapi.herokuapp.com/')
			.then(data => ({ id: data.url, imageURL: data.url }))
	}
}

class ZooAnimalAPI extends AnimalSource {
	constructor() {
		super('zoo-animal-api', 'Zoo Animal API')
	}

	fetchRandomImageInfo() {
		return this.fetch('https://zoo-animal-api.herokuapp.com/animals/rand')
			.then(data => ({ id: data.image_link, imageURL: data.image_link }))
	}
}

class DogCEO extends AnimalSource {
	constructor() {
		super('dog-ceo', 'Dog CEO', 'Dog')
	}

	fetchRandomImageInfo() {
		return this.fetch('https://dog.ceo/api/breeds/image/random')
			.then(data => ({
				imageURL: data.message,
				id: data.message.split('/').slice(-2).join('/')
			}))
	}

	fetchImageURLById(id) {
		return 'https://images.dog.ceo/breeds/' + id;
	}
}

class BunniesIO extends AnimalSource {
	constructor() {
		super('bunnies-io', 'Bunnies IO', 'Bunny')
	}

	fetchRandomImageInfo() {
		return this.fetch('https://api.bunnies.io/v2/loop/random/?media=poster')
			.then(data => ({
				id: data.id,
				imageURL: data.media.poster
			}))
	}

	fetchImageURLById(id) {
		return 'https://bunnies.media/poster/' + id;
	}
}

class RandomFox extends AnimalSource {
	constructor() {
		super('randomfox', 'Random Fox', 'Fox')
	}

	fetchRandomImageInfo() {
		return this.fetch('https://randomfox.ca/floof/')
			.then(data => ({
				id: data.link.split('i=')[1],
				imageURL: data.image
			}))
	}

	fetchImageURLById(id) {
		return `https://randomfox.ca/images/${id}.jpg`
	}
}

class FishWatch extends AnimalSource {
	constructor() {
		super('fishwatch', 'Fish Watch', 'Fish')
		this.fishes = [];
	}

	async prePopulate() {
		if (!this.isStale()) return

		this.fishes = await this.fetchCORS('https://www.fishwatch.gov/api/species')
		this.save();
	}

	getFishImages(fish) {
		const images = fish['Image Gallery'];
		images.push(fish['Species Illustration Photo']);
		return images;
	}

	async fetchRandomImageInfo() {
		await this.prePopulate();

		const fishIndex = Math.floor(Math.random() * this.fishes.length);
		const images = this.getFishImages(this.fishes[fishIndex]);
		const imageIndex = Math.floor(Math.random() * images.length)
		const image = images[imageIndex]
		return {
			id: fishIndex + '-' + imageIndex,
			imageURL: image.src
		}
	}

	async fetchImageURLById(id) {
		await this.prePopulate();

		const [fishIndex, imageIndex] = id.split('-').map(Number);
		return this.getFishImages(this.fishes[fishIndex])[imageIndex].src
	}
}

class RandomDog extends AnimalSource {
	constructor() {
		super('random.dog', 'Random Dog', 'Dog')
		this.filenames = [];
	}

	async prePopulate() {
		if (!this.isStale()) return

		this.filenames = await this.fetch('https://random.dog/doggos')
		this.save();
	}

	async fetchRandomImageInfo() {
		await this.prePopulate();

		let id = 0

		do id = Math.floor(Math.random() * this.filenames.length);
		while (this.filenames[id].endsWith('.mp4'));

		return {
			id,
			imageURL: 'https://random.dog/' + this.filenames[id]
		}
	}

	async fetchImageURLById(id) {
		await this.prePopulate();

		return 'https://random.dog/' + this.filenames[id]
	}
}

class RandomCat extends AnimalSource {
	constructor() {
		super('random.cat', 'Random Cat', 'Cat')
	}

	async fetchRandomImageInfo() {
		return this.fetchCORS('https://aws.random.cat/meow').then(data => ({
			id: data.file,
			imageURL: data.file
		}))
	}
}

class ElephantAPI extends AnimalSource {
	constructor() {
		super('elephant-api', 'Elephant API', 'Elephant')
		this.filenames = [];
	}

	async prePopulate() {
		if (!this.isStale()) return;

		this.filenames = await this.fetchCORS('https://elephant-api.herokuapp.com/elephants')
			.then(data =>
				data.map(elephant => elephant.image)
					.filter(url => url && url !== "https://elephant-api.herokuapp.com/pictures/missing.jpg")
					.map(url => url.split('/').at(-1))
			);
		this.save();
	}

	async fetchRandomImageInfo() {
		const filename = this.filenames[Math.floor(Math.random() * this.filenames.length)]
		return {
			id: filename.split('/').at(-1).split('.')[0],
			imageURL: 'https://elephant-api.herokuapp.com/pictures/' + filename
		}
	}

	async fetchImageURLById(id) {
		return 'https://elephant-api.herokuapp.com/pictures/' + id + '.jpg'
	}
}

class TheCatAPI extends AnimalSource {
	constructor() {
		super('thecatapi', 'The Cat API', 'Cat')
	}

	fetchRandomImageInfo() {
		return this.fetch('https://api.thecatapi.com/v1/images/search')
			.then(data => ({
				id: data[0].url.split('/').at(-1),
				imageURL: data[0].url
			}))
	}

	async fetchImageURLById(id) {
		return 'https://cdn2.thecatapi.com/images/' + id
	}
}

class Shibe extends AnimalSource {
	constructor() {
		super('shibe', 'Shibe', 'Dog', 'Cat', 'Bird')
	}

	normalizeSpecies(species) {
		if (species === 'Dog') species = 'Shibe'
		species = species.toLowerCase()
		return species
	}

	fetchRandomImageInfo(species) {
		species = this.normalizeSpecies(species)

		return this.fetchCORS(`http://shibe.online/api/${species}s?count=1`)
			.then(data => ({
				id: data[0].split('/').at(-1).split('.')[0],
				imageURL: data[0]
			}))
	}

	async fetchImageURLById(id, species) {
		return `https://cdn.shibe.online/${this.normalizeSpecies(species)}s/` + id + '.jpg'
	}
}

class SomeRandomAPI extends AnimalSource {
	constructor() {
		super('some-random-api', 'Some Random API', 'Kangaroo', 'Raccoon', 'Bird', 'Koala', 'Red Panda', 'Fox', 'Panda', 'Cat', 'Dog')
	}

	fetchRandomImageInfo(species) {
		return this.fetch('https://some-random-api.ml/animal/' + species.toLowerCase().replaceAll(' ', '_'))
			.then(data => ({
				id: data.image,
				imageURL: data.image
			}))
	}
}


/** @type {AnimalSource[]} */
const SOURCES = [RandomDuck, AxoltlAPI, ZooAnimalAPI, DogCEO, BunniesIO, RandomFox, FishWatch, RandomDog, ElephantAPI, TheCatAPI, Shibe, SomeRandomAPI, RandomCat].map(Source => new Source().load());

function handleImageFetching(promise, nth) {
	return promise
		.catch(err => alert(err.message))
		.then((info) => new Promise((resolve, reject) => {
			if (!info) return resolve();

			IMG[nth].addEventListener('load', resolve.bind(null, info.id), { once: true })
			IMG[nth].addEventListener('error', () => reject(new Error('Image failed to load')), { once: true })
			IMG[nth].src = info.imageURL;
		}))
		.catch(err => alert(err.message))
}

function fetchRandomImage(nth) {
	const selectedID = SOURCE_SELECT.value;
	const selectedSpecies = SPECIES_SELECT.value;

	const possibleSources = selectedSpecies
		? SOURCES.filter(source => source.species.includes(selectedSpecies))
		: SOURCES;

	const source = selectedID
		? possibleSources.find(source => source.id === selectedID)
		: possibleSources[Math.floor(Math.random() * possibleSources.length)];


	const species = source.species[Math.floor(Math.random() * source.species.length)]
	return handleImageFetching(source.fetchRandomImageInfo(species), nth)
		.then(id => ({ id, species, sourceID: source.id }))
}

async function loadImagesFromURL() {
	const hotlinkParams = new URLSearchParams(window.location.hash.slice(1));
	const sources = hotlinkParams.getAll('sources')
	const specieses = hotlinkParams.getAll('species')

	const info = []
	for (const [i, id] of hotlinkParams.getAll('ids').entries()) {
		if (id != 'undefined') info.push({ id, sourceID: sources[i], species: specieses[i] })
	}

	if (!info.length) return;

	FIELDSET.disabled = true;

	const waiting = []
	if (info.length < +IMG_COUNT.value) {
		IMG_COUNT.value = info.length
		onCountUpdate({ target: IMG_COUNT })
	}
	for (let i = 0; i < info.length; i++) waiting.push(handleImageFetching((async ({ id, sourceID, species }) => SOURCES.find(source => source.id === sourceID).fetchImageInfoByID(id, species)
	)(info[i]), i));
	await Promise.all(waiting);

	FIELDSET.disabled = false;
}

FETCH_BUTTON.addEventListener('click', async () => {
	FIELDSET.disabled = true;

	const waiting = []
	for (let i = 0; i < +IMG_COUNT.value; i++) waiting.push(fetchRandomImage(i))
	const info = await Promise.all(waiting);

	const params = new URLSearchParams(window.location.hash.slice(1));
	params.delete('ids')
	params.delete('sources')
	params.delete('species')
	for (const { id, species, sourceID } of info) {
		if (id === undefined) continue
		params.append('ids', id);
		params.append('sources', sourceID);
		params.append('species', species);
	}
	history.pushState(null, null, window.location.pathname + '#' + params.toString())

	FIELDSET.disabled = false;
})


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

	const params = new URLSearchParams(window.location.hash.slice(1))
	params.set('select-source', selectedSource)
	history.pushState(null, null, window.location.pathname + '#' + params.toString())
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

	const params = new URLSearchParams(window.location.hash.slice(1))
	params.set('select-species', species)
	history.pushState(null, null, window.location.pathname + '#' + params.toString())
}

SPECIES_SELECT.addEventListener('change', renderSources);
SOURCE_SELECT.addEventListener('change', renderSpecies);


function onCountUpdate({ target: { value } }) {
	const count = +value;
	IMG.forEach((img, i) => img.classList.toggle('hidden', i >= count))
	document.querySelector('#image-container').style.setProperty('--columns', Math.ceil(count / 2))
	const params = new URLSearchParams(window.location.hash.slice(1))
	params.set('count', count)
	history.pushState(null, null, window.location.pathname + '#' + params.toString())
}

IMG_COUNT.addEventListener('change', onCountUpdate)


const params = new URLSearchParams(window.location.hash.slice(1))
renderSources();
renderSpecies();
SPECIES_SELECT.value = params.get('select-species') || '';
SOURCE_SELECT.value = params.get('select-source') || '';
renderSources();
renderSpecies();


IMG_COUNT.value = +(params.get('count') || '1')
onCountUpdate({ target: IMG_COUNT })

loadImagesFromURL().catch(console.error)
