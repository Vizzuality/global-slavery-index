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

      this.template = new cdb.core.Template({
        template: template
      });

      this.render();
    },

    render: function() {
      this.$el.append(this.template.render());
      return this;
    }
  });
