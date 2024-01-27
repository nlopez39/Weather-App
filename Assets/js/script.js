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

function findCity() {
  var city = "London";

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
      return data.name;
    });
}

searchBtn.addEventListener("click", function () {
  findCity().then(function (cityName) {
    console.log(cityName);
    var createDiv = document.createElement("div");
    var createHistory = document.createElement("button");
    createHistory.textContent = cityName;
    //append button to the div
    formEl.append(createDiv);
    createDiv.append(createHistory);
  });
});
