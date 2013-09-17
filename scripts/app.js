$(function() {

  var Router = Backbone.Router.extend({

    routes: {
      // Map
      '':               'map',
      '/':              'map',
      'map':            'map',
      'map/':           'map',
      'map/:area/:id':  'mapWithArea',

      // Chart
      'chart':          'chart',
      'chart/':         'chart'
    },

    chart: function() {
      this.trigger('change', { type: 'chart'}, this);
    },

    map: function() {
      this.trigger('change', { type: 'map' }, this);
    },

    mapWithArea: function(area, id) {
      this.trigger('change', { type: 'map', area: area, id: id }, this);
    }
  });

  var App = cdb.core.View.extend({

    el: document.body,

    initialize: function() {
      this.workViewActive = this.options.workViewActive || 'map';

      this._initRouter();
      this._initViews();
    },

    _initRouter: function() {
      this.router = window.router;

      this.router.bind("change", this.activeView, this);
    },

    _initViews: function() {
      // Nav
      this.nav = new slavery.ui.view.Nav({
        el: this.$(".nav")
      });

      this.workTabs = new slavery.ui.view.Tabs({
        el: this.$('.switch'),
        slash: false
      });
      this.addView(this.workTabs);

      // Work view (table and map)
      this.workView = new cdb.ui.common.TabPane({
        el: this.$(".wrapper")
      });
      this.addView(this.workView);

      this.map = new slavery.ui.view.Map({
        el: this.$('.map-wrapper'),
        mapTab: $(this.workTabs.el).find(".map")
      });

      this.chart = new slavery.Chart({
        el: this.$('.chart-wrapper')
      });

      this.workView.addTab('map', this.map, { active: false });
      this.workView.addTab('chart', this.chart, { active: false });

      this.workTabs.linkToPane(this.workView);


    },

    activeView: function(pane) {
      var self = this;

      this.workViewActive = pane['type'];

      // map or chart?
      this.workView.active(this.workViewActive);
      this.workTabs.activate(this.workViewActive);

      if(this.workViewActive === 'map') {
        this.nav.model.set("legend", "map");
      } else {
        this.nav.model.set("legend", "plot");
      }

      // map with area
      if(this.workViewActive === 'map') {

        if(pane['area'] && pane['area'] === 'region') {
          // boundaries are set in utils, uncomment to get them through API SQL
          self.map.map.setView(slavery.AppData.REGIONS[pane['id']].center, slavery.AppData.REGIONS[pane['id']].zoom);

          // var sql = new cartodb.SQL({ user: 'walkfree' });
          // sql.getBounds("SELECT * FROM gsi_geom_copy WHERE region_name = '" + pane['id'] + "'")
          //   .done(function(bounds) {
          //     var center = L.latLngBounds(bounds).getCenter(),
          //         zoom = self.map.map.getBoundsZoom(bounds);

          //     console.log(center, zoom);
          // });
        } else if (pane['area'] && pane['area'] === 'country') {


          var sql = new cartodb.SQL({ user: 'walkfree' });

          sql.getBounds("SELECT * FROM gsi_geom_copy WHERE iso3 = '" + pane['id'] + "'")
            .done(function(bounds) {
              var center = L.latLngBounds(bounds).getCenter(),
                  zoom = self.map.map.getBoundsZoom(bounds);

              self.map.map.setView(center, zoom);
          });
        }
      }
    }
  });

  cdb.init(function() {
    // Router
    window.router = new Router();

    window.app = new App();

    Backbone.history.start();
  });

  setTimeout(send_profiler_stats, 12000);
});
