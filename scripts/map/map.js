
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

      this.isLoaded = false;

      this.countries_polygons = {};
      this.countries_sublayer = {};

      this.sql = new cartodb.SQL({ user: 'walkfree' });

      this._initViews();
      this._initBindings();

      var polygons_url = 'https://walkfree.cartodb.com/api/v2/sql?q=select iso3, ST_Simplify(the_geom, 0.005) as the_geom from gsi_geom_copy&format=geojson';

      create_polygons(polygons_url, function(polygons) {
        self.countries_polygons = polygons;
        self.trigger("polygonsloaded")
      });
    },

    over: function(key, borderColor) {
      this.out();

      var current_polygon = this.current_polygon = this.countries_polygons[key];
      var current_key = this.current_key;

      if(!current_polygon) return;

      for(var i=0; i < current_polygon.length; ++i) {
        current_polygon[i].geo.setStyle({ color: borderColor });

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
      var self = this;

      $(document).on("keyup", function(e) {
        if (e.keyCode == 27) self.infowindow.model.set({ hidden: true });
      });

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

      this.map = L.map('cartodb-map', {
        center: [0, 0],
        zoom: 3,
        minZoom: 3,
        inertia: false
      });

      this.infowindow = new slavery.ui.view.Infowindow({
        className: "collapsed",
        map: this.map,
        el: this.$(".infowindow-wrapper")
      });

      this.addView(this.infowindow);

      var layerUrl = 'http://walkfree.cartodb.com/api/v2/viz/75be535c-1649-11e3-8469-6d55fc63b176/viz.json';

      this.layerMap = cartodb.createLayer(this.map, layerUrl, { infowindow: false })
        .addTo(this.map)
        .on('done', function(layer) {
          var sublayer = self.countries_sublayer = layer.getSubLayer(1);

          sublayer.setInteractivity('cartodb_id, iso3');
          sublayer.setInteraction(true);

          sublayer.on('featureClick', function(e, latlng, pos, data, layerNumber) {
            self.infowindow.model.set({
              coordinates: latlng
            });

            if(!self.infowindow.model.get("hidden") && self.current_iso === data.iso3) return;
            self.current_iso = data.iso3;

            self.infowindow.setLoading();

            self._setCountryInfo(data.iso3);

            self.sql.execute("SELECT * FROM gsi_geom_copy WHERE cartodb_id = {{id}}", { id: data.cartodb_id })
              .done(function(data) {
                var country = data.rows[0],
                    collapsed = country.country_name ? false : true;

                if(collapsed) {
                  // infowindow error
                  self.infowindow.setError();
                } else {
                  // infowindow success
                  self.infowindow.model.set({
                    hidden: false,
                    content: {
                      slavery_policy_risk: slaveryToHuman(country.slavery_policy_risk),
                      country_name: country.country_name,
                      prevalence: 'high',
                      population: 9801901,
                      slaved: 143142
                    },
                    template_name: 'infowindow_success',
                    collapsed: false
                  });

                  self.infowindow._center();
                }
              })
              .error(function(errors) {
                console.log("error:" + errors);
              });
          });

          sublayer.on('featureOver', function(e, latlng, pos, data, layerNumber) {
            self.over(data.iso3, "#fff");
          });

          sublayer.on('featureOut', function(e, latlng, pos, data, layerNumber) {
            self.out();
          });

          self.trigger("sublayerloaded");
        }).on('error', function() {
          //log the error
        });
    },

    _initBindings: function() {
      this._adjustMapHeight();
      this._bindOnResize();
      this._bindInfowindow();

      this.infowindow.bind("changearea", this._changeArea, this);
      this.panel.bind("changearea", this._changeArea, this);
    },

    _loadCountry: function(callback) {
      this.loadCountry = _.after(4, function() {

        if(!self.isLoaded) {
          self.isLoaded = true;

          callback && callback();
        }
      });

      this.bind("sublayerloaded", function() {
        this.loadCountry && this.loadCountry();
      });

      this.bind("polygonsloaded", function() {
        this.loadCountry && this.loadCountry();
      });
    },

    _setCountryInfo: function(iso, callback) {
      var self = this;

      this.sql.execute("SELECT * FROM gsi_geom_copy WHERE iso3 = '{{id}}'", { id: iso })
        .done(function(data) {
          var country = data.rows[0];

          self.panel.model.set({
            'country_name': country.country_name,
            'country_iso': country.iso3,
            'prevalence': 'high',
            'population': 9801901,
            'slaved':143142,
            // 'gdpppp': country.gdpppp,
            'gdpppp': 7895000000000,
            'region': country.region_name
          });

          self.loadCountry && self.loadCountry();
        })
        .error(function(errors) {
          console.log("error:" + errors);
        });

      this.sql.getBounds("SELECT * FROM gsi_geom_copy WHERE iso3 = '{{id}}'", { id: iso })
        .done(function(bounds) {
          var center = L.latLngBounds(bounds).getCenter(),
              zoom = self.map.getBoundsZoom(bounds);
          self.model.set({
            'center': center,
            'zoom': zoom
          });

          self.loadCountry && self.loadCountry();
        }).error(function(errors) {
          console.log("error:" + errors);
        });
    },

    _changeURL: function(href) {
      this.options.mapTab.attr("data-url", href);
      Backbone.history.navigate(href, true);
    },

    _changeArea: function(area, id) {
      if(id) this.current_iso = id;

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

    _disableInteraction: function() {
      this.map.dragging.disable();
      this.map.touchZoom.disable();
      this.map.doubleClickZoom.disable();
      this.map.scrollWheelZoom.disable();
      this.map.boxZoom.disable();
      this.map.keyboard.disable();
      this.countries_sublayer.setInteraction(false);
    },

    _enableInteraction: function() {
      this.map.dragging.enable();
      this.map.touchZoom.enable();
      this.map.doubleClickZoom.enable();
      this.map.scrollWheelZoom.enable();
      this.map.boxZoom.enable();
      this.map.keyboard.enable();
      this.countries_sublayer.setInteraction(true);
    },

    _onAreaChanged: function() {
      if(this.model.get('area') === 'country') {
        // panel
        this.panel.template.set('template', $("#country_panel-template").html());
        this.panel.render();
        this.panel.show();

        // map
        this.over(this.current_iso, "#333");
        this._disableInteraction();
        this.countries_sublayer.setCartoCSS(slavery.AppData.CARTOCSS['default'] + "#gsi_geom_copy [ iso3 != '" + this.panel.model.get('country_iso') + "'] { polygon-fill: #666; polygon-opacity: 1; line-width: 1; line-color: #333; line-opacity: 1; }");
        this.map.setView(this.model.get('center'), this.model.get('zoom'));

        // url
        this._changeURL('map/country/'+this.panel.model.get('country_iso'));
      } else if(this.model.get('area') === 'region') {
        // infowindow
        this.infowindow.hide();

        // panel
        this.panel.template.set('template', $("#region_panel-template").html());
        this.panel.render();

        // map
        this.out();
        this._enableInteraction();
        this.countries_sublayer.setCartoCSS(slavery.AppData.CARTOCSS['default'] + "#gsi_geom_copy [ region_name != '" + this.panel.model.get('region') + "'] { polygon-fill: #666; polygon-opacity: 1; line-width: 1; line-color: #333; line-opacity: 1; }");

        // url
        this._changeURL('map/region/'+this.panel.model.get('region'));
      } else if(this.model.get('area') === 'world') {
        // infowindow
        this.infowindow.hide();

        // panel
        this.panel.hide();

        // map
        this.countries_sublayer.setCartoCSS(slavery.AppData.CARTOCSS['default']);
        this.map.fitWorld();

        // url
        this._changeURL('map');
      }
    }
  });
