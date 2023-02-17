// Create the map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4
  });
  
  // Add the tile layer to the map
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
  }).addTo(myMap);
  
  // URL for the earthquake data
  var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";
  
  // Function to set the marker properties based on the earthquake data
  function style(feature) {
    return {
      radius: feature.properties.mag * 5, // Scale the size based on the magnitude
      fillColor: depthColor(feature.geometry.coordinates[2]), // Set the color based on the depth
      color: "white",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
  }
  
  // Function to set the color based on the depth of the earthquake
  function depthColor(depth) {
    switch (true) {
      case depth > 90:
        return "#FF2D00";
      case depth > 70:
        return "#FF7300";
      case depth > 50:
        return "#FFAE00";
      case depth > 30:
        return "#FFE300";
      case depth > 10:
        return "#FCFF00";
      default:
        return "#8CFF00";
    }
  }
  
  // Function to create the popups for each earthquake marker
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "<p>Magnitude: " + feature.properties.mag + "</p>");
  }
  
  // Use D3 to get the earthquake data from the URL and add it to the map
  d3.json(url, function(data) {
    L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      style: style,
      onEachFeature: onEachFeature
    }).addTo(myMap);
  });
  
  // Create the legend for the depth colors
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "info legend");
    var depths = [-10, 10, 30, 50, 70, 90];
    var labels = [];
  
    div.innerHTML += "<h4>Depth (km)</h4>"
    
    // Add the colors and depth ranges to the legend
    for (var i = 0; i < depths.length; i++) {
      div.innerHTML += "<i style='background: " + depthColor(depths[i] + 1) + "'></i> " +
        depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
    }
    return div;
  };
  legend.addTo(myMap);
  
  
