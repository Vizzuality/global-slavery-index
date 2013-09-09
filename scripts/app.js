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
      cdb.config.set(this.options.config);

      this.workViewActive = this.options.config || 'map';

      this._initRouter();
      this._initModels();
      this._initViews();
      // this._createLoader();
      this._initBindings();
    },

    _initRouter: function() {
      this.router = window.router;

      this.router.bind("change", this.change, this);
    },

    _initModels: function() {
    },

    _initViews: function() {
      this.mapTab = new cdb.admin.Map({
        el: this.$('.map-wrapper')
      });

      this.chartTab = new cdb.admin.Chart({
        el: this.$('.chart-wrapper')
      });

      // Work tabs
      this.workTabs = new cdb.admin.Tabs({
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
      this.workView.addTab('chart', this.chartTab.render(), { active: false });
      // this.workView.active(this.workViewActive);
      this.workView.active('map');
    },

    _initBindings: function() {
    },

    change: function(slide) {
      console.log(slide['type']);
      // $("header a").removeClass("selected");
      // $("header ." + name).addClass("selected");
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
