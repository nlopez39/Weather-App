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
      // console.log(data.city.name);
      var forecastData = [];
      for (var i = 0; i < data.list.length; i++) {
        var dateVar = data.list[i].dt_txt.slice(0, 10);
        console.log(dateVar);
        ///if we have reached the last eleement  or if data.list[i+1] an element exists or if we hit the last eleemt  && data Var !===exists first
        if (
          i === data.list.length - 1 ||
          (data.list[i + 1] && dateVar !== data.list[i + 1].dt_txt.slice(0, 10))
        ) {
          // if (dateVar !== data.list[i + 1].dt_txt.slice(0, 10)) {
          forecastData.push({
            name: data.city.name,
            date: dateVar,
            temperature1: parseInt(
              ((parseInt(data.list[i].main.temp) - 273.15) * 9) / 5 + 32
            ), //this will get the temperature
            //   icon: data.weather[0].icon, //gets icon
            wind: data.list[i].wind.speed,
            humidity: data.list[i].main.humidity,
          });
          // }
        }
      }
      return forecastData;
    });
}
//-----------------------------------------Event listener for clicks on the search button-------------------//
var storedForecastData;
var createHistory;
searchBtn.addEventListener("click", function () {
  findFiveDayForecast().then(function (forecastData) {
    createHistory = document.createElement("button");
    //pull the data and loop through it
    forecastData.forEach(function (forecast, index) {
      createHistory.setAttribute("id", forecast.name);
      createHistory.textContent = forecast.name;
      var nameContainer1 = document.querySelector(".col h1");
      if (nameContainer1) {
        nameContainer1.textContent = forecast.name;
      }
      var forecastContainer = document.querySelectorAll(".forecast")[index];

      if (forecastContainer) {
        var dateContainer =
          forecastContainer.querySelector("ul li:nth-child(1)");
        dateContainer.textContent = "Date: " + forecast.date;
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
  });
});
//----------------------------------Event listener for clicks on the Search History------------------------------//
listButtonsContainer.addEventListener("click", function (event) {
  var clickedElement = event.target;
  if (clickedElement.tagName === "BUTTON") {
    for (var i = 0; i < storedForecastData.length; i++) {
      if (storedForecastData[i + 1] || i === storedForecastData.length - 1) {
        if (storedForecastData[i].name == clickedElement.textContent) {
          //if its the city the user clicked in history then update the HTML TAGS
          var nameContainer1 = document.querySelector(".col h1");
          if (nameContainer1) {
            nameContainer1.textContent = storedForecastData[i].name;
          }
          var forecastContainer = document.querySelectorAll(".forecast")[i];

          if (forecastContainer) {
            var dateContainer =
              forecastContainer.querySelector("ul li:nth-child(1)");
            dateContainer.textContent = "Date: " + storedForecastData[i].date;
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
          } else {
            console.log("Somethign else");
          }
        }
      }
    }
  }
});
