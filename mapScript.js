// Initialize the map
const map = L.map('map').setView([-3.7, 143.5], 8);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Add town centers with markers
const wewak = L.marker([-3.5800229, 143.6583166]).addTo(map).bindPopup("<b>Wewak Town</b><br>East Sepik Province");
const maprik = L.marker([-3.6274748, 143.0552973]).addTo(map).bindPopup("<b>Maprik Town</b><br>East Sepik Province");
const vanimo = L.marker([-2.693611, 141.302222]).addTo(map).bindPopup("<b>Vanimo Town</b><br>West Sepik Province");
const aitape = L.marker([-3.137, 142.354]).addTo(map).bindPopup("<b>Aitape Town</b><br>West Sepik Province");

// Load the KML for roads
const roadsLayer = omnivore.kml('https://raw.githubusercontent.com/rudoq007/iloroaddistances/main/ILO%20ROAD%20INTERVENTIONS.kml')
  .on('ready', function () {
    map.fitBounds(roadsLayer.getBounds()); // Fit map bounds to show all roads
  })
  .on('error', function (error) {
    console.error("Error loading KML file:", error);
  })
  .addTo(map);
