slavery.AppData = {
  REGIONS: {
    'asia': {
      name: 'asia',
      title: 'Asia',
      desc: 'It is estimated that 72.7 % of the estimated total 29.6 million people in modern slavery are in Asia. The region includes both countries with low prevalence and risk of enslavement (such as Australia and New Zealand), and some with high prevalence and risk (such as Pakistan, India and Thailand). India is home to the highest number of enslaved people in the world – more than any other country. However, the risk of enslavement varies across the country. The correlation between prevalence and risk is not always clear.  For example, India has a high prevalence but medium estimated risk, perhaps because existing data does not capture complexities like historical practices of debt bondage and the ongoing impact of the caste system. There is wide variation in the implementation of anti-slavery laws and policies.  Australia has a strong legal and policy response, and the Philippines continues to innovate.  Some countries, such as Myanmar, have well drafted laws, but poor implementation.  Others, such as Papua-New Guinea, Japan, and China, have enacted few anti-slavery laws.',
      center: {
        lat: 3.5134210456400443, 
        lng: 77.958984375
      },
      zoom: 4
    },
    'west_europe': {
      name: 'west_europe',
      title: 'Europe',
      desc: 'It is estimated that 1.83 % of the estimated total 29.6 million people in modern slavery are in Europe.The countries of Western Europe have the lowest overall risk of enslavement by region, reflecting low levels of corruption, the lowest levels of measured discrimination against women, a strong respect for human rights, and effective and comprehensive anti-slavery laws (in some countries). Many Western European countries could, with sufficient political will, be slavery-free, but fail to bring sufficient resources to bear on human trafficking and modern slavery. Estimates of the prevalence of trafficking and modern slavery, based on random sample surveys, exist for Bulgaria and Romania. These estimates suggest tens of thousands of victims exist in this region rather than the low thousands of cases reported to governments.The relationship between risk and prevalence is not always clear.  For example, Turkey’s mean of risk is the highest in the European grouping but not on prevalence ranking.',
      center: {
        lat: 46.9502622421856,
        lng: 0.3515625
      },
      zoom: 5
    },
    'east_europe': {
      name: 'east_europe',
      title: 'Russia & Eurasia',
      desc: 'It is estimated that 3.41 % of the estimated total 29.6 million people in modern slavery are in Russia and Eurasia. Three of the troubled former Soviet Republics of Central Asia (Turkmenistan, Uzbekistan, Azerbaijan) show very high levels of risk for enslavement and significant threat to basic human rights. There are mixed modes of labour migration, some of which result in exploitation, between the countries of Central and Eastern Europe. Russia’s large economy draws vulnerable workers, some of whom are ultimately enslaved in agriculture or construction from many of the former Soviet republics as well as from Eastern European countries such as Moldova. Estimates of the prevalence of trafficking and modern slavery, based on random sample surveys, exist for three countries of this region: Belarus, Moldova, and Ukraine. These estimates suggest tens of thousands of victims exist in this region rather than the low number of cases that are reported by governments.',
      center: {
        lat: 51.12106042504407, 
        lng: 40.869140625
      },
      zoom: 4
    },
    'americas': {
      name: 'americas',
      title: 'The Americas',
      desc: 'It is estimated that 3.73 % of the estimated total 29.6 million people in modern slavery are in the Americas. The wealth of Canada and the United States, their demand for cheap labour and relatively porous land borders make them prime destinations for human trafficking. However, both countries score very low on risk, largely reflecting strong measures on modern slavery policy. Aside from the United States and Canada, modern slavery policy rankings are lowest (best) for Nicaragua, Argentina and Brazil, and highest (worst) for Trinidad and Tobago, Barbados and Cuba. Caribbean basin countries have a lower risk of enslavement than most Latin America; however, in Haiti, a long history of poor government, strong legacy of slavery, and an ongoing environmental crisis has made its population extreme vulnerable to enslavement. Mexico is a transit country for South and Central Americans seeking to enter the US, resulting in a criminal economy that preys on migrants, trafficking and enslaving them.',
      center: {
        lat: 1.2303741774326145,
        lng:  -104.94140625,
      },
      zoom: 3
    },
    'africa': {
      name: 'africa',
      title: 'Sub-Saharan Africa',
      desc: 'It is estimated that 15.88 % of the estimated total 29.6 million people in modern slavery are in Sub-Saharan Africa. Sub-Saharan Africa holds the greatest diversity in terms of the risk of enslavement. Mauritius leads the region in stability and the protection of human and worker rights, but is eclipsed by South Africa and Gabon in terms of effective anti-slavery policies. The high prevalence measured for such countries as the Democratic Republic of Congo and Mauritania reflect centuries-old patterns of enslavement, often based on colonial conflicts and injustice exacerbated by contemporary armed conflict. Ongoing conflicts, extremes of poverty, high levels of corruption, and the impact of resource exploitation to feed global markets all increase the risk of enslavement in many African countries. Child and forced marriages are still tolerated in the context of informal or ‘traditional’ legal systems in many countries.',
      center: {
        lat: -9.840168555999899,
        lng: 19.0667423835001
      },
      zoom: 4
    },
    'middle_east': {
      name: 'middle_east',
      title: 'The Middle East and North Africa',
      desc: 'It is estimated that 2.46% of the estimated total 29.6 million people in modern slavery are in the Middle East and North Africa. The risk of enslavement is relatively high across the region with little variation. Trafficking between the countries of the region is widespread. Globally, this region has the highest measured level of discrimination against women, resulting in high levels of forced and child marriages, as well as the widespread exploitation of trafficked women as sex or domestic workers. In recent years, several countries including Egypt, Syria and Morocco have all passed relevant laws on this issue, but due to ongoing conflict and social unrest they are not effectively enforced. Several Middle Eastern countries host large numbers of migrant workers. Not all are enslaved, but some find themselves in situations that can foster enslavement. On average, foreign workers make up 40-90% of the populations of Jordan, Saudi Arabia, Israel, the United Arab Emirates, and Kuwait. ',
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
