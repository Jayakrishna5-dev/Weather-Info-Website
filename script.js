let enablelocation = document.getElementById("enablelocation");
let latitude;
let longitude;
let locationname = document.getElementById("locationName");
const todayDateTime = document.querySelector(".todayDateTime");
const maintemp = document.querySelector(".maintemp");
const feelslike = document.querySelector(".feelslike");
const weathercodedesc = document.querySelector(".weathercodedesc");
const uvtext = document.querySelector(".uvtext");
const aqitext = document.querySelector(".aqitext");
const humiditytext = document.querySelector(".humiditytext");
const windtext = document.querySelector(".windtext");
const visibilitytext = document.querySelector(".visibilitytext");
const dewpointtext = document.querySelector(".dewpointtext");
const sunrisetext = document.querySelector(".sunrisetext");
const sunsettext = document.querySelector(".sunsettext");
const weatherimage = document.querySelector(".weatherimage");
let dayText = document.querySelectorAll(".dayText");
let dateText = document.querySelectorAll(".dateText");
let weathericon = document.querySelectorAll(".weathericon");
let comingtemptext = document.querySelectorAll(".comingtemptext");
let mintemptext = document.querySelectorAll(".mintemptext"); 
let dress = document.querySelector(".dress");
let weathersuggestionimage = document.querySelector(".weathersuggestion");
let weatherTip = document.querySelector(".weatherTip");


function openModal(id) {
    document.getElementById(id).style.display = "flex";
}
// Function to Close Modal
function closeModal(id) {
    document.getElementById(id).style.display = "none";
}
// Function to Handle Enable Location
function enableLocation() {
    closeModal('modal1');
    function success(position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

        enablelocation.textContent = "";

        // Call test() AFTER getting location
        test(latitude, longitude);
    }

    function error() {
        locationname.textContent = "Unable to retrieve your location";
    }

    if (!navigator.geolocation) {
        locationname.textContent = "Geolocation is not supported by your browser";
    } else {
        locationname.textContent = "Locating…";
        navigator.geolocation.getCurrentPosition(success, error);
    }
}
// Function to Handle Location Submission
async function submitLocation() {
    closeModal('modal2');
    closeModal('modal1');
    const userEnteredLocation = document.querySelector(".search-input").value.trim();
    if (userEnteredLocation === "") {
        alert("Please enter a city name.");
        openModal('modal1');
        openModal('modal2');
        return;
    }
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${userEnteredLocation}&appid=01eaef3d35311f840a8a04cd4ffdf3c0&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    locationname.textContent = data.city.name;
    latitude = data.city.coord.lat;
    longitude = data.city.coord.lon;
    test(latitude, longitude);
}
// Open the first modal on page load
window.onload = function() {
    openModal('modal1');
}

