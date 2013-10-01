  /**
   *  Zoom view
   *
   *  Example:
   *
   *  var zoom = new slavery.ui.view.Zoom({
   *    el: $('.zoom')
   *  });
   */


  slavery.ui.view.Zoom = cdb.core.View.extend({

    initialize: function() {
      _.bindAll(this, "_initBindings");

      this.map = this.options.map;

      // this.template = cdb.templates.getTemplate('chart/views/nav.jst.js');
      var template = $("#zoom-template").html();

      this.template = new cdb.core.Template({
        template: template
      });

      this.render();

      this.$zoomIn = $(".zoomIn");
      this.$zoomOut = $(".zoomOut");

      this._initBindings();
    },

    _initBindings: function() {
      this._checkMaxMin(this.map.map.getZoom());
      this.$zoomIn.on('click', null, this, this._onZoomIn);
      this.$zoomOut.on('click', null, this, this._onZoomOut);
    },

    _onZoomIn: function(e) {
      e.preventDefault();

      var self = e.data;

      self.map.closeSelectors();

      self.map.map.zoomIn();
    },

    _onZoomOut: function(e) {
      e.preventDefault();

      if($(e.target).hasClass("disabled")) return;

      var self = e.data;

      self.map.closeSelectors();

      if(self.map.model.get('area') === 'country') {
        self.map.changeArea("region", self.map.current_region);
      } else {
        self.map.map.zoomOut();
      }
    },

    _checkMaxMin: function(zoom) {
      if(zoom > this.map.map.getMinZoom()) {
        this._enableZoomOut();
      } else if(zoom === this.map.map.getMinZoom()) {
        this._disableZoomOut();
      }

      if(zoom < this.map.map.getMaxZoom()) {
        this._enableZoomIn();
      } else if(zoom === this.map.map.getMaxZoom()) {
        this._disableZoomIn();
      }
    },

    _enableZoomIn: function() {
      this.$zoomIn.removeClass("disabled");
    },

    _disableZoomIn: function() {
      this.$zoomIn.addClass("disabled");
    },

    _enableZoomOut: function() {
      this.$zoomOut.removeClass("disabled");
    },

    _disableZoomOut: function() {
      this.$zoomOut.addClass("disabled");
    },

    render: function() {
      this.$el.append(this.template.render());
      return this;
    }
  });
