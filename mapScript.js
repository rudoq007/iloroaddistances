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

// Load the KML for roads
const roadsLayer = omnivore.kml('ILO ROAD INTERVENTIONS.kml') // Relative path to the KML file
  .on('ready', function () {
    map.fitBounds(roadsLayer.getBounds()); // Fit map bounds to show all roads
  })
  .on('error', function (error) {
    console.error("Error loading KML file:", error);
  })
  .addTo(map);

// Function to calculate distances to town centers
function calculateDistances(roadCenter, roadName, layer) {
  // OpenRouteService URL and API key for routing
  const osrmUrl = "https://api.openrouteservice.org/v2/directions/driving-car";
  const apiKey = "5b3ce3597851110001cf6248d107ce79579a4f47a889399db06e998b"; // Your API Key

  // Function to calculate distance to a town
  function getDistanceToTown(townMarker, townName) {
    const townCenter = { lat: townMarker.getLatLng().lat, lng: townMarker.getLatLng().lng };
    const url = `${osrmUrl}?api_key=${apiKey}&start=${roadCenter.lng},${roadCenter.lat}&end=${townCenter.lng},${townCenter.lat}&instructions=false`;

    // Make an HTTP request to the OpenRouteService API for the route distance
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.features && data.features[0] && data.features[0].properties.segments) {
          const routeDistance = data.features[0].properties.segments[0].distance; // Distance in meters
          const distanceInKm = (routeDistance / 1000).toFixed(2); // Convert to kilometers
          return distanceInKm;
        } else {
          console.error(`No route found for road: ${roadName}`);
          return null;
        }
      })
      .catch(error => {
        console.error("Error fetching route:", error);
        return null;
      });
  }

  // Calculate distances to each town (Wewak, Maprik, Vanimo)
  const distances = {};
  getDistanceToTown(wewak, "Wewak").then(wewakDistance => {
    distances.wewak = wewakDistance;
    return getDistanceToTown(maprik, "Maprik");
  }).then(maprikDistance => {
    distances.maprik = maprikDistance;
    return getDistanceToTown(vanimo, "Vanimo");
  }).then(vanimoDistance => {
    distances.vanimo = vanimoDistance;
    
    // Add popup with distance information once all distances are calculated
    let popupContent = `<b>${roadName}</b><br>`;
    popupContent += `Distance to Wewak: ${distances.wewak || "N/A"} km<br>`;
    popupContent += `Distance to Maprik: ${distances.maprik || "N/A"} km<br>`;
    popupContent += `Distance to Vanimo: ${distances.vanimo || "N/A"} km`;

    // Bind the popup with the distances
    layer.bindPopup(popupContent);
    layer.openPopup(); // Automatically open the popup after calculating distances
  });
}

// Loop through each road and add hover event listener
roadsLayer.eachLayer(function (layer) {
  const roadName = layer.feature.properties.name || "Unnamed Road";
  const roadCenter = layer.getBounds().getCenter();

  // Add a 'mouseover' event to each road
  layer.on('mouseover', function () {
    console.log("Mouseover triggered on road:", roadName); // Debugging log
    calculateDistances(roadCenter, roadName, layer);
  });
});
