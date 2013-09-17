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
      // this.template = cdb.templates.getTemplate('chart/views/nav.jst.js');
      var template = $("#nav-template").html();

      this.model = new cdb.core.Model({
        legend: "map"
      });

      this.model.bind("change:legend", this._toggleLegend, this);

      this.template = new cdb.core.Template({
        template: template
      });

      this.render();
    },

    _toggleLegend: function() {

      console.log(this.model.get("legend"));

      if (this.model.get("legend") === 'map') {
        this.$el.find(".legend.map").show();
        this.$el.find(".legend.plot").hide();
      } else {
        this.$el.find(".legend.plot").show();
        this.$el.find(".legend.map").hide();
      }
    },

    render: function() {
      this.$el.append(this.template.render());
      return this;
    }
  });
