function send_profiler_stats() {
  for(var i in Profiler.metrics) {
    var img = new Image();
    var m = Profiler.metrics[i];
    var q = "select profiler_data('" + i + "'," + m.max + "," + m.min + "," + m.avg + "," + m.count + ","+ m.total + ", '"+ navigator.userAgent + "','json')";
    img.src = 'http://javi.cartodb.com/api/v1/sql?q=' + encodeURIComponent(q) + '&c=' + Date.now();
  }
}

function create_polygons(url, ready) {
  var polygons =  {};

  $.getJSON(url, function(data) {
    var geojson = new L.GeoJSON();
    var features = data.features;
    for (var i = 0, len = features.length; i < len; ++i) {
      var pol = new Object();

      if (features[i].geometry !== null) {
        var geo = L.GeoJSON.geometryToLayer(features[i].geometry);

        geo.setStyle({
          weight: 3,
          color: '#FFFFFF',
          opacity: 1,
          fillColor: '#FFFFFF',
          fillOpacity: 0.3,
          clickable: false
        });
        pol.geo = geo;
        pol.prop = features[i].properties;
        var key = features[i].properties.cartodb_id;

        if(polygons[key]) {
          polygons[key].push(pol);
        } else {
          polygons[key] = [pol];
        }
      }
    }

    ready(polygons);
  });
    
}
