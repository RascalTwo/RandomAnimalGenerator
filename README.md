# [Utimate Random Animal Generator](https://rascaltwo.github.io/RandomAnimalGenerator/)

[![pages-build-deployment](https://github.com/RascalTwo/RandomAnimalGenerator/actions/workflows/pages/pages-build-deployment/badge.svg)](https://rascaltwo.github.io/RandomAnimalGenerator/)

Shows random animal pictures, using over 12 APIs!

[![four random animal images; fish, koala, snake, and two foxes](https://user-images.githubusercontent.com/9403665/166978208-781e2077-e4be-43a7-b6d8-e50bbec37b17.png)](https://rascaltwo.github.io/RandomAnimalGenerator/#select-species=&select-source=&count=4&ids=62-0&ids=https%3A%2F%2Fi.some-random-api.ml%2FJwcJmFsFI9.jpg&ids=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2F4%2F4f%2FDumeril%2527s_Madagascar_ground_boa_%2528Acrantophis_dumerili%2529_male_Reniala.jpg&ids=13&sources=fishwatch&sources=some-random-api&sources=zoo-animal-api&sources=randomfox&specieses=Fish&specieses=Koala&specieses=undefined&specieses=Fox)

In addition supports direct linking to results, simply copy the URL from the address bar to always return to your favorite images!

## How It's Made

**Tech Used:** HTML, CSS, JavaScript, [CodeTabs CORS Proxy](https://codetabs.com/cors-proxy/cors-proxy.html)

Written in a highly modular and OOP fashion, this project uses a variety of APIs to get random animal pictures - additionally preserving the state of the page via the URL hash.

## Optimizations

Most optimizations have already been made, from caching bulky API responses to using a CORS proxy to get around CORS issues, any additional optimizations would mainly be in the form of code refactoring.

## Lessons Learned

Abstracting such a large number of various different data sources into a single interface was a challenge, and writing the code in a modular and OOP fashion was a great learning experience.

## APIs Used

- https://aws.random.cat/
- https://random-d.uk/api
- https://theaxolotlapi.netlify.app/
- https://zoo-animal-api.herokuapp.com/
- https://dog.ceo/
- https://www.bunnies.io/
- https://randomfox.ca/
- https://www.fishwatch.gov/developers
- https://elephant-api.herokuapp.com/
- https://docs.thecatapi.com/
- https://random.dog/
- https://shibe.online/
- https://some-random-api.ml/endpoints
