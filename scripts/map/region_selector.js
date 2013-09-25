  /**
   *  Selector view
   *
   *  Example:
   *
   *  var region_selector = new slavery.ui.view.RegionSelector({
   *    el: $('.region_selector')
   *  });
   */


  slavery.ui.view.RegionSelector = cdb.core.View.extend({
    events: {
      "click .link": "_onClickLink",
      "click li a": "_onClickRegion"
    },

    initialize: function() {
      var self = this;

      this.map = this.options.map;

      _.bindAll(this, "_toggleOpen");

      this.regions = new slavery.ui.collection.SelectorItems();

      this.model = new slavery.ui.model.Selector();

      this.model.bind("change:closed", self._toggleOpen);

      this.template = new cdb.core.Template({
        template: $("#selector-template").html()
      });

      // regions are defined in utils
      _.each(slavery.AppData.REGIONS, function(region) {
        self.regions.add(new slavery.ui.model.SelectorItem(region));
      });

      self.selectedRegion = new slavery.ui.model.SelectorItem();

      self.render();
    },

    _addRegions: function() {
      var self = this;

      var template = new cdb.core.Template({
        template: $("#region-template").html()
      });

      this.$regions.empty();

      this.regions.each(function(region) {
        self.$regions.append(template.render( region.toJSON() ));
      });
    },

    _toggleOpen: function() {
      var self = this;

      if(this.model.get("closed")) {
        this.$el.addClass("closed");

        this.$regions.animate({
          opacity: 0,
          height: 0
        }, 50, function() {
          self.$regions.hide();
        });
      } else {
        this.$el.removeClass("closed");

        self.$regions.show();
        self.$regions.animate({
          opacity: 1,
          height: 44 * self.regions.length + 2 * (self.regions.length-1)
        }, 150);
      }
    },

    _onClickLink: function(e) {
      e.preventDefault();

      if(this.model.get("closed")) {
        this.open();
      } else {
        this.close();
      }
    },

    _onClickRegion: function(e) {
      var $li  = $(e.target).closest("li"),
          name = $li.attr("id");

      if(this.selectedRegion.get("name") === name) {
        this.close();

        return;
      }

      var region = this.regions.find(function(region) { return name === region.get("name"); });
      this.selectedRegion = region;

      this._addRegions();

      this.close();
    },

    open: function() {
      this.model.set("closed", false);
    },

    close: function() {
      this.model.set("closed", true);
    },

    render: function() {
      this.$el.append(this.template.render( _.extend(this.model.toJSON(), { link_title: "Region" }) ));

      this.$regions = this.$el.find("ul");

      this._addRegions();
      this._toggleOpen();

      return this;
    }
  });
