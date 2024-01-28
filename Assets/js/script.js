// var requestURL =
//   "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}";
var apiKey = "84f9e91b50325b5c4edd114e88170ea5";

// //You'll want to allow your application to accept user input and store it in the variable
// // that you've created. You'll also likely need to specify state and country variables in your API call,
// //as multiple countries or states might have cities with the same name.
// //For the purposes of this guide, you can use the city variable that you just created.
var formEl = document.getElementById("form");
var userInput = document.getElementById("search-bar");
var searchBtn = document.getElementById("search-btn");
var buttonList = document.querySelector(".list-buttons");

function findFiveDayForecast() {
  var city2 = userInput.value;

  var secondUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city2 +
    "&appid=" +
    apiKey;

  return fetch(secondUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var forecastData = [];
      var daysProcessed;
      for (var i = 0; i < data.list.length; i += 8) {
        forecastData.push({
          date: data.list[i].dt_txt,
          temperature1: parseInt(
            ((parseInt(data.list[i].main.temp) - 273.15) * 9) / 5 + 32
          ), //this will get the temperature
          //   icon: data.weather[0].icon, //gets icon
          wind: data.list[i].wind.speed,
          humidity: data.list[i].main.humidity,
        });
        daysProcessed++;
        if (daysProcessed == 5) {
          break;
        }
      }
      return forecastData;
    });
}

function findCity() {
  var city = userInput.value;
  // console.log(city);

  var requestUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    apiKey;

  return fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      return {
        cityName: data.name,
        temperature: data.main.temp, //this will get the temperature
        icon: data.weather[0].icon, //gets icon
        wind: data.wind.speed,
        humidity: data.main.humidity,
      };
    });
}

searchBtn.addEventListener("click", function () {
  findCity().then(function ({ cityName, temperature, icon, wind, humidity }) {
    console.log(cityName);
    // var createDiv = document.createElement("div");
    var createHistory = document.createElement("button");
    createHistory.textContent = cityName;
    //append button to the div
    buttonList.appendChild(createHistory);
    // createDiv.append(createHistory);
    //change temp, wind and humidity from Atlanta
    var nameContainer1 = document.querySelector(".col h1");
    nameContainer1.textContent = cityName;
    var tempContainer1 = document.querySelector(".temp");
    tempContainer1.textContent =
      "Temp: " +
      parseInt(((parseInt(temperature) - 273.15) * 9) / 5 + 32) +
      "°F";
    var windContainer1 = document.querySelector(".wind");
    windContainer1.textContent = "Wind: " + wind + " MPH";
    var humContainer1 = document.querySelector(".humidity");
    humContainer1.textContent = "Humidity: " + humidity + "%";
    //reset form
    formEl.reset();
  });
  findFiveDayForecast().then(function (forecastData) {
    forecastData.forEach(function (forecast, index) {
      var forecastContainer =
        document.querySelectorAll(".col.me-4.border")[index];

      var dateContainer = forecastContainer.querySelector("ul li:nth-child(1)");
      dateContainer.textContent = "Date: " + forecast.date;
      var tempContainer = forecastContainer.querySelector("ul li:nth-child(3)");
      tempContainer.textContent = "Temp: " + forecast.temperature1 + "°F";
      var windContainer = forecastContainer.querySelector("ul li:nth-child(4)");
      windContainer.textContent = "Wind: " + forecast.wind + " MPH";
      var humContainer = forecastContainer.querySelector("ul li:nth-child(5)");
      humContainer.textContent = "Humidity: " + forecast.humidity + "%";
    });
  });
});
