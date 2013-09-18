slavery.ui.model.Infowindow = Backbone.Model.extend({
  defaults: {
    hidden: true,
    collapsed: true,
    content: {
      slavery_policy_risk: null,
      country_name: null,
      prevalence: null,
      population: null,
      slaved: null
	}
  }
});
