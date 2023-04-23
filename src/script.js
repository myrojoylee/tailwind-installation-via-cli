let allData, zipCode, map, nameOfBrewery, address, phone, website, marker;
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

function getCoordinates(allData) {
  console.log(allData);
  lat = Number(allData[0].latitude);
  lon = Number(allData[0].longitude);
  nameOfBrewery = allData[0].name;
  address = allData[0].address_1;
  phone = allData[0].phone;
  website = allData[0].website_url;

  renderDetails();
}

function renderDetails() {
  map = L.map("map").setView([lat, lon], 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  marker = L.marker([lat, lon]).addTo(map);

  placeName.innerHTML = `<i class="fa-regular fa-heart"></i> ${nameOfBrewery}`;
  streetAddress.textContent = address;
  placePhone.textContent = phone;
  websiteURL.textContent = website;
}

$(function () {
  $("#size").selectmenu();
  $("#salutation").selectmenu();
});

/**
 * datepicker function
 */
$(function () {
  $("#datepicker").datepicker();
  const value = $("#datepicker").val();
  console.log(value);
});
