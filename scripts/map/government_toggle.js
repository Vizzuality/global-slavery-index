  /**
   *  Selector view
   *
   *  Example:
   *
   *  var government_toggle = new slavery.ui.view.GovernmentToggle({
   *    el: $('.government_toggle')
   *  });
   */


  slavery.ui.view.GovernmentToggle = cdb.core.View.extend({

    active: false,

    events: {
      'click a': '_onClick',
      'mouseover .mini-icon': '_showInfo',
      'mouseout .mini-icon': '_hideInfo'
    },

    initialize: function() {
      this.template = new cdb.core.Template({
        template: $("#government-template").html()
      });

      this.render();
    },

    render: function() {
      this.$el.append(this.template.render());
      this.$info = this.$el.find('.selector-tooltip');
    },

    _onClick: function(e) {
      e.preventDefault();
      this.trigger('toggle_layer');
      this.$el.find('a').toggleClass('active');
    },

    _showInfo: function() {
      this.$info.addClass('active');
    },

    _hideInfo: function() {
      this.$info.removeClass('active');
    }

  });
