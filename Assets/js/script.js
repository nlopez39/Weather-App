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
var searchContainerEl = document.querySelector(".search-container");
var listButtonsContainer = document.querySelector(".list-buttons");
const date = new Date();

let day = date.getDate();
let month = "0" + (date.getMonth() + 1);
let year = date.getFullYear();

// This arrangement can be altered based on how we want the date's format to appear.
let currentDate = `${year}-${month}-${day}`;
console.log(currentDate);

function findFirstDayWeather() {
  var city1 = userInput.value;

  var weatherUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city1 +
    "&appid=" +
    apiKey;
  return fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var currData = [];
      currData.push({
        date: currentDate,
        icon: data.weather[0].icon,
        name: data.name,
        temperature: parseInt(
          ((parseInt(data.main.temp) - 273.15) * 9) / 5 + 32
        ),
        wind: data.wind.speed,
        humidity: data.main.humidity,
      });
      return currData;
    });
}

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
      console.log(data);
      // console.log(data.list[0].weather[0].icon);
      // console.log(data.city.name);
      var forecastData = [];
      var dateVar = currentDate;
      for (var i = 0; i < data.list.length; i++) {
        var currentData = data.list[i + 1];
        //check if the element exists
        if (currentData && currentData.dt_txt) {
          var forecastDate = currentData.dt_txt.slice(0, 10);
          console.log(forecastDate);

          if (i === data.list.length - 1 || dateVar !== forecastDate) {
            dateVar = forecastDate;
            forecastData.push({
              name: data.city.name,
              date: dateVar,
              icon: currentData.weather[0].icon,
              temperature1: parseInt(
                ((parseInt(currentData.main.temp) - 273.15) * 9) / 5 + 32
              ),
              wind: currentData.wind.speed,
              humidity: currentData.main.humidity,
            });

            // dateVar = forecastDate;
          }
        }
      }

      return forecastData;
    });
}
//-----------------------------------------Event listener for clicks on the search button-------------------//
var storedForecastData;
var storedWeatherData;
var createHistory;
searchBtn.addEventListener("click", function () {
  var hiddenItems = document.querySelectorAll(".hidden");
  hiddenItems.forEach(function (item) {
    item.setAttribute("style", "");
  });
  findFirstDayWeather().then(function (currData) {
    currData.forEach(function (weather, index) {
      //this is the name header for the weather container
      var nameContainer1 = document.querySelector(".weather-h1");
      if (nameContainer1) {
        nameContainer1.textContent = weather.name;
      }
      var weatherContainer = document.querySelectorAll(".weather")[index];

      if (weatherContainer) {
        var dateContainer =
          weatherContainer.querySelector("ul li:nth-child(1)");
        dateContainer.textContent = weather.date;
        var iconContainer = weatherContainer.querySelector(
          "ul li:nth-child(2) img"
        );
        iconContainer.src = `http://openweathermap.org/img/w/${weather.icon}.png`;
        var tempContainer =
          weatherContainer.querySelector("ul li:nth-child(3)");
        tempContainer.textContent = "Temp: " + weather.temperature + "°F";
        var windContainer =
          weatherContainer.querySelector("ul li:nth-child(4)");
        windContainer.textContent = "Wind: " + weather.wind + " MPH";
        var humContainer = weatherContainer.querySelector("ul li:nth-child(5)");
        humContainer.textContent = "Humidity: " + weather.humidity + "%";
      }
      storedWeatherData = JSON.parse(
        localStorage.getItem("weatherData") || "[]"
      );
      storedWeatherData.push(weather);

      localStorage.setItem("weatherData", JSON.stringify(storedWeatherData));
    });
  });

  //five Day forecast
  findFiveDayForecast().then(function (forecastData) {
    createHistory = document.createElement("button");
    //pull the data and loop through it
    forecastData.forEach(function (forecast, index) {
      createHistory.setAttribute("id", forecast.name);
      createHistory.setAttribute("class", "mb-2 btn btn-secondary");

      createHistory.textContent = forecast.name;
      //this is the name header for the weather container
      // var nameContainer1 = document.querySelector(".weather-h1");
      // if (nameContainer1) {
      //   nameContainer1.textContent = forecast.name;
      // }
      var forecastContainer = document.querySelectorAll(".forecast")[index];

      if (forecastContainer) {
        var dateContainer =
          forecastContainer.querySelector("ul li:nth-child(1)");
        dateContainer.textContent = forecast.date;
        var iconContainer = forecastContainer.querySelector(
          "ul li:nth-child(2) img"
        );
        iconContainer.src = `http://openweathermap.org/img/w/${forecast.icon}.png`;
        var tempContainer =
          forecastContainer.querySelector("ul li:nth-child(3)");
        tempContainer.textContent = "Temp: " + forecast.temperature1 + "°F";
        var windContainer =
          forecastContainer.querySelector("ul li:nth-child(4)");
        windContainer.textContent = "Wind: " + forecast.wind + " MPH";
        var humContainer =
          forecastContainer.querySelector("ul li:nth-child(5)");
        humContainer.textContent = "Humidity: " + forecast.humidity + "%";
      }

      //reset form
      formEl.reset();

      storedForecastData = JSON.parse(
        localStorage.getItem("forecastData") || "[]"
      );
      storedForecastData.push(forecast);

      localStorage.setItem("forecastData", JSON.stringify(storedForecastData));
    });

    buttonList.appendChild(createHistory);
  }); //end of Five Day Forecast
});
//----------------------------------Event listener for clicks on the Search History------------------------------//
listButtonsContainer.addEventListener("click", function (event) {
  var clickedElement = event.target;
  if (clickedElement.tagName === "BUTTON") {
    //output the weather container data
    for (var i = 0; i < storedWeatherData.length; i++) {
      if (storedWeatherData[i].name == clickedElement.textContent) {
        var nameContainer = document.querySelector(".weather-h1");
        if (nameContainer) {
          //checkmark
          nameContainer.textContent = storedWeatherData[i].name;
        }
        var weatherContainer = document.querySelector(".weather");
        if (weatherContainer) {
          var dateContainer =
            weatherContainer.querySelector("ul li:nth-child(1)");
          dateContainer.textContent = storedWeatherData[i].date;
          var iconContainer = weatherContainer.querySelector(
            "ul li:nth-child(2) img"
          );
          iconContainer.src = `http://openweathermap.org/img/w/${storedWeatherData[i].icon}.png`;
          var tempContainer =
            weatherContainer.querySelector("ul li:nth-child(3)");
          tempContainer.textContent =
            "Temp: " + storedWeatherData[i].temperature + "°F";
          var windContainer =
            weatherContainer.querySelector("ul li:nth-child(4)");
          windContainer.textContent =
            "Wind: " + storedWeatherData[i].wind + " MPH";
          var humContainer =
            weatherContainer.querySelector("ul li:nth-child(5)");
          humContainer.textContent =
            "Humidity: " + storedWeatherData[i].humidity + "%";
        }
      }
    }

    var j = 0;
    for (var i = 0; i < storedForecastData.length; i++) {
      if (j == 5) {
        j = 0;
      }
      if (storedForecastData[i].name == clickedElement.textContent) {
        // //if its the city the user clicked in history then update the HTML TAGS
        // var nameContainer1 = document.querySelector(".forecast-h1");

        // //changes the name header
        // if (nameContainer1) {
        //   //checkmark
        //   nameContainer1.textContent = storedForecastData[i].name;
        // }

        //pulls all the forecast containers
        var forecastContainer = document.querySelectorAll(".forecast")[j];

        console.log("This is the i index: " + i);
        console.log("this is the j index: " + j);
        //checks if the forecast containers exist and if they do then change each to the corresponing
        //clicked city button
        if (forecastContainer) {
          console.log("forecast containter exists /Roman/");
          var dateContainer =
            forecastContainer.querySelector("ul li:nth-child(1)");
          dateContainer.textContent = storedForecastData[i].date;
          var iconContainer = forecastContainer.querySelector(
            "ul li:nth-child(2) img"
          );
          iconContainer.src = `http://openweathermap.org/img/w/${storedForecastData[i].icon}.png`;
          var tempContainer =
            forecastContainer.querySelector("ul li:nth-child(3)");
          tempContainer.textContent =
            "Temp: " + storedForecastData[i].temperature1 + "°F";
          var windContainer =
            forecastContainer.querySelector("ul li:nth-child(4)");
          windContainer.textContent =
            "Wind: " + storedForecastData[i].wind + " MPH";
          var humContainer =
            forecastContainer.querySelector("ul li:nth-child(5)");
          humContainer.textContent =
            "Humidity: " + storedForecastData[i].humidity + "%";

          console.log("This is the id  " + clickedElement.textContent);
        }
      } else {
        console.log("Somethign else");
      }
      //increment j
      j++;
    }
  }
});
