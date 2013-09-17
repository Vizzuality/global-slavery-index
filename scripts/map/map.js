
  /**
   *  Map view
   *
   *  Example:
   *
   *  var mapView = new slavery.ui.view.Map({
   *    el: $('.map-wrapper')
   *  });
   */


  slavery.ui.view.Map = cdb.core.View.extend({

    initialize: function() {
      var self = this;

      _.bindAll(this, "_onAreaChanged");


      this.model = new slavery.ui.model.Map();

      this.model.bind("change:area", this._onAreaChanged);

      // this.template = cdb.templates.getTemplate('map/views/map.jst.js');
      var template = $("#cartodb-map-template").html();

      this.template = new cdb.core.Template({
        template: template
      });

      this.render();

      var polygons_url = 'https://walkfree.cartodb.com/api/v2/sql?q=select cartodb_id, ST_Simplify(the_geom, 0.005) as the_geom from gsi_geom_copy&format=geojson';
      self.countries_polygons = {};

      create_polygons(polygons_url, function(polygons) {
        self.countries_polygons = polygons;
      });

      this.countries_layer = null;
      this.countries_sublayer = null;

      this._initViews();
      this._initBindings();
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

    _bindInfowindow: function() {

      this.map.on("dragend",   function() { this.infowindow._center(); }, this);
      this.map.on("drag",      function() { this.infowindow._center(); }, this);
      this.map.on("zoomend",   function() { this.infowindow._center(); }, this);
      this.map.on("zoomstart", function() { this.infowindow._center(); }, this);

    },

    _bindOnResize: function() {

      var self = this;

      $(window).resize(function() {
        self._adjustMapHeight();
        self.infowindow._center();
      });

    },

    _adjustMapHeight: function() {

      var mapHeight = $(window).height() - $("nav").outerHeight(true);
      $('.cartodb-map').height(mapHeight);

    },

    _initViews: function() {
      var self = this;

      this.panel = new slavery.ui.view.Panel({
        el: this.$(".panel-wrapper")
      });
      this.addView(this.panel);

      this.infowindow = new slavery.ui.view.Infowindow({
        el: this.$(".infowindow-wrapper")
      });

      this.addView(this.infowindow);

      this.map = L.map('cartodb-map', {
        center: [40, -98],
        zoom: 4,
        inertia:false
      });

      this._adjustMapHeight();

      this._bindInfowindow();
      this._bindOnResize();

      var layerUrl = 'http://walkfree.cartodb.com/api/v2/viz/75be535c-1649-11e3-8469-6d55fc63b176/viz.json';

      cartodb.createLayer(this.map, layerUrl, { infowindow: false })
        .addTo(this.map)
        .on('done', function(layer) {
          var sublayer = self.countries_sublayer = layer.getSubLayer(1);

          sublayer.setInteraction(true);

          sublayer.on('featureClick', function(e, latlng, pos, data, layerNumber) {
            var sql = new cartodb.SQL({ user: 'walkfree' });

            self.infowindow.model.set({
              coordinates: latlng
            });

            sql.execute("SELECT * FROM gsi_geom_copy WHERE cartodb_id = {{id}}", { id: data.cartodb_id })
              .done(function(data) {
                var country = data.rows[0];

                self.panel.model.set({
                  'country_name': country.country_name,
                  'country_iso': country.iso3,
                  'prevalence': 'high',
                  'population': 9801901,
                  'slaved':143142,
                  'gdpppp': country.gdpppp,
                  'region': country.region_name
                });

                self.infowindow.model.set({
                  'slavery_policy_risk': slaveryToHuman(country.slavery_policy_risk),
                  'country_name': country.country_name,
                  'prevalence': 'high',
                  'population': 9801901,
                  'slaved': 143142,
                  'hidden': false
                });
              })
              .error(function(errors) {
                // errors contains a list of errors
                console.log("error:" + errors);
              });

            sql.getBounds('SELECT * FROM gsi_geom_copy WHERE cartodb_id = ' + data.cartodb_id)
              .done(function(bounds) {
                self.model.set({
                  'center': L.latLngBounds(bounds).getCenter(),
                  'zoom': self.map.getBoundsZoom(bounds)
                });
            });
          });

          sublayer.on('featureOver', function(e, latlng, pos, data, layerNumber) {
            self.over(data.cartodb_id);
          });

          sublayer.on('featureOut', function(e, latlng, pos, data, layerNumber) {
            self.out();
          });
        }).on('error', function() {
          //log the error
        });
    },

    _initBindings: function() {
      this.infowindow.bind("changearea", this._changeArea, this);
      this.panel.bind("changearea", this._changeArea, this);
    },

    _changeURL: function(href) {
      this.options.mapTab.attr("data-url", href);
      Backbone.history.navigate(href, true);
    },

    _changeArea: function(area) {
      if(area) {
        this.panel.model.set('area', area);
        this.model.set('area', area);
      } else {
        var current_area = this.model.get('area');

        if(current_area === 'world') {
          this.model.set('area', 'country');
        } else if(current_area === 'country') {
          this.model.set('area', 'region');
        } else {
          this.model.set('area', 'world');
        }
      }
    },

    _onAreaChanged: function() {
      if(this.model.get('area') === 'country') {
        this.countries_sublayer.setInteraction(false);
        this.map.setView(this.model.get('center'), this.model.get('zoom'));

        this.panel.template.set('template', $("#country_panel-template").html());
        this.panel.render();

        this.panel.show();

        this._changeURL('map/country/'+this.panel.model.get('country_iso'));
      } else if(this.model.get('area') === 'region') {
        this.infowindow.hide();

        this.panel.template.set('template', $("#region_panel-template").html());
        this.panel.render();

        // fit regioun bounds
        this.countries_sublayer.setInteraction(true);

        this._changeURL('map/region/'+this.panel.model.get('region'));
      } else if(this.model.get('area') === 'world') {
        this.panel.hide();
        this.infowindow.hide();

        this.map.fitWorld();

        this._changeURL('map');
      }
    }
  });
