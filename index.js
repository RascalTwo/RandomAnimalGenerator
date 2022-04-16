const IMG = document.querySelector('img');
const FETCH_BUTTON = document.querySelector('button');

function fetchRandomDuck(){
	return fetch('https://api.codetabs.com/v1/proxy?quest=https://random-d.uk/api/v2/random')
		.then(response => response.json())
		.then(data => {
			IMG.src = data.url
		})
}

FETCH_BUTTON.addEventListener('click', () => fetchRandomDuck())
