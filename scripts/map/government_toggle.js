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
      'mouseover': '_onOver',
      'mouseout': '_onOut',
      'click a': '_onClick',
      'mouseover .mini-icon': '_onOver',
      'mouseout .mini-icon': '_onOut'
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

    _onOver: function() {
      if (this.timer) {
        clearTimeout(this.timer);
      }

      this._showInfo();
    },

    _onOut: function() {
      var self = this;

      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout(function() {
        self._hideInfo();
      }, 300);
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
