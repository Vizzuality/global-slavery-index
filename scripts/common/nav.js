  /**
   *  Nav view
   *
   *  Example:
   *
   *  var nav = new slavery.Nav({
   *    el: $('.nav')
   *  });
   */


  slavery.Nav = cdb.core.View.extend({

    initialize: function() {
      // this.template = cdb.templates.getTemplate('chart/views/nav.jst.js');
      var template = $("#nav-template").html();

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
