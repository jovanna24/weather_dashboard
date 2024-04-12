const APIkey = "a727e1cc5f5d47d2c683636d92c63ac5";
const searchFormEl = document.querySelector('#search-form'); 
//const resultTextEl = document.querySelector('#result-text');
const resultContentEl = document.querySelector('#result-content');
const resultForecastEl = document.querySelector('#result-forecast');


//Function to retrieve prior search history
function readCitiesFromStorage () {
    let cities=JSON.parse(localStorage.getItem('cities')); 
    if (!cities) {
        cities= [];
    }
    return cities;

}
//Function to save searches to local storage
function saveCityToStorage(city) {
    let cities = readCitiesFromStorage();

    if (cities.indexOf(city)=== -1) {
        cities.push(city); 
        localStorage.setItem('cities', JSON.stringify(cities)); 
        console.log(city + ' New city stored.');
    } else {
        console.log(city + ' City already exists.');
    }

}
//Function to retrieve searched city weather information
function handleSearchFormSubmit(event) {
    event.preventDefault(); 

    const searchInputVal = document.querySelector('#search-input').value; 
    
    if (!searchInputVal) {
        console.error('Please input a city name.'); 
        return;
    }

    const city = searchInputVal.trim(); 
    searchApi(city);
    searchForecastApi(city);

    saveCityToStorage(city); 

    // displayWeather();
}
//
searchFormEl.addEventListener('submit', handleSearchFormSubmit); 


// function getParams () {
//     const searchParamsArr = document.location.search.split('&'); 
//     const city = searchParamsArr[0].split('=').pop(); 

//     searchApi(city); 
// } 

function displaySavedCities() {
    const cities = readCitiesFromStorage();
    const savedCitiesList = document.querySelector('#saved-cities-list');

    savedCitiesList.innerHTML = '';

    cities.forEach(city => {
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-primary', 'btn-lg', 'active', 'btn-block');
        button.textContent= city.toUpperCase();

        button.addEventListener('click', ()=>{
            searchApi(city);
            searchForecastApi(city);
        });

        savedCitiesList.appendChild(button);
    });
}
//3rd party API used to retrieve search from weather server
function searchApi(city) {
    const cityURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=imperial`;

    fetch(cityURL)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function(weather) {
            console.log(weather);
            displayWeather(weather);
        })
        .catch(function(error) {
            console.error('Error fetching data:', error);
            resultContentEl.innerHTML = '<h3>Error fetching data. Please try again later.</h3>';
        });
}
//function to retrieve 5 day forecast 
function searchForecastApi(city) {
    const cityURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIkey}&units=imperial`;

    fetch(cityURL)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function(forecast) {
            console.log(forecast);

            const selectedData = [
                forecast.list[0],
                forecast.list[8],
                forecast.list[16],
                forecast.list[24],
                forecast.list[32],
            ]

            console.log(selectedData)

            displayForecast(selectedData)
           
        })
        .catch(function(error) {
            console.error('Error fetching data:', error);
            resultContentEl.innerHTML = '<h3>Error fetching data. Please try again later.</h3>';
        });
}

//Displays today's forecast
function displayWeather(weather) {
    if (!weather.main) {
        console.log('No results found.');
        resultContentEl.innerHTML = '<h3>No results found, please search again.</h3>';
    } else {
        resultContentEl.innerHTML = ''; 

        const resultCard = document.createElement('div');
        resultCard.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3');

        const resultBody = document.createElement('div');
        resultBody.classList.add('card-body', 'text-capitalize', 'fs-2', 'fw-bold');
        resultCard.append(resultBody);

        const titleEl = document.createElement('h3');
        titleEl.textContent = weather.name; 
        const bodyContentEl = document.createElement('p');
        bodyContentEl.innerHTML +=
            `<img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png"/>` +
            `<strong>Description:</strong> ${weather.weather[0].description} <br/>` +
            `<strong>Temperature:</strong> ${weather.main.temp} °F <br/>` +
            `<strong>Humidity:</strong> ${weather.main.humidity}%<br/>`+
            `<strong>Wind Speed:</strong> ${weather.wind.speed}%<br/>`+
            `<strong>Visibility:</strong> ${weather.visibility}%<br/>`;

        resultBody.append(titleEl, bodyContentEl);

        resultContentEl.append(resultCard); 
    }
}
//displays 5 day forecast
function displayForecast(forecast) {
    if (forecast.length == 0) {
        console.log('No results found.');
        resultForecastEl.innerHTML = '<h3>No results found, please search again.</h3>';
    } else {
        resultForecastEl.innerHTML = ''; 

       for(weather of forecast) {
            const resultCard = document.createElement('div');
            resultCard.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3');

            const resultBody = document.createElement('div');
            resultBody.classList.add('card-body', 'text-capitalize', 'fs-2');
            resultCard.append(resultBody);

            const titleEl = document.createElement('h3');
            const date = new Date(weather.dt_txt + ' UTC');
            titleEl.textContent = formatDate(date);

            const bodyContentEl = document.createElement('p');
            bodyContentEl.innerHTML +=
                `<img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png"/>` +
                `<strong>Date:</strong> ${formatDate(date)} <br/>` +
                `<strong>Description:</strong> ${weather.weather[0].description} <br/>` +
                `<strong>Temperature:</strong> ${weather.main.temp} °F<br/>` +
                `<strong>Humidity:</strong> ${weather.main.humidity}%<br/>`+
                `<strong>Wind Speed:</strong> ${weather.wind.speed}%<br/>`+
                `<strong>Visibility:</strong> ${weather.visibility}%<br/>`;

            resultBody.append(bodyContentEl);

            resultForecastEl.append(resultCard); 
       }
    }
}
//function to return a reformatted date
function formatDate(date) {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short'
    };
    return date.toLocaleString(undefined, options);
}

document.addEventListener('DOMContentLoaded', function() {
    displaySavedCities();
});
