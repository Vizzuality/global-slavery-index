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
      this.trigger('change', { type: 'chart' }, this);
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

      this.loaded = false;

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
      if(this.workViewActive === 'map' && pane['area']) {
        if(pane['area'] === 'region') {
          self.map._setRegionInfo(pane['id']);
        } else if (pane['area'] === 'country') {
          self.map._setCountryInfo(pane['id']);
        }

        self.map._loadArea(pane['area'], function() { self.map._changeArea(pane['area'], pane['id']); });
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
