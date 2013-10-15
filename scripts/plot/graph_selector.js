  /**
   *  Selector view
   *
   *  Example:
   *
   *  var graph_selector = new slavery.ui.view.GraphSelector({
   *    el: $('.graph_selector')
   *  });
   */


  slavery.ui.view.GraphSelector = cdb.core.View.extend({
    events: {
      "click .link": "_onClickLink",
      "click li a": "_onClickGraph"
    },

    initialize: function() {
      var self = this;

      _.bindAll(this, "_toggleOpen");

      this.graphs = new slavery.ui.collection.SelectorItems();

      // graphs are defined in utils
      _.each(slavery.AppData.GRAPHS, function(graph) {
        self.graphs.add(new slavery.ui.model.SelectorItem(graph));
      });

      this.selectedGraph = this.graphs.find(function(graph) { return graph.get("selected"); });

      this.model = new slavery.ui.model.Selector();

      this.model.bind("change:closed", this._toggleOpen);

      this.template = new cdb.core.Template({
        template: $("#selector-template").html(),
      });

      this.render();
    },

    _addGraphs: function() {
      var self = this;

      var template = new cdb.core.Template({
        template: $("#graph-template").html()
      });

      this.$graphs.empty();

      this.graphs.each(function(graph) {
        self.$graphs.append(template.render( graph.toJSON() ));
      });
    },

    _toggleOpen: function() {
      var self = this;

      if(this.model.get("closed")) {
        this.$el.addClass("closed");

        this.$graphs.animate({
          opacity: 0,
          height: 0
        }, 50, function() {
          self.$graphs.hide();
        });
      } else {
        this.$el.removeClass("closed");

        self.$graphs.show();
        self.$graphs.animate({
          opacity: 1,
          height: 34 * self.graphs.length + 2 * (self.graphs.length-1)
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

    _onClickGraph: function(e) {
      e.preventDefault();

      var $li  = $(e.target).closest("li"),
          column = $li.attr("id");

      if(this.selectedGraph.get("column") === column) {
        this.close();

        return;
      }

      var graph = this.graphs.find(function(graph) { return column === graph.get("column"); });

      this.selectedGraph.set("selected", false);
      graph.set("selected", true);
      this.selectedGraph = graph;

      this.trigger("updateview", this.selectedGraph);

      this._addGraphs();

      this.close();
    },

    open: function() {
      this.model.set("closed", false);
    },

    close: function() {
      this.model.set("closed", true);
    },

    render: function() {
      this.$el.append(this.template.render( _.extend(this.model.toJSON(), { link_title: "Graph" }) ));

      this.$graphs = this.$el.find("ul");
      this.$selected_graph = this.$el.find(".selected_graph");

      this._addGraphs();
      this._toggleOpen();

      return this;
    }
  });
