// var requestURL =
//   "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}";
var apiKey = "84f9e91b50325b5c4edd114e88170ea5";

//You'll want to allow your application to accept user input and store it in the variable
// that you've created. You'll also likely need to specify state and country variables in your API call,
//as multiple countries or states might have cities with the same name.
//For the purposes of this guide, you can use the city variable that you just created.

var city;
var queryURL =
  "http://api.openweathermap.org/data/2.5/weather?q=" +
  city +
  "&appid=" +
  APIKey;

fetch(queryURL);
