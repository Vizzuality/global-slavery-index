  slavery.ui.view.Tabs = cdb.core.View.extend({

    events: {
      'click': '_click'
    },

    initialize: function() {
      _.bindAll(this, 'activate');
      this.preventDefault = false;
    },

    activate: function(name) {
      this.$('a').removeClass('selected');

      var $a = this.$('a[href$="#'+ ((this.options.slash) ? '/' : '') + name + '"]').addClass('selected'),
          $span = this.$('span.selected');

      // Move selected box
      var w = $a.outerWidth(),
          l = $a.position().left;

      $span.animate({
        width: w,
        left: l + 2
      }, 200, 'swing');
    },

    desactivate: function(name) {
      this.$('a[href$="#' + ((this.options.slash) ? '/' : '') + name + '"]').removeClass('selected');
    },

    disable: function(name) {
      this.$('a[href$="#' + ((this.options.slash) ? '/' : '') + name + '"]').addClass('disabled');
    },

    enable: function(name) {
      this.$('a[href$="#' + ((this.options.slash) ? '/' : '') + name + '"]').removeClass('disabled');
    },

    getTab: function(name) {
      return this.$('a[href$="#' + ((this.options.slash) ? '/' : '') + name + '"]');
    },

    disableAll: function() {
      this.$('a').addClass('disabled');
    },

    removeDisabled: function() {
      this.$('.disabled').parent().remove();
    },

    _click: function(e) {
      if (e && this.preventDefault) e.preventDefault();

      var $t = $(e.target).closest('a'),
          href = $t.attr('href'),
          data_url = $t.attr('data-url');

      if (!$t.hasClass('disabled') && href) {
        var name = href.replace('#/', '#').split('#')[1];
        this.trigger('click', name);

        Backbone.history.navigate(data_url, true);
      }
    },

    linkToPane: function(pane) {
      this.preventDefault = true;
      pane.bind('tabEnabled', this.activate, this);
      this.bind('click', pane.active, pane);
    }

});
