<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Map Test</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js"></script>
  <script src="https://unpkg.com/leaflet-omnivore/leaflet-omnivore.min.js"></script>
</head>
<body>
  <div id="map" style="height: 600px;"></div>
  <script>
    // Initialize map
    const map = L.map('map').setView([-3.7, 143.5], 8);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map);

    // Load KML file for roads (use your own local KML or public URL)
    const roadsLayer = omnivore.kml('https://raw.githubusercontent.com/rudoq007/iloroaddistances/main/ILO%20ROAD%20INTERVENTIONS.kml')
      .on('ready', function() {
        map.fitBounds(roadsLayer.getBounds());  // Zoom the map to fit the KML content
      })
      .on('error', function(error) {
        console.error("Error loading KML:", error);
      })
      .addTo(map);
  </script>
</body>
</html>
