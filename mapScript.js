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
const aitape = L.marker([-3.1394, 142.3536]).addTo(map).bindPopup("<b>Aitape Town</b><br>West Sepik Province"); // Aitape coordinates

// Load the KML for roads
const roadsLayer = omnivore.kml('./ILO_ROAD_INTERVENTIONS.kml') 
  .on('ready', function () {
    console.log("KML file loaded successfully.");
    map.fitBounds(roadsLayer.getBounds());
  })
  .on('error', function (error) {
    console.error("Error loading KML file:", error);
  })
  .addTo(map);

// Function to calculate distances to town centers using OpenRouteService
function calculateDistances(roadCenter, roadName, layer) {
  const osrmUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=YOUR_API_KEY`; // Replace with your actual API key

  // Calculate distance to a single town
  function getDistanceToTown(townMarker, townName) {
    const townCenter = [townMarker.getLatLng().lng, townMarker.getLatLng().lat];
    const roadCoord = [roadCenter.lng, roadCenter.lat];
    const body = JSON.stringify({ coordinates: [roadCoord, townCenter] });

    return fetch(osrmUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body
    })
    .then(response => response.json())
    .then(data => {
      if (data.routes && data.routes[0]) {
        const routeDistance = data.routes[0].summary.distance;
        const distanceInKm = (routeDistance / 1000).toFixed(2);
        console.log(`Distance to ${townName} for ${roadName}: ${distanceInKm} km`);
        return `${distanceInKm} km`;
      } else {
        console.error(`No route found for road: ${roadName} to ${townName}`);
        return "N/A";
      }
    })
    .catch(error => {
      console.error(`Error fetching route to ${townName}:`, error);
      return "N/A";
    });
  }

  // Fetch distances for each town and display them in popup
  Promise.all([
    getDistanceToTown(wewak, "Wewak"),
    getDistanceToTown(maprik, "Maprik"),
    getDistanceToTown(vanimo, "Vanimo"),
    getDistanceToTown(aitape, "Aitape") // Added Aitape to the calculations
  ]).then(distances => {
    const [wewakDistance, maprikDistance, vanimoDistance, aitapeDistance] = distances;

    // Construct the popup content
    let popupContent = `<b>${roadName}</b><br>`;
    popupContent += `Distance to Wewak: ${wewakDistance}<br>`;
    popupContent += `Distance to Maprik: ${maprikDistance}<br>`;
    popupContent += `Distance to Vanimo: ${vanimoDistance}<br>`;
    popupContent += `Distance to Aitape: ${aitapeDistance}`; // Display Aitape distance

    // Bind the popup with the calculated distances
    layer.bindPopup(popupContent);
    layer.openPopup();
  });
}

// Loop through each road and add hover event listener
roadsLayer.on('mouseover', function (e) {
  const layer = e.layer;
  const roadName = layer.feature && layer.feature.properties ? layer.feature.properties.name : "Unnamed Road";
  const roadCenter = layer.getBounds().getCenter();

  console.log("Hovering over road:", roadName);
  calculateDistances(roadCenter, roadName, layer);
});
