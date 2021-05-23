const submit = document.querySelector('#submit');
const search = document.querySelector('#search');
const form = document.forms["search-field"];
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let units = 'imperial';

//Takes forecast and displays it to the page
let displayData = (data) => {
    let display = document.querySelector('#weather-display');
    let summary = document.querySelector('#summary');
    let weekForecast = document.querySelector('#week-forecast');
    console.log(data);
};

//Fetch request function for event listener
let submitRequest = (event) => {
    event.preventDefault();
    console.log(search.value);
    
    let currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${search.value}&appid=${KEYS.API_KEY}&units=${units}`
    let fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?q=${search.value}&cnt=5&appid=${KEYS.API_KEY}&units=${units}`;

    //Fetch Five Day forecast
    let fiveDay = fetch(fiveDayURL)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(`An error occurred: ${err}`);
        });
    
    //Fetch current weather
    let current = fetch(currentURL)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(`An error occurred: ${err}`);
        });

    //Once current and 5 day weather data is returned:
    Promise.all([current, fiveDay])
    .then(data => {
        displayData(data);
    })
    .catch(err => {
        console.log(`An error occurred: ${err}`);
    })
}

//Event Listeners
form.addEventListener('submit', submitRequest)