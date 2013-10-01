slavery.AppData = {
  REGIONS: {
    'asia': {
      name: 'asia',
      title: 'Asia',
      desc: 'An estimated 72.7% of the estimated total 29.6 million people in modern slavery are in Asia.<br/><br/>The region includes both countries with low prevalence and risk of enslavement (such as Australia and New Zealand), and some with high prevalence and risk (such as Pakistan, India and Thailand).There is wide variation in the implementation of anti-slavery laws and policies within the region.  Australia, for example, has a strong legal and policy response, while countries like Papua-New Guinea, Japan, and China, have enacted few anti-slavery laws.',
      center: {
        lat: 3.5134210456400443, 
        lng: 77.958984375
      },
      zoom: 4
    },
    'west_europe': {
      name: 'west_europe',
      title: 'Europe',
      desc: 'An estimated 1.83 % of the estimated total 29.6 million people in modern slavery are in Europe.<br/><br/>The countries of Western Europe have the lowest overall risk of enslavement by region, reflecting low levels of corruption, low discrimination against women, and strong respect for human rights, and effective anti-slavery laws in some countries.<br/><br/>Estimates of prevalence exist for Bulgaria and Romania and suggest that tens of thousands of victims exist in this region.',
      center: {
        lat: 46.9502622421856,
        lng: 0.3515625
      },
      zoom: 5
    },
    'east_europe': {
      name: 'east_europe',
      title: 'Russia & Eurasia',
      desc: 'An estimated 3.41 % of the estimated total 29.6 million people in modern slavery are in Russia and Eurasia.<br/><br/>Three troubled former Soviet Republics of Central Asia (Turkmenistan, Uzbekistan, Azerbaijan) show very high levels of risk for enslavement. Russia’s large economy draws workers from former Soviet republics and Eastern Europe, some of whom are enslaved in agriculture or construction.<br/><br/>Estimates of the prevalence exist for Belarus, Moldova, and Ukraine, and suggest that tens of thousands of victims exist in this region.',
      center: {
        lat: 51.12106042504407, 
        lng: 40.869140625
      },
      zoom: 4
    },
    'americas': {
      name: 'americas',
      title: 'The Americas',
      desc: 'An estimated 3.73 % of the estimated total 29.6 million people in modern slavery are in the Americas. Though Canada and the US score low on risk, their demand for cheap labour and relatively porous borders make them destinations for modern slavery, with Mexico acting as a transit country.<br/><br/>Slavery policy rankings are lowest (best) for the US, Canada, Nicaragua, Argentina and Brazil, and highest (worst) for Trinidad and Tobago, Barbados and Cuba.<br/><br/>Caribbean basin countries score lower on risk than most Latin America with the important exception of Haiti.',
      center: {
        lat: 1.2303741774326145,
        lng:  -104.94140625,
      },
      zoom: 3
    },
    'africa': {
      name: 'africa',
      title: 'Sub-Saharan Africa',
      desc: 'An estimated 15.88 % of the estimated total 29.6 million people in modern slavery are in Sub-Saharan Africa.<br/><br/>Mauritius leads the region in stability and the protection of human and worker rights, but is eclipsed by South Africa and Gabon in terms of effective anti-slavery policies.<br/><br/>The high prevalence measured for such countries as the Democratic Republic of Congo and Mauritania reflect centuries-old patterns of enslavement, often based on colonial conflicts and injustice exacerbated by contemporary armed conflict.',
      center: {
        lat: -9.840168555999899,
        lng: 19.0667423835001
      },
      zoom: 4
    },
    'middle_east': {
      name: 'middle_east',
      title: 'Middle East and North Africa',
      desc: 'An estimated 2.46% of the estimated total 29.6 million people in modern slavery are in the Middle East and North Africa.<br/><br/>The risk of enslavement is relatively high across the region with little variation. Trafficking between the countries of the region is widespread. Migrant workers are especially vulnerable.<br/><br/>Globally, this region has the highest measured level of discrimination against women, reflected in high levels of forced and child marriages, as well as the widespread exploitation of female domestic workers.',
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
    plot: {
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
