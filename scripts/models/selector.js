slavery.ui.model.SelectorItem = Backbone.Model.extend({
  defaults: {
    selected: false
  }
});

slavery.ui.collection.SelectorItems = Backbone.Collection.extend({
  model: slavery.ui.model.Graph
});

slavery.ui.model.Selector = Backbone.Model.extend({
  defaults: {
    closed: true
  }
});
