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

function fetchMasterData(zipCode) {
  let postalURL = `https://api.openbrewerydb.org/v1/breweries?by_postal=${zipCode}`;

  fetch(postalURL)
    .then((response) => response.json())
    .then(getCoordinates);
}
/**
 * set reference location coordinates
 * @param {*} allData
 */
function getCoordinates(allData) {
  console.log(allData);
  lat = Number(allData[0].latitude);
  lon = Number(allData[0].longitude);
  referenceLocation = {
    lat: lat,
    lon: lon,
  };
  fetchByDistanceData();
  console.log(referenceLocation);
  nameOfBrewery = allData[0].name;
  address = allData[0].address_1;
  phone = allData[0].phone;
  website = allData[0].website_url;

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
    distanceAndBoolean.push(tempArray);
  }

  // has distance from origin point in km
  console.log(distanceAndBoolean);
}

// $(function () {
//   $("#size").selectmenu();
//   $("#salutation").selectmenu();
// });

/**
 * datepicker function
 */
// $(function () {
//   $("#datepicker").datepicker();
//   const value = $("#datepicker").val();
//   console.log(value);
// });
