slavery.AppData = {
  REGIONS: {
    'asia': {
      center: {
        lat: 3.5134210456400443, 
        lng: 77.958984375
      },
      zoom: 4
    },
    'west_europe': {
      center: {
        lat: 46.9502622421856,
        lng: 0.3515625
      },
      zoom: 5
    },
    'east_europe': {
      center: {
        lat: 51.12106042504407, 
        lng: 40.869140625
      },
      zoom: 4
    },
    'americas': {
      center: {
        lat: 1.2303741774326145,
        lng:  -104.94140625,
      },
      zoom: 3
    },
    'africa': {
      center: {
        lat: -9.840168555999899,
        lng: 19.0667423835001
      },
      zoom: 4
    },
    'middle_east': {
      center: {
        lat: 24.226584371000065,
        lng: 23.152942403827552
      },
      zoom: 4
    }
  },
  GRAPHS: {
    'human_development_index': {
      title: 'Human Development Index',
      column: 'human_development_index'
    },
    'access_to_financial_services': {
      title: 'Access to Financial Services Index',
      column: 'access_to_fin_services_index'
    },
    'corruption': {
      title: 'Corruption Index',
      column: 'corruption_index'
    },
  },
  CONFIG: {
    chart: {
      graph: 'human_development_index'
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
        var key = features[i].properties.iso3;

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

//TODO: REMEMBER TO CHANGE THIS TO THE LINE GRADIENT
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

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
