
  /**
   *  Map view
   *
   *  Example:
   *
   *  var mapView = new slavery.Map({
   *    el:         $('.map-wrapper')
   *  });
   */


  slavery.Map = cdb.core.View.extend({

    initialize: function() {
      // this.template = cdb.templates.getTemplate('map/views/map.jst.js');
      var template = $("#cartodb-map-template").html();

      this.template = new cdb.core.Template({
        template: template
      });

      this.render();

      this._initViews();
      this._bindEvents();
    },

    render: function() {
      this.$el.append(this.template.render());
      return this;
    },

    _initViews: function() {
      this.map = L.map('cartodb-map', {
        center: [40, -98],
        zoom: 4
      });

      var layerUrl = 'http://walkfree.cartodb.com/api/v2/viz/75be535c-1649-11e3-8469-6d55fc63b176/viz.json';

      cartodb.createLayer(this.map, layerUrl)
        .addTo(this.map)
        .on('done', function(layer) {
          var sublayer = layer.getSubLayer(1);

          sublayer.infowindow.set('template', $('#infowindow_template').html());
        }).on('error', function() {
          //log the error
        });
    },

    _bindEvents: function() {

    }
  });
