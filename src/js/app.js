const originFormElem = document.querySelector('.origin-form');
const originInputElem = document.querySelector('.origin-form input');
const destinationFormElem = document.querySelector('.destination-form');
const destinationInputElem = document.querySelector('.destination-form input');
const originsListElem = document.querySelector('.origins');
const destinationsListElem = document.querySelector('.destinations');
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

function displayLocations(locationsObjArr, elemToAttachTo) {
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

originFormElem.addEventListener('submit', event => {
  event.preventDefault();
  getPossibleLocations(originInputElem.value)
  .then(locationData => {
    clearLists(originsListElem);
    displayLocations(locationData, originsListElem);
  })

});

destinationFormElem.addEventListener('submit', event => {
  event.preventDefault();
  getPossibleLocations(destinationInputElem.value)
  .then(locationData => {
    clearLists(destinationsListElem);
    displayLocations(locationData, destinationsListElem);
  })
});

