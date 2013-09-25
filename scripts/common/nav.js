  /**
   *  Nav view
   *
   *  Example:
   *
   *  var nav = new slavery.Nav({
   *    el: $('.nav')
   *  });
   */


  slavery.ui.view.Nav = cdb.core.View.extend({

    initialize: function() {
      this.model = new cdb.core.Model();

      this.model.bind("change:legend", this._toggleLegend, this);

      // this.template = cdb.templates.getTemplate('chart/views/nav.jst.js');
      this.template = new cdb.core.Template({
        template: template = $("#nav-template").html()
      });

      this.render();
    },

    _toggleLegend: function() {

      if (this.model.get("legend") === 'map') {
        this.$el.find(".legend-map").show();
        this.$el.find(".legend-plot").hide();
      } else {
        this.$el.find(".legend-plot").show();
        this.$el.find(".legend-map").hide();
      }
    },

    render: function() {
      this.$el.append(this.template.render());
      return this;
    }
  });
