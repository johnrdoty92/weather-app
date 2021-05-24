const submit = document.querySelector('#submit');
const search = document.querySelector('#search');
const form = document.forms["search-field"];
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let units = 'imperial';
const display = document.querySelector('#weather-display');

//Clears display
let clearDisplay = () => {
    while(display.firstChild) {
        display.removeChild(display.firstChild);
    }    
}
//Build framework for displaying data
let buildPage = () => {
    //Create all the div nodes to insert stuff in
    console.log('Building...')
}
//Takes forecast and displays it to the page
let displayData = (data) => {    
    console.log(data);

};
//Error to display if city is not found
let displayError = () => {
    clearDisplay();
    errorText = document.createElement('h1');
    errorText.innerHTML = "Oops! We couldn't find the city you are looking for.";
    errorText.setAttribute("id", "errorText");
    display.appendChild(errorText);
};

//Fetch request function for event listener
let submitRequest = (event) => {
    event.preventDefault();
    clearDisplay();

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
        if (data[0].cod != 200) {
            //If city isn't found
            console.log(data[0].cod);
            displayError();
        }else {
            buildPage();
            displayData(data);
        }
    })
    .catch(err => {
        console.log(`An error occurred: ${err}`);
    })
}

//Event Listeners
form.addEventListener('submit', submitRequest)