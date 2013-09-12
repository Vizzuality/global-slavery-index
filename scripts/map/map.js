
  /**
   *  Map view
   *
   *  Example:
   *
   *  var mapView = new slavery.Map({
   *    el:         $('.map-wrapper')
   *  });
   */


  slavery.ui.view.Map = cdb.core.View.extend({

    initialize: function() {
      var self = this;

      _.bindAll(this, "_goToRegion");

      this.model = new slavery.ui.model.Map();

      this.model.set("region", 'world');

      var polygons_url = 'https://matallo.cartodb.com/api/v2/sql?q=select cartodb_id, ST_Simplify(the_geom, 0.005) as the_geom from gsi_geom&format=geojson';
      self.countries_polygons = {};

      create_polygons(polygons_url, function(polygons) {
        self.countries_polygons = polygons;
      });

      // this.template = cdb.templates.getTemplate('map/views/map.jst.js');
      var template = $("#cartodb-map-template").html();

      this.template = new cdb.core.Template({
        template: template
      });

      this.render();

      var sublayer = null;

      this._initViews();
      this._bindEvents();
    },

    over: function(key) {
      this.out();

      var current_polygon = this.current_polygon = this.countries_polygons[key];
      var current_key = this.current_key;

      if(!current_polygon || current_key === key) return;

      for(var i=0; i < current_polygon.length; ++i) {
        this.map.addLayer(current_polygon[i].geo);
      }
    },

    out: function(){
      if(this.current_polygon) {
        var current_polygon = this.current_polygon;

        for(var i=0; i < current_polygon.length; ++i) {
          this.map.removeLayer(current_polygon[i].geo);
        }

        current_polygon = null;
      }
    },

    render: function() {
      this.$el.append(this.template.render());
      return this;
    },

    _initViews: function() {
      var self = this;

      this.map = L.map('cartodb-map', {
        center: [40, -98],
        zoom: 4
      });

      var layerUrl = 'http://walkfree.cartodb.com/api/v2/viz/75be535c-1649-11e3-8469-6d55fc63b176/viz.json';

      cartodb.createLayer(this.map, layerUrl)
        .addTo(this.map)
        .on('done', function(layer) {
          self.layer = layer;

          layer.infowindow.bind("change:region", self._goToRegion, self);

          sublayer = layer.getSubLayer(1);

          layer.on('featureClick', function(e, latlng, pos, data, layerNumber) {
            var sql = new cartodb.SQL({ user: 'matallo' });

            sql.getBounds('SELECT * FROM gsi_geom WHERE cartodb_id = ' + data.cartodb_id).done(function(bounds) {
              self.model.set({
                'center': L.latLngBounds(bounds).getCenter(),
                'zoom': self.map.getBoundsZoom(bounds)
              });
            });
          });

          layer.on('featureOver', function(e, latlng, pos, data, layerNumber) {
            self.over(data.cartodb_id);
          });

          layer.on('featureOut', function(e, latlng, pos, data, layerNumber) {
            self.out();
          });

          sublayer.infowindow.set({
            'template': $('#infowindow_template').html(),
            'template_type': 'underscore'
          });
        }).on('error', function() {
          //log the error
        });
    },

    _bindEvents: function() {

    },

    _goToRegion: function() {
      sublayer.setInteraction(false);

      this.model.set('region', 'country');
      this.map.setView(this.model.get('center'), this.model.get('zoom'));
    }
  });
