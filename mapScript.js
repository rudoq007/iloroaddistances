<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Improved Map with Pre-Calculated Distances</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js"></script>
  <script src="https://unpkg.com/leaflet-omnivore/leaflet-omnivore.min.js"></script>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    #map {
      height: 80vh;
    }
    #controls {
      position: absolute;
      top: 10px;
      left: 10px;
      background-color: white;
      padding: 10px;
      z-index: 999;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
    button {
      margin-bottom: 5px;
      padding: 8px;
      background-color: #4CAF50;
      color: white;
      border: none;
      cursor: pointer;
      width: 100%;
    }
    button:hover {
      background-color: #45a049;
    }
    .legend {
      font-size: 14px;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div id="controls">
    <button id="showAllDistances">Show All Distances</button>
    <button id="showWewak">Show Distance to Wewak</button>
    <button id="showMaprik">Show Distance to Maprik</button>
    <button id="showVanimo">Show Distance to Vanimo</button>
    <button id="showAitape">Show Distance to Aitape</button>
    <button id="clearDistances">Clear Distances</button>
    <div class="legend">
      <p><strong>Legend:</strong><br>
         Hover over the roads to see the distances to town centers.</p>
    </div>
  </div>

  <div id="map"></div>

  <script>
    // Initialize map
    const map = L.map('map').setView([-3.7, 143.5], 8);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map);

    // Towns and pre-calculated distances (simplified example, in reality, you would pull this data from an API or file)
    const townCenters = {
      wewak: { lat: -3.5800229, lng: 143.6583166, name: "Wewak" },
      maprik: { lat: -3.6274748, lng: 143.0552973, name: "Maprik" },
      vanimo: { lat: -2.693611, lng: 141.302222, name: "Vanimo" },
      aitape: { lat: -3.030205, lng: 142.543429, name: "Aitape" }
    };

    const preCalculatedDistances = {
      "road1": {
        wewak: "120 km",
        maprik: "80 km",
        vanimo: "160 km",
        aitape: "50 km"
      },
      "road2": {
        wewak: "200 km",
        maprik: "150 km",
        vanimo: "80 km",
        aitape: "120 km"
      },
      // Add more roads with pre-calculated distances
    };

    // Function to add a road with its distance info
    function addRoad(roadName, lat, lng) {
      const roadMarker = L.marker([lat, lng]).addTo(map).bindPopup(`<b>${roadName}</b>`);
      
      // Store the distances in the popup for easier access
      roadMarker.on('mouseover', function () {
        const distances = preCalculatedDistances[roadName] || {};
        let popupContent = `<b>${roadName}</b><br>`;
        for (const town in distances) {
          popupContent += `Distance to ${town}: ${distances[town]}<br>`;
        }
        roadMarker.setPopupContent(popupContent);
        roadMarker.openPopup();
      });

      return roadMarker;
    }

    // Add roads manually (for demo, you would typically load this from a KML file or another source)
    const roads = [
      addRoad("road1", -3.6, 143.7),
      addRoad("road2", -3.5, 143.4)
    ];

    // Show all distances
    document.getElementById('showAllDistances').addEventListener('click', function () {
      roads.forEach(function (road) {
        road.openPopup();
      });
    });

    // Show distance to a specific town
    function showDistancesToTown(town) {
      roads.forEach(function (road) {
        const distances = preCalculatedDistances[road.options.title] || {};
        const distance = distances[town] || 'No data';
        road.setPopupContent(`<b>${road.options.title}</b><br>Distance to ${town}: ${distance}`);
        road.openPopup();
      });
    }

    document.getElementById('showWewak').addEventListener('click', function () {
      showDistancesToTown("wewak");
    });
    document.getElementById('showMaprik').addEventListener('click', function () {
      showDistancesToTown("maprik");
    });
    document.getElementById('showVanimo').addEventListener('click', function () {
      showDistancesToTown("vanimo");
    });
    document.getElementById('showAitape').addEventListener('click', function () {
      showDistancesToTown("aitape");
    });

    // Clear distances
    document.getElementById('clearDistances').addEventListener('click', function () {
      roads.forEach(function (road) {
        road.closePopup();
      });
    });
  </script>
</body>
</html>
