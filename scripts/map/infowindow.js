
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
    }),

    initialize: function() {
      var self = this;

      _.bindAll(this, "toggle", "_toggle");

      this.model = new slavery.ui.model.Infowindow();
      this.model.bind("change:country_name change:prevalence change:population change:slaved change:gdpppp change:region", this.render, this);
      this.model.bind("change:hidden", this._toggle, this);
      this.model.bind("change:coordinates", this._changeCoordinates, this);

      // this.template = cdb.templates.getTemplate('map/views/panel.jst.js');
      var template = $("#infowindow-template").html();

      this.template = new cdb.core.Template({
        template: template
      });
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

    hide: function() {
      this.model.set("hidden", true);
    },

    _toggle: function() {
      if(!this.model.get("hidden")) {
        $(this.$el).fadeIn(150);
        this._center();
      } else {
        $(this.$el).fadeOut(150);
      }
    },

    _center:function() {

      var coordinates = this.model.get("coordinates");

      if (coordinates) {
        var point  = app.map.map.latLngToContainerPoint([coordinates[0], coordinates[1]]);

        var left = point.x - this.$el.width() / 2;
        var top  = point.y - this.$el.height();

        this.$el.css({ left: left, top: top });
      }

    },

    _changeCoordinates:function() {
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
