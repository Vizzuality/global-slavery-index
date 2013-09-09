  /**
   *  Chart view
   *
   *  Example:
   *
   *  var chartView = new slavery.Chart({
   *    el: $('.chart-wrapper')
   *  });
   */


  slavery.Chart = cdb.core.View.extend({

    initialize: function() {
      // this.template = cdb.templates.getTemplate('chart/views/chart.jst.js');
      var template = $("#chart-template").html();

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

    },

    _bindEvents: function() {

    }
  });
