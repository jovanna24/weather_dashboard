const APIkey = "a727e1cc5f5d47d2c683636d92c63ac5";
const searchFormEl = document.querySelector('#search-form'); 
const resultTextEl = document.querySelector('#result-text');
const resultContentEl = document.querySelector('#result-content');



function handleSearchFormSubmit(event) {
    event.preventDefault(); 

    const searchInputVal = document.querySelector('#search-input').value; 
    
    if (!searchInputVal) {
        console.error('Please input a city name.'); 
        return;
    }

    const city = searchInputVal.trim(); 
    searchApi(city);
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit); 


function getParams () {
    const searchParamsArr = document.location.search.split('&'); 
    const city = searchParamsArr[0].split('=').pop(); 

    searchApi(city); 
} 

function searchApi(city) {
    const cityURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}`;

    fetch(cityURL) 
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function(weather) {
            
            resultTextEl.textContent = weather.main; 
            
            console.log(weather); 

            
            if (!weather.main) {
                console.log('No results found.');
                resultContentEl.innerHTML = '<h3>No results found, please search again.</h3>';
            } else {
                resultContentEl.textContent = '';
                
                for (let i = 0; i < weather.main.length; i++) {
                    
                    printResults(weather.main[i]);
                }
            }
        })
        .catch(function(error) {
            console.error('Error fetching data:', error);
            resultContentEl.innerHTML = '<h3>Error fetching data. Please try again later.</h3>';
        });
}


function printResults(resultsObj) {
    console.log(resultsObj); 

    const resultCard = document.createElement('div'); 
    resultCard.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3'); 

    const resultBody = document.createElement('div'); 
    resultBody.classList.add('card-body');
    resultCard.append(resultBody); 

    const titleEl = document.createElement('h3'); 
    titleEl.textContent = resultsObj.title; 

    const bodyContentEl = document.createElement('p');
    bodyContentEl.innerHTML += 
        `<strong>Subjects:</strong>${resultsObj.subject.join(', ')}<br/>`;

    if (resultsObj.description) {
        bodyContentEl.innerHTML += 
        '<strong>Description:</strong>  No description for this entry.';
    }

    resultBody.append(titleEl, bodyContentEl); 

    resultContentEl.append(resultCard);
}