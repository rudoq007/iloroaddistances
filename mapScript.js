// Load the API key from config.js and initialize the map
fetch('./config.js')
  .then(response => response.text())
  .then(text => {
    eval(text);  // Loads API_KEY from config.js
    initializeMap();  // Initialize map after loading the API key
  })
  .catch(error => console.error('Error loading API key:', error));

// Initialize map with Google Maps tile layer
function initializeMap() {
  if (typeof API_KEY === 'undefined') {
    console.error('API_KEY is not defined');
    return;
  }

  const googleLayer = L.tileLayer(`https://maps.googleapis.com/maps/api/tile/{z}/{x}/{y}?key=${API_KEY}`, {
    attribution: '© Google',
    maxZoom: 18
  });

  const map = L.map('map', {
    center: [-3.7, 143.5],
    zoom: 8,
    layers: [googleLayer]  // Initialize with Google Maps Layer
  });

  // Load KML files
  const roadsKML = 'https://raw.githubusercontent.com/rudoq007/iloroaddistances/main/ILO%20ROAD%20INTERVENTIONS.kml';
  const townCentreKML = 'https://raw.githubusercontent.com/rudoq007/iloroaddistances/main/Town%20Centres.kml';
  
  loadKML(map, roadsKML, 'Roads');
  loadKML(map, townCentreKML, 'Town Centres');

  // Optional: Add debug markers
  addDebugMarkers(map);
}

// Function to load KML files and add them to the map
function loadKML(map, url, layerName) {
  console.log(`Attempting to load ${layerName} KML from: ${url}`);
  omnivore.kml(url)
    .on('ready', function () {
      console.log(`${layerName} KML loaded successfully`);
      map.fitBounds(this.getBounds());
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
