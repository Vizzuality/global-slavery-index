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
      column: 'human_development_index',
      description: '',
      selected: true
    },
    'access_to_financial_services': {
      title: 'Access to Financial Services Index',
      column: 'access_to_fin_services_index',
      description: 'Low score indicates low access to financial services, high score indicates increased access to financial services'
    },
    'corruption': {
      title: 'Corruption Index',
      column: 'corruption_index',
      description: 'Low score for corruption indicates more corruption, high score indicates less corruption'
    },
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

        var key = features[i].properties.iso_a3,
            name = features[i].properties.name;

        var key_ = key ? key : nameToKey(name);

        if(polygons[key_]) {
          polygons[key_].push(pol);
        } else {
          polygons[key_] = [pol];
        }
      }
    }

    ready(polygons);
  });
}

function rankColor(num) {
  var color = '';

  if(num>145) {
    color = '#fed976';
  } else if(num > 140 && num <= 145) {
    color = '#fcd373';
  } else if(num > 135 && num <= 140) {
    color = '#facd70';
  } else if(num > 130 && num <= 135) {
    color = '#f8c76d';
  } else if(num > 125 && num <= 130) {
    color = '#f6c16a';
  } else if(num > 120 && num <= 125) {
    color = '#f4bb67';
  } else if(num > 115 && num <= 120) {
    color = '#f1b565';
  } else if(num > 110 && num <= 115) {
    color = '#efaf62';
  } else if(num > 105 && num <= 110) {
    color = '#eda95f';
  } else if(num > 100 && num <= 105) {
    color = '#eba35c';
  } else if(num > 95 && num <= 100) {
    color = '#e89d59';
  } else if(num > 90 && num <= 95) {
    color = '#e69756';
  } else if(num > 85 && num <= 90) {
    color = '#e39154';
  } else if(num > 80 && num <= 85) {
    color = '#e18b51';
  } else if(num > 76 && num <= 80) {
    color = '#de854e';
  } else if(num > 71 && num <= 76) {
    color = '#dc7f4b';
  } else if(num > 66 && num <= 71) {
    color = '#d97949';
  } else if(num > 61 && num <= 66) {
    color = '#d77346';
  } else if(num > 56 && num <= 61) {
    color = '#d46d44';
  } else if(num > 51 && num <= 56) {
    color = '#d16641';
  } else if(num > 46 && num <= 51) {
    color = '#ce603e';
  } else if(num > 41 && num <= 46) {
    color = '#cc593c';
  } else if(num > 36 && num <= 41) {
    color = '#c95339';
  } else if(num > 31 && num <= 36) {
    color = '#c64c37';
  } else if(num > 26 && num <= 31) {
    color = '#c34534';
  } else if(num > 21 && num <= 26) {
    color = '#c03d32';
  } else if(num > 16 && num <= 21) {
    color = '#bd352f';
  } else if(num > 11 && num <= 16) {
    color = '#ba2d2d';
  } else if(num > 6 && num <= 11) {
    color = '#b7232b';
  } else if(num > 1 && num <= 6) {
    color = '#b41628';
  } else {
    color = '#B10026';
  }

  return color;
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function nameToKey(name) {
  return name.toLowerCase().split(' ').join('_').split('.').join('_');
}
