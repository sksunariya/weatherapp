let yourTab = document.querySelector("[your-weather]");
let searchTab = document.querySelector("[search-weather]");
let locationBtn = document.querySelector("[grant-btn]");
let displayLoading = document.querySelector("[loading-screen]");
let locationPlace = document.querySelector("[your-location]");
let locationFlag = document.querySelector("[countryFlag]");
let weather_info_text = document.querySelector("[weather-info-text]");
let weather_info_img = document.querySelector("[weather-info-img]");
let weather_info_temp = document.querySelector("[weather-info-temp]");
let windspeed_value = document.querySelector("[windspeed-value]");
let cloud_value = document.querySelector("[cloud-value]");
let humidity_value = document.querySelector("[humidity-value]");
let userInfoContainer = document.querySelector("[user-info-container]");
let searchForm = document.querySelector("[search-form]");
let weather_box = document.querySelector("[full-weather-box]");
let grant_access = document.querySelector("[grant-location]");
let searchInput = document.querySelector("[search-input]");
let submitBtn = document.querySelector("[submit-btn]");
let invalid_city = document.querySelector("[invalid-city]");

let currentTab = yourTab;
currentTab.classList.add("current-tab");

let API_key = "71dedafbc5e3dff39902166eb284a7ac";
checkSessionInfo();



function switchTab(clickedTab) {
    if (clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
        invalid_city.classList.remove("active");

        if (!searchForm.classList.contains("active")){
            searchForm.classList.add("active");
            weather_box.classList.remove("active");
            grant_access.classList.remove("active");
        }
        else{
            searchForm.classList.remove("active");
            weather_box.classList.remove("active");
            checkSessionInfo();
        }
    }
}

yourTab.addEventListener("click", () => {
    switchTab(yourTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});



function checkSessionInfo() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates){
        grant_access.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        console.log(coordinates);
        fetchWeather(coordinates);
    }
    
}

function checkGeoLocation(){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(getLocation);
    }
    else{
        alert("Your device doesn't support geolocation.");
    }
}

function getLocation (position) {
    let userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude 
    } 
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchWeather(userCoordinates);
}

async function fetchWeather(coordinates) {
    const {lat, lon} = coordinates;
    console.log ("fetch " + lat + lon);
    grant_access.classList.remove("active");
    displayLoading.classList.add("active");
    try {
        const weatherData = await fetch (`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`);
        console.log("weatherdata " + weatherData);
        const weatherJSON = await weatherData.json();
        console.log(weatherJSON);
        displayLoading.classList.remove("active");
        weather_box.classList.add("active");
        displayFetchedData(weatherJSON);
    }  
    catch{
        displayLoading.classList.remove("active");
        alert("Can't fetch weather data for your location.")
    }
}

function displayFetchedData (data){
    console.log (data.name);
    locationPlace.innerText = data?.name;

    locationFlag.src = `https://flagsapi.com/${data?.sys?.country}/flat/64.png`;
    weather_info_text.innerText = data?.weather?.[0]?.description;
    weather_info_img.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    weather_info_temp.innerHTML = Math.round((data?.main?.temp - 273.15)*100) / 100 + " °C";
    windspeed_value.innerHTML = data?.wind?.speed;
    cloud_value.innerHTML = data?.clouds?.all;
    humidity_value.innerHTML = data?.main?.humidity;
}


locationBtn.addEventListener("click", () =>{
    checkGeoLocation();
} )

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("searchform eventlistener")
    let cityName = searchInput.value;
    console.log (cityName);

    if (cityName === ""){
        return;
    }
    else{
        invalid_city.classList.remove("active");
        fetchSearchWeatherInfo(cityName);
    }
})


async function fetchSearchWeatherInfo(cityName){
    displayLoading.classList.add("active");
    console.log ("fetchweathersearch")
    weather_box.classList.remove("active");
    grant_access.classList.remove("active");
    console.log("fetchserachweatherinfo");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_key}`);

        console.log(response);
        const data = await response.json();
        console.log (data);
        displayLoading.classList.remove("active");
        weather_box.classList.add("active");

        console.log(data);
        displayFetchedData(data);
        if (data?.name === undefined){
            invalid_city.classList.add("active");
            weather_box.classList.remove("active");
        }
    }
    catch(err){
        displayLoading.classList.remove("active");
        invalid_city.classList.add("active");
        alert("Can't find weather for searched place.")
    }
}

