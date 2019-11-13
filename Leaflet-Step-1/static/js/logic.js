
// geojson url
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"

// Grabbing our GeoJSON data.
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });


function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place,time,alert,magnitude of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>Place of EarthQuake: " + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) +
        "</p><hr><h5>Alert: " + (feature.properties.alert)  + "</h5><h5>Magnitude: " + (feature.properties.mag));
    }

    //Setting marker size using function markerSize
    function markerSize(mag) {
        return mag * 15000;
    };
 
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(earthquakeData, latlng) {
            return L.circle(latlng,{color: chooseColor(earthquakeData.properties.mag),radius: markerSize(earthquakeData.properties.mag),
            fillOpacity: 2});
        },
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
    
}

function createMap(earthquakes) {

    // Define lightmap layer
    var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });

    // Create our map, giving it the lightmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 4.3,
        layers: [lightmap, earthquakes]
        
    });

    
    //setting legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function(myMap){

    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0,1,2,3,4,5];
    labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        //console.log("inside lengend var loop" + i);
        div.innerHTML +='<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +  grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        //console.log("after lengend var loop" + i);
    }

    return div;
    };


    legend.addTo(myMap);

}

    //Setting color scale using function chooseColor
    //green to red -> shows low magnitude to high magnitude earthquakes in legend.
    //Calling function chooseColor in functions createMap & createFeatures
    function chooseColor(mag) {
        if (mag > 5) {
            return "darkred"
        }
        else if (mag > 4) {
            return "red"
        }
        else if (mag > 3) {
            return "orange"
        }
        else if (mag > 2) {
            return "yellow"
        }
        else if (mag > 1) {
            return "lightgreen"
        }
        else if (mag <= 1) {
            return "darkgreen"
        }
    }



    