const wrapper = document.querySelector(".wrapper"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
weatherPart = wrapper.querySelector(".weather-part"),
wIcon = weatherPart.querySelector("img"),
arrowBack = wrapper.querySelector("header i");

let api;

let apiKey = "1dff2bc3c8cf4625fa46944476aad861";

inputField.addEventListener("keyup", (e) => {
if (e.key === "Enter" && inputField.value !== "") {
  requestApi(inputField.value);
}
});

locationBtn.addEventListener("click", () => {
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(onSuccess, onError);
} else {
  alert("Your browser does not support geolocation.");
}
});

function requestApi(city) {
api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
fetchData();
}

function onSuccess(position) {
const { latitude, longitude } = position.coords;
api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
fetchData();
}

function onError(error) {
infoTxt.innerText = error.message;
infoTxt.classList.add("error");
}

function fetchData() {
infoTxt.innerText = "Getting weather details...";
infoTxt.classList.add("pending");
fetch(api)
  .then((res) => res.json())
  .then(weatherDetails)
  .catch(() => {
    infoTxt.innerText = "Something went wrong";
    infoTxt.classList.replace("pending", "error");
  });
}

function weatherDetails(info) {
if (info.cod === "404") {
  infoTxt.classList.replace("pending", "error");
  infoTxt.innerText = `${inputField.value} isn't a valid city name`;
} else {
  const { name: city, sys: { country }, weather: [{ description, id }], main: { temp, feels_like, humidity } } = info;

  const images = {
    "800": "clear.svg",
    "200-232": "storm.svg",
    "600-622": "snow.svg",
    "701-781": "haze.svg",
    "801-804": "cloud.svg",
    "500-531-300-321": "rain.svg"
  };

  const imagesKeys = Object.keys(images).find((range) => {
    const [min, max] = range.split('-').map(Number);
    return (id >= min && id <= max);
  });

  wIcon.src = `images/${images[imagesKeys] || "clear.svg"}`;

  weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
  weatherPart.querySelector(".weather").innerText = description;
  weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
  weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
  weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
  infoTxt.classList.remove("pending", "error");
  infoTxt.innerText = "";
  inputField.value = "";
  wrapper.classList.add("active");
}
}

arrowBack.addEventListener("click", () => {
wrapper.classList.remove("active");
});