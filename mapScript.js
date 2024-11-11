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
    // Initialize map with a center point and zoom level
    const map = L.map('map').setView([-3.7, 143.5], 8);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map);

    // Check if KML URLs are correct (logs to console)
    const roadsKML = 'https://raw.githubusercontent.com/rudoq007/iloroaddistances/main/ILO%20ROAD%20INTERVENTIONS.kml';
    const townCentreKML = 'https://raw.githubusercontent.com/rudoq007/iloroaddistances/main/Town%20Centres.kml';

    console.log('Roads KML:', roadsKML);
    console.log('Town Centres KML:', townCentreKML);

    // Function to load KML files and add them to the map
    function loadKML(url, layerName) {
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

  </script>
</body>
</html>
