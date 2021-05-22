const submit = document.querySelector('#submit');
const search = document.querySelector('#search');
const form = document.forms["search-field"];

let submitRequest = (event) => {
    event.preventDefault();
    console.log(search.value)
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${search.value}&appid=${KEYS.API_KEY}`
    fetch(url)
        .then(response => {
            console.log("success");
            console.log(response.json());
        })
        .catch(err => {
            console.log("Request Failed");
            console.log(err)
        });
}

form.addEventListener('submit', submitRequest)
