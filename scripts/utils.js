slavery.AppData = {
  REGIONS: {
    'asia': {
      center: {
        lat: -0.5904881759999512,
        lng: 0.4429630865000007
      },
      zoom: 1
    },
    'west_europe': {
      center: {
        lat: 13.153794663500104,
        lng: -6.281442837999851
      },
      zoom: 2
    },
    'east_europe': {
      center: {
        lat: 58.4996784495001,
        lng: 0
      },
      zoom: 1
    },
    'americas': {
      center: {
        lat: 13.599009152500102,
        lng: 0
      },
      zoom: 1
    },
    'africa': {
      center: {
        lat: -9.840168555999899,
        lng: 19.0667423835001
      },
      zoom: 3
    },
    'middle_east': {
      center: {
        lat: 24.226584371000065,
        lng: 23.152942403827552
      },
      zoom: 3
    }
  }
}

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
          fillOpacity: 0,
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

function slaveryToHuman(num) {
  var risk = '';

  if (num <= 100 && num > 75.25) {
    risk = 'Very high'
  } else if (num <= 75.25 && num > 75.25) {
    risk = 'High'
  } else if (num <= 75.25 && num > 64.64) {
    risk = 'Moderate high'
  } else if (num <= 64.64 && num > 46.96) {
    risk = 'Moderate'
  } else if (num <= 46.96 && num > 36.36) {
    risk = 'Moderate low'
  } else if (num <= 36.36 && num > 18.68) {
    risk = 'Low'
  } else {
    risk = 'Very low'
  }

  return risk;
}