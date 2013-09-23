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
  },
  CARTOCSS: {
    'default': '#gsi_geom_copy::glow{   line-color: #000;   line-opacity: .2;   line-width: 2; }  #gsi_geom_copy{   line-color: #FFF;   line-opacity: 1;   line-width: 1;   polygon-opacity: 1; } #gsi_geom_copy [ slavery_policy_risk <= 100] {    polygon-fill: #B10026; } #gsi_geom_copy [ slavery_policy_risk <= 89.39] {    polygon-fill: #E31A1C; } #gsi_geom_copy [ slavery_policy_risk <= 75.25] {    polygon-fill: #FC4E2A; } #gsi_geom_copy [ slavery_policy_risk <= 64.64] {    polygon-fill: #FD8D3C; } #gsi_geom_copy [ slavery_policy_risk <= 46.9642857142857] {    polygon-fill: #FEB24C; } #gsi_geom_copy [ slavery_policy_risk <= 36.3571428571429] {    polygon-fill: #FED976; } #gsi_geom_copy [ slavery_policy_risk <= 18.6785714285714] {    polygon-fill: #FFFFB2; } #gsi_geom_copy [ slavery_policy_risk = null] {    polygon-fill: #CCCCCC;   polygon-pattern-file: url("https://s3.amazonaws.com/com.cartodb.users-assets.production/production/walkfree/assets/20130905165330strip1.png");   polygon-pattern-opacity: 0.05; }  #gsi_geom_copy [zoom>=3] {   line-color: #404143;   line-opacity: 1;   line-width: .45; }   #gsi_geom_copy [zoom>=4] {   ::glow{     line-color: #000;     line-opacity: .3;     line-width: 2.9;   }     line-color: #404143;   line-opacity: 1;   line-width: .6; }   #gsi_geom_copy [zoom>=6] {   ::glow{    line-color: #000;     line-opacity: .3;     line-width: 5;   }   line-color: #404143;   line-opacity: 1;   line-width: .9; }'
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

function meanToHuman(num) {
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