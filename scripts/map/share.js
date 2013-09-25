  /**
   *  Share view
   *
   *  Example:
   *
   *  var zoom = new slavery.ui.view.Share({
   *    el: $('.share')
   *  });
   */


  slavery.ui.view.Share = cdb.core.View.extend({
    initialize: function() {
      // this.template = cdb.templates.getTemplate('chart/views/nav.jst.js');

      this.template = new cdb.core.Template({
        template: template = $("#share-template").html()
      });

      this.render();
    },

    render: function() {
      this.$el.append(this.template.render());
      return this;
    }
  });
