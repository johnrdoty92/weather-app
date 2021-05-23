const submit = document.querySelector('#submit');
const search = document.querySelector('#search');
const form = document.forms["search-field"];
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

let submitRequest = (event) => {
    event.preventDefault();
    console.log(search.value)
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${search.value}&cnt=5&appid=${KEYS.API_KEY}`
    fetch(url)
        .then(response => {
            console.log(response);
            return response.json();
        })
        //Modify this section, it only currently displays a weekday
        .then(data => {
            console.log(data.list);
            let currentDay = new Date(data.list[0].dt_txt.slice(0,10)).getDay(); //the index specifies the weekday
            console.log(daysOfWeek[currentDay]);
        })
        .catch(err => {
            console.log("Request Failed");
            console.log(err)
        });
}

form.addEventListener('submit', submitRequest)

let display = document.querySelector('#weather-display');
let summary = document.querySelector('#summary');
let weekForecast = document.querySelector('#week-forecast');