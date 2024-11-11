// Load the API key from the config file
let API_KEY;
fetch('./config.js')
  .then(response => response.text())
  .then(text => {
    eval(text); // Loads API_KEY from config.js
    initializeMap(); // Call the function after loading the key
  })
  .catch(error => console.error('Error loading API key:', error));

// Initialize map with Google Maps tile layer
function initializeMap() {
  const googleLayer = L.tileLayer(`https://maps.googleapis.com/maps/v3/{z}/{x}/{y}?key=${API_KEY}`, {
    attribution: '© Google',
    maxZoom: 18
  });

  const map = L.map('map', {
    center: [-3.7, 143.5],
    zoom: 8,
    layers: [googleLayer]  // Initialize with Google Maps Layer
  });

  // Load KML files and add them to the map
  const roadsKML = 'https://raw.githubusercontent.com/rudoq007/iloroaddistances/main/ILO%20ROAD%20INTERVENTIONS.kml';
  const townCentreKML = 'https://raw.githubusercontent.com/rudoq007/iloroaddistances/main/Town%20Centres.kml';

  loadKML(map, roadsKML, 'Roads');
  loadKML(map, townCentreKML, 'Town Centres');

  // Optional: Add manual markers for debugging
  addDebugMarkers(map);
}

// Function to load KML files and add them to the map
function loadKML(map, url, layerName) {
  console.log(`Attempting to load ${layerName} KML from: ${url}`);
  omnivore.kml(url)
    .on('ready', function () {
      console.log(`${layerName} KML loaded successfully`);
      map.fitBounds(this.getBounds());  // Fit map to KML bounds
    })
    .on('error', function (error) {
      console.error(`Error loading ${layerName} KML:`, error);
    })
    .addTo(map);
}

// Add debug markers for town centers
function addDebugMarkers(map) {
  L.marker([-2.6831956, 
