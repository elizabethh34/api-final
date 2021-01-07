const originFormElem = document.querySelector('.origin-form');
const originInputElem = document.querySelector('.origin-form input');
const destinationFormElem = document.querySelector('.destination-form');
const destinationInputElem = document.querySelector('.destination-form input');
const originsListElem = document.querySelector('.origins');
const destinationsListElem = document.querySelector('.destinations');
const planTripButton = document.querySelector('.plan-trip'); 
const mapboxBaseUrl = 'https://api.mapbox.com/geocoding/v5/';
const mapboxEndpoint = 'mapbox.places/';
const mapboxLimitParam = 'limit=10';
const mapboxBboxParam = 'bbox=-97.325875, 49.766204, -96.953987, 49.99275';
const mapboxAccessToken = 'access_token=pk.eyJ1IjoiZWxpemFiZXRoaDM0IiwiYSI6ImNramxpcnlpZjhnaTAyd3J4NWQ1aXBqZWUifQ.PfmZO1A6KHl_x89CFCUjjg';

function getPossibleLocations(userSearch) {
  return fetch(`${mapboxBaseUrl}${mapboxEndpoint}${userSearch}.json?${mapboxBboxParam}&${mapboxLimitParam}&${mapboxAccessToken}`)
  .then(response => response.json())
  .then(data => data.features)
}

function renderLocationsHTML(locationsObjArr, elemToAttachTo) {
  locationsObjArr.forEach(locationObj => {
    elemToAttachTo.insertAdjacentHTML('beforeend',
    `<li data-long="${locationObj.center[0]}" data-lat="${locationObj.center[1]}">
      <div class="name">${locationObj.text}</div>
      <div>${locationObj.properties.address}</div>
    </li>`);
  });
}

function clearLists(element) {
  element.innerHTML = '';
}

function displayLocationInfo(inputElem, elemToAttachTo) {
  getPossibleLocations(inputElem.value)
  .then(locationData => {
    clearLists(elemToAttachTo);
    renderLocationsHTML(locationData, elemToAttachTo);
  })
}

originFormElem.addEventListener('submit', event => {
  event.preventDefault();
  displayLocationInfo(originInputElem, originsListElem);
});

destinationFormElem.addEventListener('submit', event => {
  event.preventDefault();
  displayLocationInfo(destinationInputElem, destinationsListElem);
});

originsListElem.addEventListener('click', event => {

});

