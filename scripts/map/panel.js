
  /**
   *  Panel view
   *
   *  Example:
   *
   *  var panel = new slavery.ui.view.Panel({
   *    el: $('.panel-wrapper')
   *  });
   */


  slavery.ui.view.Panel = cdb.core.View.extend({
    events: cdb.core.View.extendEvents({
      'click .back': '_changeArea'
    }),

    _REGIONS: {
      europe: {
        name: 'Europe',
        desc: 'europe description'
      },
      asia: {
        name: 'Asia',
        desc: 'asia description'
      },
      eurasia: {
        name: 'Russia & Eurasia',
        desc: 'eurasia description'
      },
      americas: {
        name: 'The Americas',
        desc: 'americas description'
      }
    },

    initialize: function() {
      var self = this;

      _.bindAll(this, "toggle", "_toggle");

      this.model = new slavery.ui.model.Panel();

      this.model.bind("change:hidden", this._toggle);

      // this.template = cdb.templates.getTemplate('map/views/panel.jst.js');
      var template = $("#country_panel-template").html();

      this.template = new cdb.core.Template({
        template: template
      });
    },

    render: function() {
      this.model.set('region_name', this._REGIONS[this.model.get('region')].name);
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
        $(this.$el).fadeIn(150);
      } else {
        $(this.$el).fadeOut(150);
      }
    },

    _changeArea: function(e) {
      e.preventDefault();
      e.stopPropagation();

      this.trigger('changearea');

      var href = $(e.target).closest('a').attr('href');
      Backbone.history.navigate(href, true);
    }
  });
