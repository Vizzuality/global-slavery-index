slavery.ui.model.Graph = Backbone.Model.extend({
  defaults: {
    selected: false
  }
});

slavery.ui.collection.Graphs = Backbone.Collection.extend({
  model: slavery.ui.model.Graph
});

slavery.ui.model.GraphSelector = Backbone.Model.extend({
  defaults: {
    closed: true
  }
});
