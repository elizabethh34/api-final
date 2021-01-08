const originFormElem = document.querySelector('.origin-form');
const originInputElem = document.querySelector('.origin-form input');
const destinationFormElem = document.querySelector('.destination-form');
const destinationInputElem = document.querySelector('.destination-form input');
const originsListElem = document.querySelector('.origins');
const destinationsListElem = document.querySelector('.destinations');
const planTripButton = document.querySelector('.plan-trip');
const tripListElem = document.querySelector('.my-trip');
const mapboxBaseUrl = 'https://api.mapbox.com/geocoding/v5/';
const mapboxEndpoint = 'mapbox.places/';
const mapboxLimitParam = 'limit=10';
const mapboxBboxParam = 'bbox=-97.325875, 49.766204, -96.953987, 49.99275';
const mapboxAccessToken = 'access_token=pk.eyJ1IjoiZWxpemFiZXRoaDM0IiwiYSI6ImNramxpcnlpZjhnaTAyd3J4NWQ1aXBqZWUifQ.PfmZO1A6KHl_x89CFCUjjg';
const transitBaseUrl = 'https://api.winnipegtransit.com/v3/';
const transitEndpoint = 'trip-planner';
const transitAPIKey = 'api-key=Ift6y-RGolzmG6rkd1op';
const transitOriginParam = 'origin=geo/';
const transitDestinationParam = 'destination=geo/';

function getPossibleLocationsData(userSearch) {
  return fetch(`${mapboxBaseUrl}${mapboxEndpoint}${userSearch}.json?${mapboxBboxParam}&${mapboxLimitParam}&${mapboxAccessToken}`)
  .then(response => response.json())
  .then(data => data.features)
}

function getTripData(originLat, originLon, DestLat, DestLon) {
  return fetch(`${transitBaseUrl}${transitEndpoint}.json?${transitAPIKey}&${transitOriginParam}${originLat},${originLon}&${transitDestinationParam}${DestLat},${DestLon}`)
  .then(response => response.json())
}

function renderLocationsHTML(locationsObjArr, elemToAttachTo) {
  locationsObjArr.forEach(locationObj => {
    elemToAttachTo.insertAdjacentHTML('beforeend',
    `<li class="location" data-long="${locationObj.center[0]}" data-lat="${locationObj.center[1]}">
      <div class="name">${locationObj.text}</div>
      <div>${checkIfLocationHasAddress(locationObj)}</div>
    </li>`);
  });
}

function checkIfLocationHasAddress(locationObj) {
  if (locationObj.properties.address === undefined) {
    return 'Winnipeg';
  } else {
    return locationObj.properties.address;
  }
}

function clearLists(element) {
  element.innerHTML = '';
}

function displayLocationInfo(inputElem, elemToAttachTo) {
  getPossibleLocationsData(inputElem.value)
  .then(locationData => {
    clearLists(elemToAttachTo);
    renderLocationsHTML(locationData, elemToAttachTo);
  })
}

function changeSelectedClass(element, listType) {
  element.classList.add('selected');
  const allSelected = document.querySelectorAll(`.${listType} .selected`);
  allSelected.forEach(item => {
    item.classList.remove('selected');
  });
  element.classList.add('selected');
}

function checkForUserSelection() {
  const selectedOrigins = document.querySelectorAll('.origins .selected');
  const selectedDestinations = document.querySelectorAll('.destinations .selected');
  tripListElem.innerHTML = '';
  
  if (selectedOrigins.length === 0) {
    tripListElem.insertAdjacentHTML('afterbegin', '<li>Please select a starting location.</li>');
    return false;
  } else if (selectedDestinations.length === 0) {
    tripListElem.insertAdjacentHTML('afterbegin', '<li>Please select a destination.</li>');
    return false;
  } else {
    return true;
  }
}

function getUserOrigin() {
  const possibleOrigins = document.querySelectorAll('.origins li');
  let selectedOrigin;

  for (const locationItem of possibleOrigins) {
    if (locationItem.classList.contains('selected')) {
      selectedOrigin = locationItem;
    }
  }
  return selectedOrigin;
}

