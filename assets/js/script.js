/**/
const searchHistory = document.getElementById('search-history');
const deleteHistory = document.getElementById('deleteSearches');




/**/
deleteSearches = () => {
    localStorage.removeItem('cities');
    location.reload();
};



/**/
saveWeatherResults = (locationInput) => {
    let storedCities = JSON.parse(localStorage.getItem('cities')) || [];

    storedCities.push(locationInput);

    localStorage.setItem('cities', JSON.stringify(storedCities));
};



/**/
nextFiveDays = (latitude, longitude) => {
    let oneCallApi = 'https://api.openweathermap.org/data/2.5/onecall?&lat=' + latitude + '&lon=' + longitude + '&exclude=minutely,hourly&appid=5c71643f7754882962dd3859f2f84f94&units=imperial'

    fetch(oneCallApi)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            for (let i = 0; i < 6; i++) {
                let futureDays = document.getElementById(`date${i + 1}`)
                futureDays.innerHTML = '';

                let listOfDays = document.getElementById(`day${i + 1}`);
                listOfDays.innerHTML = '';

                let dayInformation = document.createElement('div')
                let dateItem = new Date(data.daily[i].dt * 1000).toLocaleDateString('en-US');

                dayInformation.textContent = dateItem;
                document.getElementById(`date${i + 1}`).appendChild(dayInformation);


                let currentIconUrl = `https://openweathermap.org/img/w/${data.current.weather[0].icon}.png`
                let weatherIcon = document.createElement('img')

                weatherIcon.setAttribute('src', currentIconUrl);
                weatherIcon.classList.add('icon');
                document.getElementById(`day${i + 1}`).appendChild(weatherIcon);

                //current weather
                let currentTempMax = data.daily[i].temp.max;

                let tempMax = document.createElement('p')
                tempMax.textContent = 'Temperature Max:' + ' ' + currentTempMax + ' ' + '°F';
                document.getElementById(`day${i + 1}`).appendChild(tempMax);

                let currentTempMin = data.daily[i].temp.min;

                let tempMin = document.createElement('p')
                tempMin.textContent = 'Temperature Min:' + ' ' + currentTempMin + ' ' + '°F';
                document.getElementById(`day${i + 1}`).appendChild(tempMin);

                let currentHumidity = data.current.humidity;

                let humidity = document.createElement('p')
                humidity.textContent = 'Humidity:' + ' ' + currentHumidity + ' ' + '%';
                document.getElementById(`day${i + 1}`).appendChild(humidity);

                let currentWindSpeed = data.daily[i].wind_speed;

                let wind = document.createElement('p')
                wind.textContent = 'Wind Speed:' + ' ' + currentWindSpeed + ' ' + 'MPH';
                document.getElementById(`day${i + 1}`).appendChild(wind);

                let currentUvi = data.daily[i].uvi;

                let uvi = document.createElement('p');
                uvi.textContent = 'UV Index:' + ' ' + currentUvi;
                if (currentUvi < 3) {
                    uvi.classList.add('favorable');
                } else if (currentUvi < 7) {
                    uvi.classList.add('moderate');
                } else {
                    uvi.classList.add('severe');
                }
                document.getElementById(`day${i + 1}`).appendChild(uvi);
            };
        })
};




/**/
forecastForLocation = (location) => {
    let apiLatitudeAndLongitude = 'https://api.openweathermap.org/data/2.5/weather?q=' + location + '&appid=5c71643f7754882962dd3859f2f84f94'
    const searchedCity = document.getElementById('city');


    fetch(apiLatitudeAndLongitude)
        .then(function (response) {

            if (response.ok) {
                response.json().then(function (data) {

                    let lat = data.coord.lat;
                    let lon = data.coord.lon;

                    nextFiveDays(lat, lon);
                    searchedCity.textContent = location;
                })
            }
        })
};




/**/
addButtonsOfRecentSearches = () => {
    let storedCities = JSON.parse(localStorage.getItem('cities')) || [];
    const locationWeatherInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    for (let i = 0; i < storedCities.length; i++) {
        let weatherBtnLocation = document.createElement('button');
        weatherBtnLocation.textContent = storedCities[i];
        weatherBtnLocation.classList.add('button');
        weatherBtnLocation.addEventListener('click', function () {
            forecastForLocation(this.textContent);
        });
        searchHistory.append(weatherBtnLocation);
    };
};




/**/
displaySaveWeatherResults = () => {
    const locationWeatherInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    searchBtn.addEventListener('click', function (event) {
        event.preventDefault();
        if (locationWeatherInput.value) {
            forecastForLocation(locationWeatherInput.value);
            saveWeatherResults(locationWeatherInput.value);
            updatedSaveWeatherResults(locationWeatherInput.value);
        }
    });
}




/**/
updatedSaveWeatherResults = (latestCity) => {
    let weatherBtnLocation = document.createElement('button');

    weatherBtnLocation.textContent = latestCity;

    weatherBtnLocation.classList.add('button');

    weatherBtnLocation.addEventListener('click', function () {
        console.log('this is some text', this);
        forecastForLocation(this.textContent);
    });

    searchHistory.append(weatherBtnLocation);
};
















/**/
deleteHistory.addEventListener('click', deleteSearches);
addButtonsOfRecentSearches();
displaySaveWeatherResults();