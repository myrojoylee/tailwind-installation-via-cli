let allData,
  zipCode,
  map,
  nameOfBrewery,
  address,
  phone,
  website,
  markerFive,
  markerTen,
  markerFifteen,
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
let withinFifteenMiles = [];
const WeatherAPIKey = "021e75b0e3380e236b4ff6031ae2dde4";
const submitBtn = document.querySelector("#submit");
const userZipCode = document.querySelector("#search-zipcode");
const userInput = document.querySelector(".user-input");
const placeName = document.querySelector(".place-name");
const streetAddress = document.querySelector(".street-address");
const placePhone = document.querySelector(".phone");
const websiteURL = document.querySelector(".website-url");
const fiveMileButton = document.querySelector("#fiveMiles");
const tenMileButton = document.querySelector("#tenMiles");
const articleSibling = document.querySelector(".article-sibling");
const parentalAdvisory = document.querySelector(".parentalAdvisory");
const radioButtons = document.querySelectorAll('input[name="mileRadius"]');
const radiusOptions = document.querySelectorAll('input[name="radius-option"]');
const radiusCheck = document.querySelector("#radius-check");

let state = 0;
let lat, lon;
let createList,
  createListItem,
  createListTen,
  createListFifteen,
  createListItemTen,
  createListItemFifteen,
  layerGroupFive,
  layerGroupTen,
  layerGroupFifteen;

submitBtn.addEventListener("click", function () {
  radiusCheck.addEventListener("change", displayLists);
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
  referenceLocation = {
    lat: lat,
    lon: lon,
  };
  fetchByDistanceData();
  console.log(referenceLocation);

  // we need to empty the map container to generate another
  // we also need to empty out our arrays for every new search

  clearPreviousMap(10);
}

function clearPreviousMap(zoomValue) {
  if (map == undefined) {
    renderMap(zoomValue);
  } else {
    distanceAndBoolean = [];
    nameAndCoordinates = [];
    withinFiveMiles = [];
    withinTenMiles = [];
    withinFifteenMiles = [];
    map.remove();
    renderMap(zoomValue);
  }
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
  // console.log(sortedByDistance);
  let tempObject;
  for (let i = 0; i < sortedByDistance.length; i++) {
    tempObject = {
      name: sortedByDistance[i].name,
      lat: Number(sortedByDistance[i].latitude),
      lon: Number(sortedByDistance[i].longitude),
    };

    nameAndCoordinates.push(tempObject);
  }

  checkCoordinates();
}

/**
 * gets map on the screen
 */
function renderMap(zoomValue) {
  map = L.map("map").setView([lat, lon], zoomValue);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
}

function renderSearchCircle(radiusInMeters) {
  circle = L.circle([lat, lon], {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.5,
    radius: radiusInMeters,
  }).addTo(map);
}

function checkCoordinates() {
  let tempArray;
  const fiveMileDistance = 8.04672;
  const tenMileDistance = 16.0934;
  const fifteenMileDistance = 24.1402;

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
      distanceOfTempLocation <= fifteenMileDistance
    ) {
      if (distanceOfTempLocation <= tenMileDistance) {
        if (distanceOfTempLocation <= fiveMileDistance) {
          withinFiveMiles.push(tempArray);
        }
        withinTenMiles.push(tempArray);
      }
      withinFifteenMiles.push(tempArray);
    }
    distanceAndBoolean.push(tempArray);
  }
  console.log(withinFiveMiles);
  console.log(withinTenMiles);
  console.log(withinFifteenMiles);
  // console.log(distanceAndBoolean);
  // createFiveList();
  // createTenList();
}

function createFiveList() {
  let tempMarkerLayerFive = [];

  createList = document.createElement("ul");
  createList.textContent = "Within 5 miles:";
  createList.setAttribute("id", "fiveMileList");
  parentalAdvisory.insertBefore(createList, articleSibling);
  for (let i = 0; i < withinFiveMiles.length; i++) {
    createListItem = document.createElement("li");
    createListItem.textContent = withinFiveMiles[i].name;
    createList.appendChild(createListItem);
    createListItem.style.fontWeight = "400";

    markerFive = new L.marker([withinFiveMiles[i].lat, withinFiveMiles[i].lon])
      .bindPopup(withinFiveMiles[i].name)
      .addTo(map);
    tempMarkerLayerFive.push(markerFive);
  }
  layerGroupFive = new L.layerGroup(tempMarkerLayerFive);
  layerGroupFive.addTo(map);
}

function createTenList() {
  let tempMarkerLayerTen = [];

  createListTen = document.createElement("ul");
  createListTen.textContent = "Within 10 miles:";
  createListTen.setAttribute("id", "tenMileList");
  parentalAdvisory.insertBefore(createListTen, articleSibling);
  for (let i = 0; i < withinTenMiles.length; i++) {
    createListItemTen = document.createElement("li");
    createListItemTen.textContent = withinTenMiles[i].name;
    createListTen.appendChild(createListItemTen);
    createListItemTen.style.fontWeight = "400";

    markerTen = new L.marker([withinTenMiles[i].lat, withinTenMiles[i].lon])
      .bindPopup(withinTenMiles[i].name)
      .addTo(map);
    tempMarkerLayerTen.push(markerTen);
  }
  layerGroupTen = new L.layerGroup(tempMarkerLayerTen);
  layerGroupTen.addTo(map);
}

function createFifteenList() {
  let tempMarkerLayerFifteen = [];

  createListFifteen = document.createElement("ul");
  createListFifteen.textContent = "Within 15 miles:";
  createListFifteen.setAttribute("id", "fifteenMileList");
  parentalAdvisory.insertBefore(createListFifteen, articleSibling);
  for (let i = 0; i < withinFifteenMiles.length; i++) {
    createListItemFifteen = document.createElement("li");
    createListItemFifteen.textContent = withinFifteenMiles[i].name;
    createListFifteen.appendChild(createListItemFifteen);
    createListItemFifteen.style.fontWeight = "400";

    markerFifteen = new L.marker([
      withinFifteenMiles[i].lat,
      withinFifteenMiles[i].lon,
    ])
      .bindPopup(withinFifteenMiles[i].name)
      .addTo(map);
    tempMarkerLayerFifteen.push(markerFifteen);
  }
  layerGroupFifteen = new L.layerGroup(tempMarkerLayerFifteen);
  layerGroupFifteen.addTo(map);
}

function eraseOtherLists() {
  let findLists = parentalAdvisory.querySelectorAll("ul");
  for (let i = 0; i < findLists.length; i++) {
    findLists[i].remove();
  }
}

function displayLists() {
  console.log("we changed options!!!!");
  map.eachLayer(function (layer) {
    map.removeLayer(layer);
  });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  eraseOtherLists();
  if (radiusCheck.value === "5 miles") {
    // if (circle !== undefined) {
    //   map.removeLayer(circle);
    // }
    createFiveList();
    map.addLayer(layerGroupFive);
    map.setZoom(10);
    renderSearchCircle(16100);

    document.querySelector("#fiveMileList").style.display = "block";
  } else if (radiusCheck.value === "10 miles") {
    // if (circle !== undefined) {
    //   map.removeLayer(circle);
    // }

    createTenList();
    map.setZoom(9);
    renderSearchCircle(24150);
  } else {
    // if (circle !== undefined) {
    //   map.removeLayer(circle);
    // }
    createFifteenList();
    map.setZoom(9);
    renderSearchCircle(24150);

    document.querySelector("#fifteenMileList").style.display = "block";
  }
}
