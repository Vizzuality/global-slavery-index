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
      this.render();

      this._initViews();
      this._bindEvents();
    },

    render: function() {
      var template = $("#chart-template").html();

      this.template = new cdb.core.Template({
        template: template
      });

      this.$el.append(this.template.render());
      return this.$el;
    },

    _initViews: function() {

    },

    _bindEvents: function() {

    }
  });
