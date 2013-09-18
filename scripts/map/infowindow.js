
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
        collapsed: true,
        hidden: false,
        template_name: 'infowindow_loading',
        content: null
      });
    },

    setError: function() {
      this.model.set({
        collapsed: true,
        template_name: 'infowindow_error',
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
      var top  = this.$el.position().top;
      var left = this.$el.position().left;

      var width  = this.$el.width();
      var height = this.$el.height();

      if (top < 0) this.map.panBy([0, top - 20 ]);
    },

    _center: function() {
      var coordinates = this.model.get("coordinates");

      if (coordinates) {
        var point  = this.map.latLngToContainerPoint([coordinates[0], coordinates[1]]);

        var padding = this.model.get("collapsed") ? 10 : 70;

        var left = point.x + 10;
        var top = point.y - this.$el.height()/2 - padding;

        this.$el.css({ left: left, top: top });
      }
    },

    _toggleCollapsed: function() {
      this._center();
    },

    _changeCoordinates: function() {
      // this._pan();
      this._center();
    },

    _changeArea: function(e) {
      e.preventDefault();
      e.stopPropagation();

      this.trigger('changearea', 'country');
      this.trigger('changeurl');
      this.hide();
    }
  });
