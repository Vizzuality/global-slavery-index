  /**
   *  Help view
   *
   *  Example:
   *
   *  var help = new slavery.ui.view.Help({
   *    el: $('.help')
   *  });
   */


  slavery.ui.view.Help = cdb.core.View.extend({
    events: {
      "click a": "_onClickLink",
    },

    initialize: function() {
      // this.template = cdb.templates.getTemplate('chart/views/help.jst.js');

      this.template = new cdb.core.Template({
        template: template = $("#help-template").html()
      });

      this.map = this.options.map;

      this.render();
    },

    _onClickLink: function(e) {
      e.preventDefault();

      var dialog = "plot";

      if(this.options.map) {
        dialog = this.map.model.get("area");
      }

      parent.postMessage({
        dialog: dialog
      }, 'http://0.0.0.0:8000');
    },

    render: function() {
      this.$el.append(this.template.render());
      return this;
    }
  });
