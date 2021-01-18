let searchedCities = [];
let searchButton = document.getElementById("search-button");
let currentCity = document.getElementById("current-city");
let currentTemp = document.getElementById("current-temp");
let currentHumidity = document.getElementById("current-humidity");
let currentImage = document.getElementById("current-image");
let currentWind = document.getElementById("current-wind");
let currentUVI = document.getElementById("current-uvi");
let searchCard = document.getElementById("search-card");
let forecast = document.getElementById("forecast");

// Check for localstorage
if (localStorage.getItem('city')===null){
    searchedCities = [];
} else {
    searchedCities = JSON.parse(localStorage.getItem('city'));
    
}

let fetchWeather = function(city){
    
    // fetch city longitude + latitude
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=c27b9b81b7f93aea690fde8c69e2c184`).then(function(response){
        if(response.ok){
            
            response.json().then(function(data){
                // console.log(data);
                // city longitude
                let lon = data.coord.lon;
                // city latitude
                let lat = data.coord.lat;
                
                // convert timestamp into date
                let timestamp = data.dt;
                let currentDate = new Date(timestamp * 1000);
                currentDate = currentDate.toLocaleString().split(",")[0];

                // display city name and current date
                currentCity.innerHTML = data.name + "<img id='current-image'></img> - " + currentDate;
                let currentImage = document.getElementById("current-image");

                
                // display image
                currentImage.setAttribute("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png")

                // fetch weather information
                fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=c27b9b81b7f93aea690fde8c69e2c184`)
                .then(function(response){
                    return response.json()
                        
                        
                    
                }).then(function(data){
                    currentWeather(data);
                    fiveDayForecast(data);
                })  
            })
        }else{
            alert("Did not recongize input. Please make sure you enter a city.");
        }
    }) 
}


let currentWeather = function(data){
    // display current temp
    currentTemp.innerHTML = Math.round(data.current.temp) + "°F";

    // display current humidity
    currentHumidity.innerHTML = data.current.humidity + "%";

    // display current wind
    currentWind.innerHTML = data.current.wind_speed + "MPH";

    // display current UVI color-coded
    currentUVI.innerHTML = data.current.uvi;
    if(data.current.uvi > 8){
        currentUVI.setAttribute("class", "alert text-white bg-danger")
    }else if(data.current.uvi > 2){
        currentUVI.setAttribute("class", "alert text-white bg-warning")
    }else if(data.current.uvi >= 0){
        currentUVI.setAttribute("class", "alert text-white bg-success")
    }
}

let fiveDayForecast = function(data){
    
    // remove previous cards
    forecast.innerHTML = "";

    for(let i = 1; i < 6; i++){
        // create card container
        let dayCard = document.createElement("div");
        dayCard.setAttribute("class", "col-md-3 col-lg-2 card bg-primary mb-3 mr-2 pt-2");
        forecast.appendChild(dayCard);

        // create card body
        let cardBody = document.createElement("div");
        cardBody.setAttribute("class", "card-body text-light p-0 pb-3");
        dayCard.appendChild(cardBody);

        // create card date
        let cardDate = document.createElement("h5");
        cardDate.setAttribute("class", "card-title");
        cardBody.appendChild(cardDate);

        // translate timestamp to date and display
        let timestamp = data.daily[i].dt;
        let date = new Date(timestamp * 1000);
        date = date.toLocaleString().split(",")[0];
        cardDate.innerHTML = date;

        // create card image element
        let cardImg = document.createElement("img");
        cardBody.appendChild(cardImg);

        // display weather icon 
        let weatherIcon = data.daily[i].weather[0].icon;
        cardImg.setAttribute("src", "http://openweathermap.org/img/wn/" + weatherIcon + ".png");

        // display temperature
        let cardTemp = document.createElement("p");
        cardTemp.setAttribute("class", "card-text");
        let dailyTemp = Math.round(data.daily[i].temp.day);
        cardTemp.innerHTML = `Temp: ${dailyTemp}°F`;
        cardBody.appendChild(cardTemp);
        
        // display humidity
        let cardHumidity = document.createElement("p");
        cardHumidity.setAttribute("class", "card-text");
        cardHumidity.innerHTML = `Humidity: ${data.daily[i].humidity}%`;
        cardBody.appendChild(cardHumidity);
        
    }
}

let storeCitySearch = function(city){
    
    console.log(city);
    // pushes new city into array
    searchedCities.push(city);

    
    
    //clears previous search displays
    searchCard.innerHTML = "";
    
    
    // displays searched cities 
    for(let i = 0; i < searchedCities.length; i++){
            
       let listedCity = document.createElement("li");
       listedCity.setAttribute("class", "list-group-item");
       searchCard.appendChild(listedCity);
       let cityLink = document.createElement("a");
       cityLink.setAttribute("href","#");
       cityLink.setAttribute("class", "searched-city")
       cityLink.innerHTML = searchedCities[i];
       listedCity.appendChild(cityLink);
       
    }

    // stores city into localstorage
    localStorage.setItem("city", JSON.stringify(searchedCities));
}

let previousSearches = function(event){
    let targetEl = event.target;

    if(targetEl.matches(".searched-city")){
        console.log(targetEl);
        let city = targetEl.textContent;
        fetchWeather(city);
    }
   
    

}
let citySearch = function(){
    let city = document.getElementById("city-input").value.trim().toLowerCase();

    if(city){
        debugger;
        fetchWeather(city);
        storeCitySearch(city);
        city.innerHTML = "";
    }else{
        alert("Please enter a city.")
    }
}
searchButton.addEventListener("click", citySearch);
searchCard.addEventListener("click", previousSearches);
