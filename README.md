# Bus Route Finder

Users can enter an origin and a destination and see a list of possible bus routes.

#### Hosted site: [https://mitt-route-finder.netlify.app/](https://mitt-route-finder.netlify.app/)

## Features:

- Users enter a search term in a text input for an origin and a destination
- Upon hitting the enter key, a list of possible matches is displayed under each text input
- The user selects an origin and destination from these lists and clicks the `Plan My Trip` button
- A list of possible bus route is displayed

## Implementation

- Provide the user with 2 input boxes, each belonging to it's own form
- Upon submission of one of the submit boxes, execute an API call to the MapBox API to get a forward geocode on the search value using the endpoint `mapbox.places`
- Use the `bbox` option which will limit geocoding to a border box
- Users should be able to click on a result to mark it `selected`
- Once a user has selected a starting point and a destination, they can click the `Plan My Trip` button. If there isn't at least 1 starting location and 1 destination selected, clicking the `Plan My Trip` button should display an appropriate message to the user
- Make call to the Winnipeg Transit Trip Planning API