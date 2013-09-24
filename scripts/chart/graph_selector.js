  /**
   *  Selector view
   *
   *  Example:
   *
   *  var graph_selector = new slavery.ui.view.GraphSelector({
   *    el: $('.graph_selector-wrapper')
   *  });
   */


  slavery.ui.view.GraphSelector = cdb.core.View.extend({
    className: 'graph_selector selector',

    events: {
      "click li a": "_onGraphClick",
    },

    initialize: function() {
      var self = this;

      _.bindAll(this, "_toggleOpen");

      this.graphs = new slavery.ui.collection.Graphs();

      // graphs are defined in utils
      _.each(slavery.AppData.GRAPHS, function(graph) {
        self.graphs.add(new slavery.ui.model.Graph(graph['name'] === slavery.AppData.CONFIG.chart.graph ? _.extend(graph, { selected: true }) : graph));
      });

      this.selectedGraph = this.graphs.find(function(graph) { return graph.get("selected"); });

      this.model = new slavery.ui.model.GraphSelector();

      this.model.bind("change:closed", this._toggleOpen);

      var template = $("#graph_selector-template").html();

      this.template = new cdb.core.Template({
        template: template
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

    _addSelectedGraph: function() {
      // this.template = cdb.templates.getTemplate('chart/views/nav.jst.js');
      var template = $("#graph-template").html();

      this.template = new cdb.core.Template({
        template: template
      });

      this.$selected_graph.empty();
      
      this.$selected_graph.append(this.template.render( this.selectedGraph.toJSON() ));
    },

    _toggleOpen: function() {
      var self = this;

      if(this.model.get("closed")) {
        this.$el.addClass("closed");

        this.$graphs.animate({
          opacity: 0,
          width: 0
        }, 50, function() {
          self.$graphs.hide();
          self.$selected_graph.fadeIn(150);
        });
      } else {
        this.$el.removeClass("closed");

        this.$selected_graph.fadeOut(150, function() {
          self.$graphs.show();
          self.$graphs.animate({
            opacity: 1,
            width: 32 * self.graphs.length + 5 * (self.graphs.length - 2) + 8
          }, 50);
        });
      }
    },

    _onGraphClick: function(e) {
      e.preventDefault();

      var $li  = $(e.target).closest("li"),
          name = $li.attr("id");

      if(this.selectedGraph.get("name") === name) {
        if($li.parent().hasClass("selected_graph")) {
          this.open();
        } else {
          this.close();
        }

        return;
      }

      var graph = this.graphs.find(function(graph) { return name === graph.get("name"); });

      this.selectedGraph.set("selected", false);
      graph.set("selected", true);
      this.selectedGraph = graph;

      this._addGraphs();
      this._addSelectedGraph();

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

      this.$graphs         = this.$el.find(".graphs");
      this.$selected_graph = this.$el.find(".selected_graph");

      this._addGraphs();
      this._addSelectedGraph();
      this._toggleOpen();

      return this;
    }
  });
