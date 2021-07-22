//Storing API 
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson"

//
d3.json(earthquakeURL, function(data){
    createFeatures(data.features);
});

//
function createFeatures(earthquakeData){
    var earthquakes =L.geoJSON(earthquakeData, {
        onEachFeature: function(feature, layer){
            layer.bindPopup("<h3>Magnitude: " + feature.properties.mag + "</h3><h3>Location: "+ feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        },

        PointToLayer: function (feature, latlng) {
            return new L.circle(latlng,
                {radius: getRadius(feature.properties.mag),
                fillColor: getColor(feature.properties.mag),
                fillOpacity:.5,
                color: "black"
                stroke: true,
                weight: .8
        })
        }
    });

    createMap(earthquakes);
}

function createMap(earthquakes) {

    //Defining map layers 
    var airmap = L.tileLayer("https://api.mapbox.com/styles/v1/mfatih72/ck30s2f5b19ws1cpmmw6zfumm/tiles/256/{z}/{x}/{y}?" + "pk.eyJ1IjoiamVzc3BoZW5vbWVuYWwxIiwiYSI6ImNrcWxndWYzYTBzeDMycG8xaGFjamE0MWMifQ.LJGcnfZt8G3Yc2lWcWZ_bw")
    
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mfatih72/ck30r72r818te1cruud5wk075/tiles/256/{z}/{x}/{y}?" + "pk.eyJ1IjoiamVzc3BoZW5vbWVuYWwxIiwiYSI6ImNrcWxndWYzYTBzeDMycG8xaGFjamE0MWMifQ.LJGcnfZt8G3Yc2lWcWZ_bw") 

    var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mfatih72/ck30rkku519fu1drmiimycohl/tiles/256/{z}/{x}/{y}?" + "pk.eyJ1IjoiamVzc3BoZW5vbWVuYWwxIiwiYSI6ImNrcWxndWYzYTBzeDMycG8xaGFjamE0MWMifQ.LJGcnfZt8G3Yc2lWcWZ_bw")


    //

    var baseMaps = {
        "LightMap": lightMap,
        "AirMap": airmap,
        "Satellite": satellite
    };

var tectonicPlates = new L.LayerGroup();

var overlayMaps = {
    "Earthquakes": earthquakes,
    "Tectonic Plates": tectonicPlates
};

var myMap = L.map ("map", {
    center: [40.7, -94.5],
    zoom: 5,
    layers: [lightMap, earthquakes, tectonicPlates]
});

L.control.layers(baseMaps, overlayMaps, {
    collapsed: fasle
}).addTo(myMap);

var legend = L.control({
    position: "bottomleft"
});

legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "info legend"),
    grades = [0, 1, 2, 3, 4, 5],
    labels = [];
// Create legend
for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
        '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
}
return div;
};
legend.addTo(myMap);
}

// Create color function
function getColor(magnitude) {
if (magnitude > 5) {
    return 'red'
} else if (magnitude > 4) {
    return 'orange'
} else if (magnitude > 3) {
    return 'yellow'
} else if (magnitude > 2) {
    return 'lightgreen'
} else if (magnitude > 1) {
    return 'green'
} else {
    return 'magenta'
}
};

//Create radius function
function getRadius(magnitude) {
return magnitude * 20000;
};
}

}

//

//

//