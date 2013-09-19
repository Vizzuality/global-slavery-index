
  /**
   *  Infowindow view
   *
   *  Example:
   *
   *  var infowindow = new slavery.ui.view.Infowindow({
   *    el: $('.infowindow-wrapper')
   *  });
   */


  slavery.ui.view.Infowindow = cdb.core.View.extend({
    events: cdb.core.View.extendEvents({
      'click .more': '_changeArea',
      'click .close': 'hide'
    }),

    initialize: function() {
      var self = this;

      _.bindAll(this, "toggle", "_toggle", "_changeTemplate", "_center");

      this.map = this.options.map;

      this.model = new slavery.ui.model.Infowindow();

      this.model.bind("change:hidden", this._toggle, this);
      this.model.bind("change:coordinates", this._changeCoordinates, this);
      this.model.bind("change:collapsed", this._toggleCollapsed, this);
      this.model.bind("change:template_name", this._changeTemplate, this);
      this.model.bind("change:content", this.render, this);

      // this.template = cdb.templates.getTemplate('map/views/panel.jst.js');
      var template = $("#infowindow_loading-template").html();

      this.template = new cdb.core.Template({
        template: template
      });

      this.render();
    },

    render: function() {
      this.$el.html(this.template.render( this.model.toJSON() ));

      return this;
    },

    toggle: function() {
      if(!this.model.get("hidden")) {
        this.model.set("hidden", true);
      } else {
        this.model.set("hidden", false);
      }
    },

    show: function() {
      this.model.set("hidden", false);
    },

    hide: function(e) {
      e && e.preventDefault();
      e && e.stopPropagation();

      this.model.set("hidden", true);
    },

    setLoading: function() {
      this.model.set({
        hidden: false,
        template_name: 'infowindow_loading',
        content: null,
        collapsed: true
      });
    },

    setError: function() {
      this.model.set({
        template_name: 'infowindow_error',
        collapsed: true
      });
    },

    _changeTemplate: function() {
      this.template.set('template', $("#" + this.model.get('template_name') + "-template").html());
      this.render();
    },

    _toggle: function() {
      var self = this;

      if(!this.model.get("hidden")) {
        $(this.$el).fadeIn(150);
      } else {
        $(this.$el).fadeOut(350);
      }
    },

    _pan: function() {
      var top  = this.$el.position().top,
          left = this.$el.position().left,
          width = this.$el.width(),
          height = this.$el.height(),
          size = this.map.getSize(),
          adjustOffset = {x: 0, y: 0},
          padding = 30;

      if (top < 0) {
        adjustOffset.y = top - padding;
      }

      if (top + height + padding > size.y - 63) {
        adjustOffset.y = top + height + padding - (size.y - 63);
      }

      if (left + padding + width > size.x) {
        adjustOffset.x = left + width - (size.x - padding);
      }

      if(!this.model.get("collapsed")) {
        this.map.panBy(adjustOffset);
      }

      this._center();
    },

    _center: function() {
      var coordinates = this.model.get("coordinates");

      if (coordinates) {
        var point  = this.map.latLngToContainerPoint([coordinates[0], coordinates[1]]);

        var height = this.$el.height();
        var padding = 10;

        if(!this.model.get("collapsed")) {
          var header_padding = this.$el.find(".infowindow-title").height() - 21;

          height -= header_padding;
          padding = 55;
        }

        var left = point.x + 10;
        var top = point.y - height/2 - padding;

        this.$el.css({ left: left, top: top });
      }
    },

    _toggleCollapsed: function() {
      this._center();
      this._pan();
    },

    _changeCoordinates: function() {
      this._center();
      this._pan();
    },

    _changeArea: function(e) {
      e.preventDefault();
      e.stopPropagation();

      this.trigger('changearea', 'country');
      this.trigger('changeurl');
      this.hide();
    }
  });
