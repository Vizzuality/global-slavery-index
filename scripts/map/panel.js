
  /**
   *  Panel view
   *
   *  Example:
   *
   *  var panel = new slavery.ui.view.Panel({
   *    el: $('.panel')
   *  });
   */


  slavery.ui.view.Panel = cdb.core.View.extend({
    _REGIONS: {
      middle_east: {
        desc: 'middle_east description'
      },
      west_europe: {
        desc: 'west_europe description'
      },
      east_europe: {
        desc: 'east_europe description'
      },
      africa: {
        desc: 'africa description'
      },
      asia: {
        desc: 'asia description'
      },
      americas: {
        desc: 'Although there had been some trans-Saharan trade from the interior of Sub-Saharan Africa to other regions, slavery was a small part of the economic life of many societies in Africa until the introduction of transcontinental slave trades (Arab and Atlantic). Slave practices were again transformed with European colonization of Africa and the formal abolition of slavery in the early 1900s.'
      }
    },

    initialize: function() {
      var self = this;

      _.bindAll(this, "toggle", "_toggle");

      this.model = new slavery.ui.model.Panel();

      this.model.bind("change:hidden", this._toggle);

      // this.template = cdb.templates.getTemplate('map/views/panel.jst.js');
      this.template = new cdb.core.Template({
        template: $("#country_panel-template").html()
      });
    },

    render: function() {
      this.model.set('region_desc', this._REGIONS[this.model.get('region')].desc);

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
        $(this.$el).delay(600).fadeIn(150);
      } else {
        $(this.$el).fadeOut(250);
      }
    }
  });
