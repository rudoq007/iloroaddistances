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
const aitape = L.marker([-3.1394, 142.3536]).addTo(map).bindPopup("<b>Aitape Town</b><br>West Sepik Province");

// Load the KML for roads
const roadsLayer = omnivore.kml('./ILO_ROAD_INTERVENTIONS.kml')
  .on('ready', function () {
    console.log("KML file loaded successfully.");
    map.fitBounds(roadsLayer.getBounds()); // Fit map to roads' bounds
  })
  .on('error', function (error) {
    console.error("Error loading KML file:", error);
  })
  .addTo(map);

// Alternative KML loading with leaflet-kml if omnivore fails
roadsLayer.on('error', function () {
  console.log("Trying alternative KML loading method.");
  fetch('./ILO_ROAD_INTERVENTIONS.kml')
    .then(response => response.text())
    .then(kmlText => {
      const parser = new DOMParser();
      const kmlDoc = parser.parseFromString(kmlText, 'text/xml');
      const kmlLayer = new L.KML(kmlDoc); // Requires leaflet-kml.js
      map.addLayer(kmlLayer);
      map.fitBounds(kmlLayer.getBounds());
      console.log("Alternative KML loading successful.");
    })
    .catch(error => console.error("Alternative KML loading failed:", error));
});

// Function to calculate distances to town centers (left unchanged from previous code)
function calculateDistances(roadCenter, roadName, layer) {
  // The existing distance calculation function goes here
}

// Hover event for roads
roadsLayer.on('mouseover', function (e) {
  const layer = e.layer;
  const roadName = layer.feature && layer.feature.properties ? layer.feature.properties.name : "Unnamed Road";
  const roadCenter = layer.getBounds().getCenter();

  console.log("Hovering over road:", roadName);
  calculateDistances(roadCenter, roadName, layer);
});