async function test(latitude, longitude) {
    if (!latitude || !longitude) {
        enablelocation.textContent = "Location not available yet.";
        return;
    }

    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=01eaef3d35311f840a8a04cd4ffdf3c0&units=metric`;
    let uvurl = `https://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=01eaef3d35311f840a8a04cd4ffdf3c0`;
    let aqiurl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=01eaef3d35311f840a8a04cd4ffdf3c0`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        let data = await res.json();
        locationname.textContent = data.name;
        forecastData(data.name);
        maintemp.textContent = data.main.temp;
        setdresstext(Math.round(data.main.temp));
        feelslike.textContent = data.main.feels_like;
        setweatherimage(data.weather[0].id);
        weathercodedesc.textContent = data.weather[0].description;
        const im = document.createElement("img");
        im.classList.add("img");
        im.style.height = "40px";
        im.style.width = "40px";
        im.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        weathercodedesc.appendChild(im);
        humiditytext.textContent = data.main.humidity;
        windtext.textContent = Math.round(data.wind.speed * 3.6);
        visibilitytext.textContent = data.visibility / 1000;
        sunrisetext.textContent = timestamp(data.sys.sunrise);
        sunsettext.textContent = timestamp(data.sys.sunset);
        let uvres = await fetch(uvurl);
        let uvdata = await uvres.json();
        uvtext.textContent = getuvcode(Math.round(uvdata.value));
        let aqires = await fetch(aqiurl);
        let aqidata = await aqires.json();
        aqitext.textContent = getaqicode(aqidata.list[0].main.aqi);
        dewpointtext.textContent = Math.round((data.main.temp - ((100 - data.main.humidity)/5)));
    } catch (error) {
        locationname.textContent = "Error fetching data";
    }
}

//format today date:
function formatDate() {
    const now = new Date();

    // Get day abbreviation (e.g., "MON")
    const day = now.toLocaleString("en-US", { weekday: "short" }).toUpperCase();

    // Get date in DD/MM format
    const date = now.getDate().toString().padStart(2, "0"); // Ensure two digits
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Ensure two digits

    // Get time in HH:MM format (24-hour)
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");

    const formattedDate =  `${day} ${date}/${month} ${hours}:${minutes}`;
    todayDateTime.innerHTML = "";
    todayDateTime.innerHTML = formattedDate;
}
formatDate();

//convert api timestamp to formatted time
function timestamp(times) {
    let dateObj = new Date(times * 1000); // Convert to milliseconds

    let hours = String(dateObj.getHours()).padStart(2, "0");
    let minutes = String(dateObj.getMinutes()).padStart(2, "0");

    let time24Hour = `${hours}:${minutes}`;
    return time24Hour;
}

//getting uv code
function getuvcode(uv) {
    if (uv >= 0 && uv <= 2) {
        return "Low";
    } else if (uv >= 3 && uv <= 5) {
        return "Moderate";
    } else if (uv >= 6 && uv <= 7) {
        return "High";
    } else if (uv >= 8 && uv <= 10) {
        return "Very High";
    } else if (uv >= 11) {
        return "Extreme";
    }
}

//getting aqi code
function getaqicode(aqi) {
    switch (aqi) {
        case 1:
            return "Good";
        case 2:
            return "Fair";
        case 3:
            return "Moderate";
        case 4:
            return "Poor";
        case 5:
            return "Very Poor";
        default:
            return "No Data";
    }
}

//setting weather image
function setweatherimage(weatherid) {
    if (weatherid >= 801 && weatherid <= 804) {
        weatherimage.src = 'Cloudy.jpg';
        weathersuggestionimage.src = 'Cloudy.jpg';
        weatherTip.textContent = `No special preparation needed. Maybe a light jacket. 🧥`;
    } else if (weatherid === 800) {
        weatherimage.src = 'Clear.jpg';
        weathersuggestionimage.src = 'Clear.jpg';
        weatherTip.textContent = `Wear sunglasses, light clothing, and apply sunscreen. 😎`;
    } else if (weatherid >= 701 && weatherid <= 781) {
        weatherimage.src = 'Fog.jpg';
        weathersuggestionimage.src = 'Fog.jpg';
        weatherTip.textContent = `Drive carefully, use fog lights. 🚗💨`;
    } else if (weatherid >= 600 && weatherid <= 622) {
        weatherimage.src = 'Snow.jpg';
        weathersuggestionimage.src = 'Snow.jpg';
        weatherTip.textContent = `Wear warm clothes and boots. Roads might be slippery. 🧤`;
    } else if (weatherid >= 500 && weatherid <= 531) {
        weatherimage.src = 'rain.jpg';
        weathersuggestionimage.src = 'rain.jpg';
        weatherTip.textContent = `Carry an umbrella. Avoid slippery roads. ☔`;
    } else if (weatherid >= 300 && weatherid <= 321) {
        weatherimage.src = 'Drizzle.jpg';
        weathersuggestionimage.src = 'Drizzle.jpg';
        weatherTip.textContent = `Carry a raincoat or umbrella. 🌂`;
    } else if (weatherid >= 200 && weatherid <= 232) {
        weatherimage.src = 'Thunderstorm.jpg';
        weathersuggestionimage.src = 'Thunderstorm.jpg';
        weatherTip.textContent = `Avoid outdoor activities. Stay inside. ⚡`;
    }
}

//5-day weather forecast
async function forecastData(location) {
    const forecasturl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=01eaef3d35311f840a8a04cd4ffdf3c0&units=metric`;
    let forecastres = await fetch(forecasturl);
    let forecastdata = await forecastres.json();
    let dailyForecast = forecastdata.list.filter(item => item.dt_txt.includes("12:00:00"));
    for (let a = 0; a < 5; a++) {
        let dateday = dailyForecast[a].dt_txt;
        setforecastDateTimeformat(dateday, a);
        weathericon[a].src = `https://openweathermap.org/img/wn/${dailyForecast[a].weather[0].icon}@2x.png`;
        comingtemptext[a].innerHTML = `${dailyForecast[a].main.temp}<sup>o</sup>`;
        mintemptext[a].innerHTML = `${dailyForecast[a].main.temp_min}<sup>o</sup>`;
    }
    console.log(dailyForecast);
}

//formatting forecasting datetime
function setforecastDateTimeformat(dt, ind){
    const now = new Date(dt);
    // Get day abbreviation (e.g., "MON")
    const day = now.toLocaleString("en-US", { weekday: "short" }).toUpperCase();

    // Get date in DD/MM format
    const date = now.getDate().toString().padStart(2, "0"); // Ensure two digits
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Ensure two digits
    dayText[ind].textContent = day;
    dateText[ind].textContent = `${date}/${month}`;
}

//suggesting dress recommendation
function setdresstext(temperature) {
    if (temperature < 0) {
        dress.textContent = `Wear thermal clothing, heavy coats, and scarves. 🧣`;
    } else if (temperature >= 0 && temperature <= 10) {
        dress.textContent = `Wear warm jackets, sweaters, and gloves. ❄️`;
    } else if (temperature >= 10 && temperature <= 20) {
        dress.textContent = `Wear light jackets or hoodies. 🍂`;
    } else if (temperature >= 20 && temperature <= 30) {
        dress.textContent = `Comfortable clothing (T-shirts, jeans). 🏖️`;
    } else if (temperature > 30) {
        dress.textContent = `Wear light cotton clothes, sunglasses, and stay hydrated. ☀️`;
    }
}