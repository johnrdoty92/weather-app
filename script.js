const submit = document.querySelector('#submit');
const search = document.querySelector('#search');
const form = document.forms["search-field"];
const reset = document.querySelector('#reset');
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let units = 'imperial';
const display = document.querySelector('#weather-display');
let current, iconTemp, currentDetails, currentWeather, weekForecast, dailyForecast;

//Clears display
let clearDisplay = () => {
    while(display.firstChild) {
        display.removeChild(display.firstChild);
    }    
}
//Build framework for displaying data
let buildPage = () => {
    //Current Weather Data
    current = document.createElement('div');
    current.id = 'current';
    currentWeather = document.createElement('div');
    currentWeather.id = 'current-weather';
    iconTemp = document.createElement('div');
    iconTemp.id = 'icon-temp';
    currentDetails = document.createElement('div');
    currentDetails.id ='current-details';

    display.appendChild(current);
    current.appendChild(currentWeather);
    currentWeather.appendChild(iconTemp);
    currentWeather.appendChild(currentDetails);
    //5 day forecast
    weekForecast = document.createElement('div');
    weekForecast.id = 'week-forecast';
    display.appendChild(weekForecast);
}
//Takes forecast and displays it to the page
let displayData = (data) => {    
    console.log(data);
    let [today, fiveDay] = data;
    let {weather, main} = today;
    let {list} = fiveDay;
    let timeOffset = Math.ceil((24 - (new Date().getHours()))/3);

    fiveDayArray = [];
    for (let i=timeOffset; i < list.length; i+=8) {
        fiveDayArray.push(list[i]);
        console.log(new Date(list[i].dt*1000))
    };

    cityName = document.createElement('h2');
    cityName.id = 'city-name';
    cityName.innerHTML = search.value;
    current.insertBefore(cityName, currentWeather);

    currentIcon = document.createElement('img');
    currentIcon.id = 'current-icon';
    currentIcon.src = chooseIcon(weather[0].main, weather[0].description);
    iconTemp.appendChild(currentIcon);
    
    currentTemp = document.createElement('h1');
    currentTemp.id = 'current-temp';
    currentTemp.innerHTML = `${Math.round(main.temp)}&#176;`;
    iconTemp.appendChild(currentTemp);
    
    currentDescription = document.createElement('h3');
    currentDescription.id ='current-description';
    currentDescription.innerHTML = weather[0].description;
    currentDetails.appendChild(currentDescription);
    
    currentHighLow = document.createElement('h3');
    currentHighLow.id = 'current-high-low';
    currentHighLow.innerHTML = `${Math.round(main.temp_min)}&#176; / ${Math.round(main.temp_max)}&#176;`;
    currentDetails.appendChild(currentHighLow);
    
    currentFeelsLike = document.createElement('h3');
    currentFeelsLike.id = 'current-feels-like';
    currentFeelsLike.innerHTML = `Feels like ${Math.round(main.feels_like)}&#176;`;
    currentDetails.appendChild(currentFeelsLike);

    //5 day loop:
    for (let i=0; i < fiveDayArray.length; i++) {
        dailyForecast = document.createElement('div');
        dailyForecast.className = 'daily-forecast';
        weekForecast.appendChild(dailyForecast);

        day = document.createElement('h3');
        day.className = 'daily-item day';
        day.innerHTML = daysOfWeek[new Date(fiveDayArray[i].dt * 1000).getDay()];
        dailyForecast.appendChild(day);

        humidity = document.createElement('h4');
        humidity.className = 'daily-item daily-humidity';
        humidity.innerHTML = `Humidity: ${fiveDayArray[i].main.humidity}%`;
        dailyForecast.appendChild(humidity);

        dailyIcon = document.createElement('img');
        dailyIcon.className = 'daily-item';
        dailyIcon.src = chooseIcon(fiveDayArray[i].weather[0].main, fiveDayArray[i].weather[0].description);
        dailyForecast.appendChild(dailyIcon);

        dailyTemp = document.createElement('h4');
        dailyTemp.className = 'dailty-item daily-temp';
        dailyTemp.innerHTML = `${Math.round(fiveDayArray[i].main.temp_min)}&#176; / ${Math.round(fiveDayArray[i].main.temp_max)}&#176;`
        dailyForecast.appendChild(dailyTemp);
    }
    reset.disabled = false;
};


//Choose the proper icon
let chooseIcon = (inputText, description) => {
    switch (inputText) {
        case 'Clear':
            return '/weather_icons/sunny.svg';
        case 'Clouds':
            //add time check to choose sun or moon
            if (description == 'few clouds') {
                return '/weather_icons/sunny-cloudy.svg';
            };
            return '/weather_icons/cloudy.svg';
        case 'Drizzle':
        case 'Rain':
            return '/weather_icons/rain.svg';
        case 'Thunderstorm':
            return '/weather_icons/thunder.svg';
        case 'Snow':
            return '/weather_icons/snow.svg';
        case 'Mist':
        case 'Smoke':
        case 'Haze':
        case 'Dust':
        case 'Fog':
        case 'Sand':
        case 'Ash':
        case 'Squall':
        case 'Tornado':
            return '/weather_icons/mist.svg';
        default:
            return '/weather_icons/sunny.svg';
    }
}
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
    let fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?q=${search.value}&appid=${KEYS.API_KEY}&units=${units}`;
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
form.addEventListener('submit', submitRequest);
reset.addEventListener('click', function() {
    clearDisplay();
    this.disabled = true;
});