function getUserDestination() {
  const possibleDestinations = document.querySelectorAll('.destinations li');
  let selectedDestination;

  for (const locationItem of possibleDestinations) {
    if (locationItem.classList.contains('selected')) {
      selectedDestination = locationItem;
    }
  }
  return selectedDestination;
}

function callTripData() {
  const selectedOrigin = getUserOrigin();
  const selectedDestination = getUserDestination();
  let originLatitude;
  let originLongitude;
  let destinationLatitude;
  let destinationLongitude;

  originLatitude = selectedOrigin.getAttribute('data-lat');
  originLongitude = selectedOrigin.getAttribute('data-long');
  destinationLatitude = selectedDestination.getAttribute('data-lat');
  destinationLongitude = selectedDestination.getAttribute('data-long');
  return getTripData(originLatitude, originLongitude, destinationLatitude,destinationLongitude);
}

function parseTripData(tripData) {
  let parsedTripData;

  parsedTripData = tripData.plans.map(plan => {
    return {
      number: plan.number,
      segments: parseSegmentsData(plan.segments),
    }
  });
  return parsedTripData;
}

function parseSegmentsData(segmentPlan) {
  let parsedSegments;

  parsedSegments = segmentPlan.map(segment => {
    if (segment.type === 'walk') {
      return {
        type: segment.type,
        time: segment.times.durations.walking,
        stopNumber: checkProperty(segment.to.stop, 'key', ''),
        stopName: checkProperty(segment.to.stop, 'name', 'your destination'),
      }
    } else if (segment.type === 'ride') {
      return {
        type: segment.type,
        time: segment.times.durations.riding,
        route: `Route ${segment.route.number}`,
        routeName: segment.route.name,
      }
    } else if (segment.type === 'transfer') {
      return {
        type: segment.type,
        fromStopNum: segment.from.stop.key,
        fromStopName: segment.from.stop.name,
        toStopNum: segment.to.stop.key,
        toStopName: segment.to.stop.name,
      }
    }
  })
  return parsedSegments;
}

function checkProperty(property, propKey, message) {
  if (property === undefined) {
    return message;
  } else {
    return property[`${propKey}`];
  }
}

function displayTripDetails(tripData) {
  tripData[0].segments.forEach(tripSegment => {
    if (tripSegment.type === 'walk') {
      if (tripData[0].segments.indexOf(tripSegment) === tripData[0].segments.length - 1) {
        tripListElem.insertAdjacentHTML('beforeend',
      `<li>
        <i class="fas fa-walking" aria-hidden="true"></i>Walk for ${tripSegment.time} minutes to ${tripSegment.stopName}.
      </li>`);
      } else {
        tripListElem.insertAdjacentHTML('beforeend',
        `<li>
          <i class="fas fa-walking" aria-hidden="true"></i>Walk for ${tripSegment.time} minutes to stop #${tripSegment.stopNumber} - ${tripSegment.stopName}.
        </li>`);
      }  
    } else if (tripSegment.type === 'ride') {
      tripListElem.insertAdjacentHTML('beforeend',
      `<li>
        <i class="fas fa-bus" aria-hidden="true"></i>Ride the ${tripSegment.route} ${tripSegment.routeName} for ${tripSegment.time} minutes.
      </li>`);
    } else if (tripSegment.type === 'transfer') {
      tripListElem.insertAdjacentHTML('beforeend',
      `<li>
        <i class="fas fa-ticket-alt" aria-hidden="true"></i>Transfer from stop #${tripSegment.fromStopNum} - ${tripSegment.fromStopName} to stop #${tripSegment.toStopNum} - ${tripSegment.toStopName}.
      </li>`);
    }
  });  
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
  const clickedLocation = event.target.closest('.location');
  changeSelectedClass(clickedLocation, 'origins');  
});

destinationsListElem.addEventListener('click', event => {
  const clickedLocation = event.target.closest('.location');
  changeSelectedClass(clickedLocation, 'destinations');
});

planTripButton.addEventListener('click', () => {
  if (checkForUserSelection()) {
    callTripData()
    .then(tripData => parseTripData(tripData))
    .then(parsedData => displayTripDetails(parsedData))
  } 
});

