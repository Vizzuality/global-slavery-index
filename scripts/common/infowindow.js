// override cartodb.js
cdb.geo.ui.InfowindowModel.prototype.defaults = {
  latlng: [0, 0],
  offset: [-10, -93],
  autoPan: true,
  content: "",
  visibility: false,
  fields: null, // contains the fields displayed in the infowindow
  template_type: 'underscore'
};

cdb.geo.ui.Infowindow = cdb.geo.ui.Infowindow.extend({
  events: cdb.core.View.extendEvents({
    'click .more': 'goToCountry',
    'mousemove': 'killEvent'
  }),

  goToCountry: function(e) {
    e.preventDefault();
    e.stopPropagation();

    this.model.set('region', 'country');
    this.model.set('visibility', false);
  },

  /**
   *  Render infowindow content
   */
  render: function() {

    if(this.template) {

      // If there is content, destroy the jscrollpane first, then remove the content.
      var $jscrollpane = this.$el.find(".cartodb-popup-content");
      if ($jscrollpane.length > 0 && $jscrollpane.data() != null) {
        $jscrollpane.data().jsp && $jscrollpane.data().jsp.destroy();
      }

      // Clone fields and template name
      var fields = _.map(this.model.attributes.content.fields, function(field){
        return _.clone(field);
      });
      var template_name = _.clone(this.model.attributes.template_name);
      // Sanitized them
      var sanitized_fields = this._fieldsToString(fields, template_name);
      var data = this.model.get('content') ? this.model.get('content').data : {};

      this.$el.html(this.template({ 
          content: {
            fields: sanitized_fields,
            data: data
          }
        })
      );

      // Hello jscrollpane hacks!
      // It needs some time to initialize, if not it doesn't render properly the fields
      // Check the height of the content + the header if exists
      var self = this;
      setTimeout(function() {
        var actual_height = self.$el.find(".cartodb-popup-content").outerHeight() + self.$el.find(".cartodb-popup-header").outerHeight();
        if (self.minHeightToScroll <= actual_height)
          self.$el.find(".cartodb-popup-content").jScrollPane({
            maintainPosition:       false,
            verticalDragMinHeight:  20
          });
      }, 1);

      // If the infowindow is loading, show spin
      this._checkLoading();

      // If the template is 'cover-enabled', load the cover
      this._loadCover();
    }

    return this;
  },

  /**
   *  Animate infowindow to show up
   */
  _animateIn: function(delay) {
    if (!$.browser.msie || ($.browser.msie && parseInt($.browser.version) > 8 )) {
      this.$el.css({
        'marginLeft':'-10px',
        'display':'block',
        opacity:0
      });

      this.$el
      .delay(delay)
      .animate({
        opacity: 1,
        marginLeft: 0
      },300);
    } else {
      this.$el.show();
    }
  },

  /**
   *  Animate infowindow to disappear
   */
  _animateOut: function() {
    if (!$.browser.msie || ($.browser.msie && parseInt($.browser.version) > 8 )) {
      var self = this;
      this.$el.animate({
        marginLeft: "-10px",
        opacity:      "0",
        display:      "block"
      }, 180, function() {
        self.$el.css({display: "none"});
      });
    } else {
      this.$el.hide();
    }
  },

  /**
   *  Adjust pan to show correctly the infowindow
   */
  adjustPan: function (callback) {
    var offset = this.model.get("offset");

    if (!this.model.get("autoPan") || this.isHidden()) { return; }

    var
    x               = this.$el.position().left,
    y               = this.$el.position().top,
    containerHeight = this.$el.outerHeight(true) - 93, // Adding some more space
    containerWidth  = this.$el.width(),
    pos             = this.mapView.latLonToPixel(this.model.get("latlng")),
    adjustOffset    = {x: 0, y: 0};
    size            = this.mapView.getSize()
    wait_callback   = 0;

    if (pos.x - offset[0] < 0) {
      adjustOffset.x = pos.x - offset[0] - 10;
    }

    if (pos.x - offset[0] + containerWidth > size.x) {
      adjustOffset.x = pos.x + containerWidth - size.x - offset[0] + 10;
    }

    if (pos.y - containerHeight < 0) {
      adjustOffset.y = pos.y - containerHeight - 10;
    }

    if (pos.y - containerHeight > size.y) {
      adjustOffset.y = pos.y + containerHeight - size.y;
    }

    if (adjustOffset.x || adjustOffset.y) {
      this.mapView.panBy(adjustOffset);
      wait_callback = 300;
    }

    return wait_callback;
  }
});
