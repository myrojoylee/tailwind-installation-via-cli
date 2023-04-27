let allData,
  zipCode,
  map,
  nameOfBrewery,
  address,
  phone,
  website,
  marker,
  circle,
  kmY,
  kmX,
  distX,
  distY,
  distanceOfTempLocation,
  referenceLocation,
  tempLocation,
  sortedByDistance;
let distanceAndBoolean = [];
let nameAndCoordinates = [];
let withinFiveMiles = [];
let withinTenMiles = [];
const WeatherAPIKey = "021e75b0e3380e236b4ff6031ae2dde4";
const submitBtn = document.querySelector("#submit");
const userZipCode = document.querySelector("#search-zipcode");
const userInput = document.querySelector(".user-input");
const placeName = document.querySelector(".place-name");
const streetAddress = document.querySelector(".street-address");
const placePhone = document.querySelector(".phone");
const websiteURL = document.querySelector(".website-url");
let lat, lon;

submitBtn.addEventListener("click", function () {
  userInput.textContent = Number(userZipCode.value);
  zipCode = Number(userZipCode.value);
  fetchMasterData(zipCode);
});

// function fetchMasterData(zipCode) {
//   let postalURL = `https://api.openbrewerydb.org/v1/breweries?by_postal=${zipCode}`;

//   fetch(postalURL)
//     .then((response) => response.json())
//     .then(getCoordinates);
// }

function fetchMasterData(zipCode) {
  let postalURL = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode}&appid=${WeatherAPIKey}`;

  fetch(postalURL)
    .then((response) => response.json())
    .then(getCoordinates);
}
/**
 * set reference location coordinates
 * @param {*} allData
 */
function getCoordinates(allData) {
  let y = allData;
  console.log(y);
  lat = y.lat;
  lon = y.lon;
  console.log(lat);
  console.log(lon);
  referenceLocation = {
    lat: lat,
    lon: lon,
  };
  fetchByDistanceData();
  console.log(referenceLocation);
  // nameOfBrewery = allData[0].name;
  // address = allData[0].address_1;
  // phone = allData[0].phone;
  // website = allData[0].website_url;

  renderDetails();
}

/**
 * getting all the breweries nearby, sorted by distance
 */
function fetchByDistanceData() {
  let distanceURL = `https://api.openbrewerydb.org/v1/breweries?by_dist=${lat},${lon}`;

  fetch(distanceURL)
    .then((response) => response.json())
    .then(getArraySortedByDistance);
}

function getArraySortedByDistance(x) {
  sortedByDistance = x;
  console.log(sortedByDistance);
  let tempObject;
  for (let i = 0; i < sortedByDistance.length; i++) {
    tempObject = {
      name: sortedByDistance[i].name,
      lat: Number(sortedByDistance[i].latitude),
      lon: Number(sortedByDistance[i].longitude),
    };

    nameAndCoordinates.push(tempObject);
  }
  console.log(nameAndCoordinates);
  checkCoordinates();
}

/**
 * gets map on the screen
 */
function renderDetails() {
  map = L.map("map").setView([lat, lon], 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  marker = L.marker([lat, lon]).addTo(map);

  circle = L.circle([lat, lon], {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.5,
    radius: 1609.34,
  }).addTo(map);

  placeName.innerHTML = `<i class="fa-regular fa-heart"></i> ${nameOfBrewery}`;
  streetAddress.textContent = address;
  placePhone.textContent = phone;
  websiteURL.textContent = website;
}

function checkCoordinates() {
  let tempArray;
  const fiveMileDistance = 8.04672;
  const tenMileDistance = 16.0934;

  for (let i = 0; i < nameAndCoordinates.length; i++) {
    // in this case, distanceOfTempLocation is they hypotenuse (h)
    // in Pythagoras' theorem, with h^2 = x^2 + y^2
    kmY = 40000 / 360;
    kmX = Math.cos((Math.PI * referenceLocation.lat) / 180) * kmY;
    distX = Math.abs(referenceLocation.lon - nameAndCoordinates[i].lon) * kmX;
    distY = Math.abs(referenceLocation.lat - nameAndCoordinates[i].lat) * kmY;
    distanceOfTempLocation = Math.sqrt(distX ** 2 + distY ** 2);
    tempArray = {
      name: nameAndCoordinates[i].name,
      lat: nameAndCoordinates[i].lat,
      lon: nameAndCoordinates[i].lon,
      distanceFromOrigin: distanceOfTempLocation,
    };

    if (
      0 <= distanceOfTempLocation &&
      distanceOfTempLocation <= tenMileDistance
    ) {
      if (distanceOfTempLocation <= fiveMileDistance) {
        withinFiveMiles.push(tempArray);
      }
      withinTenMiles.push(tempArray);
    }

    distanceAndBoolean.push(tempArray);
  }
  console.log(withinFiveMiles);
  console.log(withinTenMiles);
  console.log(distanceAndBoolean);
}
