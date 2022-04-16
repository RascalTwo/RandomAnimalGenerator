const IMG = document.querySelector('img');
const FETCH_BUTTON = document.querySelector('button');

const URLS = [
	'https://api.codetabs.com/v1/proxy?quest=https://axoltlapi.herokuapp.com/',
	'https://api.codetabs.com/v1/proxy?quest=https://random-d.uk/api/v2/random'
]

function fetchRandomImage(){
	const url = URLS[Math.floor(Math.random() * URLS.length)]
	return fetch(url)
		.then(response => response.json())
		.then(data => {
			IMG.src = data.url
		})
}

FETCH_BUTTON.addEventListener('click', () => fetchRandomImage())
