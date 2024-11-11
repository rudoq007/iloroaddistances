<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Map Test</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js"></script>
  <script src="https://unpkg.com/leaflet-omnivore/leaflet-omnivore.min.js"></script>
  <script src="https://api.mapbox.com/mapbox-gl-js/v2.7.0/mapbox-gl.js"></script> <!-- For additional map styles -->
</head>
<body>
  <div id="map" style="height: 600px;"></div>

  <script>
    // Initialize the map
    const map = L.map('map').setView([-3.7, 143.5], 8);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map);

    // Define town center markers with pop-ups
    const townCenters = [
      { name: "Wewak", lat: -3.5800229, lng: 143.6583166 },
      { name: "Maprik", lat: -3.6274748, lng: 143.0552973 },
      { name: "Vanimo", lat: -2.693611, lng: 141.302222 },
      { name: "Aitape", lat: -3.132367, lng: 142.506435 }
    ];

    townCenters.forEach(town => {
      L.marker([town.lat, town.lng])
        .addTo(map)
        .bindPopup(`<b>${town.name}</b><br>${town.name} Town Centre`)
        .openPopup();
    });

    // Load KML file for roads (use your own public URL or relative path)
    const roadsLayer = omnivore.kml('https://raw.githubusercontent.com/rudoq007/iloroaddistances/main/ILO%20ROAD%20INTERVENTIONS.kml')
      .on('ready', function() {
        map.fitBounds(roadsLayer.getBounds());  // Zoom the map to fit the KML content
      })
      .on('error', function(error) {
        console.error("Error loading KML:", error);
      })
      .addTo(map);

    // Function to calculate the distance to a town (using OSRM or another API)
    function calculateDistance(roadCenter, townMarker) {
      const townCenter = { lat: townMarker.getLatLng().lat, lng: townMarker.getLatLng().lng };
      const osrmUrl = `https://api.openrouteservice.org/v2/directions/driving-car`;

      const url = `${osrmUrl}?api_key=5b3ce3597851110001cf6248d107ce79579a4f47a889399db06e998b&start=${roadCenter.lng},${roadCenter.lat}&end=${townCenter.lng},${townCenter.lat}`;

      return fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.features && data.features[0].properties.segments[0].distance) {
            const distanceInKm = (data.features[0].properties.segments[0].distance / 1000).toFixed(2); // Convert to kilometers
            return distanceInKm;
          } else {
            console.error("No route found.");
            return "N/A";
          }
        })
        .catch(error => {
          console.error("Error fetching route:", error);
          return "N/A";
        });
    }

    // Loop through each road and calculate distance to each town on mouseover
    roadsLayer.eachLayer(function(layer) {
      const roadCenter = layer.getBounds().getCenter();
      const roadName = layer.feature.properties.name || "Unnamed Road";

      layer.on('mouseover', function() {
        const popupContent = `<b>${roadName}</b><br>Calculating distances...`;

        layer.bindPopup(popupContent).openPopup();

        // Calculate and show distances to towns when hovering over roads
        Promise.all(townCenters.map(town => calculateDistance(roadCenter, L.marker([town.lat, town.lng]))))
          .then(distances => {
            let popupContent = `<b>${roadName}</b><br>`;
            townCenters.forEach((town, index) => {
              popupContent += `Distance to ${town.name}: ${distances[index]} km<br>`;
            });

            layer.bindPopup(popupContent).openPopup();
          });
      });
    });

  </script>
</body>
</html>
