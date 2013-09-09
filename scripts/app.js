$(function() {

  var Router = Backbone.Router.extend({

    routes: {
      // Map
      '':               'map',
      '/':              'map',
      'map':            'map',
      'map/':           'map',
      'map/:type/:id':  'map',

      // Chart
      'chart':          'chart',
      'chart/':         'chart'
    },

    initialize: function() {

    },

    chart: function() {
      this.trigger('change', { type: 'chart'}, this);
    },

    map: function(area, id) {
      this.trigger('change', { type: 'map', area: area, id: id }, this);
    }
  });

  var App = cdb.core.View.extend({

    el: document.body,

    initialize: function() {
      this.workViewActive = this.options.workViewActive || 'map';

      this._initRouter();
      this._initModels();
      this._initViews();
      // this._createLoader();
      this._initBindings();
    },

    _initRouter: function() {
      this.router = window.router;

      this.router.bind("change", this.activeView, this);
    },

    _initModels: function() {
    },

    _initViews: function() {
      this.mapTab = new slavery.Map({
        el: this.$('.map-wrapper')
      });

      this.chartTab = new slavery.Chart({
        el: this.$('.chart-wrapper')
      });

      // Work tabs
      this.workTabs = new slavery.Tabs({
        el: this.$('.switch'),
        slash: true
      });
      this.addView(this.workTabs);

      // Work view (table and map)
      this.workView = new cdb.ui.common.TabPane({
        el: this.$(".wrapper")
      });
      this.addView(this.workView);

      this.workView.addTab('map', this.mapTab.render(), { active: false });
      this.workView.addTab('chart', this.chartTab, { active: false });
    },

    _initBindings: function() {
    },

    activeView: function(pane) {
      this.workViewActive = pane['type'];

      // map or chart?
      this.workView.active(this.workViewActive);
      // this.menu.setActiveWorkView(name);
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
