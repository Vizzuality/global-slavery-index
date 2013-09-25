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
    className: 'country_selector selector',

    events: {
      "click .link": "_onClickLink",
      "click li a": "_onClickCountry"
    },

    initialize: function() {
      var self = this;

      _.bindAll(this, "_toggleOpen");

      this.countries = new slavery.ui.collection.SelectorItems();

      this.model = new slavery.ui.model.Selector();

      this.model.bind("change:closed", self._toggleOpen);

      this.template = new cdb.core.Template({
        template: $("#country_selector-template").html()
      });

      var sql = new cartodb.SQL({ user: 'walkfree' });

      sql.execute("SELECT * FROM gsi_geom_copy WHERE featured = true")
        .done(function(data) {
          _.each(data.rows, function(country) {
            self.countries.add(new slavery.ui.model.SelectorItem(country));
          });

          // TODO: SELECTED COUNTRY
          self.selectedCountry = new slavery.ui.model.Selector();

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

      this.$countries.empty();

      this.countries.each(function(country) {
        self.$countries.append(template.render( country.toJSON() ));
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
          height: 44 * self.countries.length + 2 * (self.countries.length-1)
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

    _onClickCountry: function(e) {
      var $li  = $(e.target).closest("li"),
          iso3 = $li.attr("id");

      if(this.selectedCountry.get("iso3") === iso3) {
        this.close();

        return;
      }

      var country = this.countries.find(function(country) { return iso3 === country.get("iso3"); });

      this.selectedCountry.set("selected", false);
      country.set("selected", true);
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
      this.$el.append(this.template.render( this.model.toJSON() ));

      this.$countries         = this.$el.find(".countries");
      this.$selected_country = this.$el.find(".selected_country");

      this._addCountries();
      this._toggleOpen();

      return this;
    }
  });
