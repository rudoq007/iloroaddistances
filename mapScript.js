// Initialize map with a center point and zoom level
const map = L.map('map').setView([-3.7, 143.5], 8);  // Set a reasonable initial view

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 18
}).addTo(map);

// Correct raw URL links to your KML files
const roadsKML = 'https://raw.githubusercontent.com/rudoq007/iloroaddistances/main/ILO%20ROAD%20INTERVENTIONS.kml';
const townCentreKML = 'https://raw.githubusercontent.com/rudoq007/iloroaddistances/main/Town%20Centres.kml';

// Function to load KML files and add them to the map
function loadKML(url, layerName) {
  console.log(`Attempting to load ${layerName} KML from: ${url}`);  // Debug log
  omnivore.kml(url)
    .on('ready', function() {
      console.log(`${layerName} KML loaded successfully`);
      map.fitBounds(this.getBounds());  // Fit the map to the bounds of the KML data
    })
    .on('error', function(error) {
      console.error(`Error loading ${layerName} KML:`, error);
    })
    .addTo(map);
}

// Load Roads KML
loadKML(roadsKML, 'Roads');

// Load Town Centres KML
loadKML(townCentreKML, 'Town Centres');
