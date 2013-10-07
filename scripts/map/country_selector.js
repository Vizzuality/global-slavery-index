  /**
   *  Selector view
   *
   *  Example:
   *
   *  var country_selector = new slavery.ui.view.CountrySelector({
   *    el: $('.country_selector')
   *  });
   */


  slavery.ui.view.CountrySelector = cdb.core.View.extend({
    events: {
      "click .link": "_onClickLink",
      "click li a": "_onClickCountry"
    },

    initialize: function() {
      var self = this;

      this.map = this.options.map;

      _.bindAll(this, "_toggleOpen");

      this.countries = new slavery.ui.collection.SelectorItems();

      this.model = new slavery.ui.model.Selector();

      this.model.bind("change:closed", self._toggleOpen);

      this.template = new cdb.core.Template({
        template: $("#country_selector-template").html()
      });

      var sql = new cartodb.SQL({ user: 'walkfree' });

      gsdata.featured()
        .done(function(data) {
          _.each(data.rows, function(country) {
            self.countries.add(new slavery.ui.model.SelectorItem(country));
          });

          self.selectedCountry = new slavery.ui.model.SelectorItem();

          self.render();
        })
        .error(function(errors) {
          console.log("error:" + errors);
        });
    },

    _addCountries: function() {
      var self = this;

      var template = new cdb.core.Template({
        template: $("#country-template").html()
      });

      this.$countries_high.empty();
      this.$countries_low.empty();

      this.countries.each(function(country) {
        if(country.get('rank') > 10)
          self.$countries_high.append(template.render( country.toJSON() ));
        else
          self.$countries_low.append(template.render( country.toJSON() ));
      });
    },

    _toggleOpen: function() {
      var self = this;

      if(this.model.get("closed")) {
        this.$el.addClass("closed");

        this.$countries.animate({
          opacity: 0,
          height: 0
        }, 50, function() {
          self.$countries.hide();
        });
      } else {
        this.$el.removeClass("closed");

        self.$countries.show();
        self.$countries.animate({
          opacity: 1,
          height: (44 * self.countries.length + 2 * (self.countries.length-1))/2
        }, 150);
      }
    },

    _onClickLink: function(e) {
      e.preventDefault();

      this.trigger("closeotherselectors", "country");

      if(this.model.get("closed")) {
        this.open();
      } else {
        this.close();
      }
    },

    _onClickCountry: function(e) {
      var $li  = $(e.target).closest("li"),
          iso_a3 = $li.attr("id");

      if(this.selectedCountry.get("iso_a3") === iso_a3) {
        this.close();

        return;
      }

      var country = this.countries.find(function(country) { return iso_a3 === country.get("iso_a3"); });
      this.selectedCountry = country;

      this._addCountries();

      this.close();
    },

    open: function() {
      this.model.set("closed", false);
    },

    close: function() {
      this.model.set("closed", true);
    },

    render: function() {
      this.$el.append(this.template.render( _.extend(this.model.toJSON(), { link_title: "Country" }) ));

      this.$countries = this.$el.find(".countries");
      this.$countries_high = this.$el.find(".countries_high");
      this.$countries_low = this.$el.find(".countries_low");

      this._addCountries();
      this._toggleOpen();

      return this;
    }
  });
