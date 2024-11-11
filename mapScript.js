<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Map with Distance Calculation</title>
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

    // Define the locations of the town centers (Aitape and others)
    const townCenters = {
      "Aitape": { lat: -3.083, lon: 142.598 }, // Aitape example coordinates
      "TownCenter1": { lat: -3.5, lon: 143.2 }, // Example town center
      "TownCenter2": { lat: -3.6, lon: 143.3 }, // Another example
      // Add other town centers here...
    };

    let selectedTown = null;

    // Function to calculate distances using the Google Distance Matrix API
    function calculateDistance(fromLat, fromLon, toLat, toLon, townName) {
      const origin = new google.maps.LatLng(fromLat, fromLon);
      const destination = new google.maps.LatLng(toLat, toLon);

      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: 'DRIVING',
        },
        (response, status) => {
          if (status === 'OK') {
            const distance = response.rows[0].elements[0].distance.text;
            alert(`Distance from road to ${townName}: ${distance}`);
          } else {
            alert('Distance calculation failed');
          }
        }
      );
    }

    // Add markers for the town centers and allow selection
    for (const town in townCenters) {
      const { lat, lon } = townCenters[town];
      const marker = L.marker([lat, lon]).addTo(map);
      marker.bindPopup(town);

      // Set the selected town when clicked
      marker.on('click', function() {
        selectedTown = { name: town, lat: lat, lon: lon };
        alert(`${town} selected. Now hover over a road to see the distance.`);
      });
    }

    // Add mouseover event to calculate distance when hovering over roads
    roadsLayer.eachLayer(function(layer) {
      if (layer.getLatLng) {
        layer.on('mouseover', function(event) {
          if (selectedTown) {
            const latLng = event.latlng; // Use latLng from the event
            calculateDistance(latLng.lat, latLng.lng, selectedTown.lat, selectedTown.lon, selectedTown.name);
          } else {
            alert("Please select a town center first.");
          }
        });
      }
    });

    // Load Google Maps API dynamically
    function loadGoogleMapsAPI() {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBtGa1iR1TXerNJwfQjYy1u4pv26Q9Nr94&callback=initializeGoogleMapsAPI`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    // Callback when Google Maps API is ready
    function initializeGoogleMapsAPI() {
      console.log("Google Maps API loaded successfully!");
    }

    // Load Google Maps API
    loadGoogleMapsAPI();

  </script>
</body>
</html>
