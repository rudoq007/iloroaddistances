// Load the API key from the config file and initialize the map
let API_KEY;

fetch('./config.js')
  .then(response => {
    if (!response.ok) throw new Error("Network response was not ok");
    return response.text();
  })
  .then(text => {
    eval(text); // This should define the API_KEY variable from config.js
    console.log("API Key Loaded:", API_KEY); // Debug log
    initializeMap(); // Call map initialization after loading API key
  })
  .catch(error => console.error('Error loading API key:', error));

// Initialize the map with Google Maps tile layer
function initializeMap() {
  const googleLayer = L.tileLayer(`https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=${API_KEY}`, {
    attribution: '© Google',
    maxZoom: 18
  });

  const map = L.map('map', {
    center: [-3.7, 143.5],
    zoom: 8,
    layers: [googleLayer]
  });

  // Load KML files
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
  L.marker([-2.6831956, 141.3029833]).addTo(map).bindPopup("Vanimo");
  L.marker([-3.1378478, 142.3499287]).addTo(map).bindPopup("Wewak");
  L.marker([-3.5800228, 143.6583166]).addTo(map).bindPopup("Maprik");
  L.marker([-3.6274748, 143.0552973]).addTo(map).bindPopup("Aitape");
}
