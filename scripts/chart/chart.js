  /**
   *  Chart view
   *
   *  Example:
   *
   *  var chartView = new slavery.Chart({
   *    el: $('.chart-wrapper')
   *  });
   */


  slavery.Chart = cdb.core.View.extend({

    initialize: function() {
      // this.template = cdb.templates.getTemplate('chart/views/chart.jst.js');
      var template = $("#chart-template").html();

      this.template = new cdb.core.Template({
        template: template
      });

      this.render();

      this._initViews();
    },

    render: function() {
      this.$el.append(this.template.render());
      return this;
    },

    _initViews: function() {
      var self = this;

      var m = 40,
          margin_h = 63,
          w = window.innerWidth,
          h = window.innerHeight-margin_h;

      var dataset = [];

      this.graph_selector = new slavery.ui.view.GraphSelector({
        el: this.$(".graph_selector-wrapper")
      });

      var svg = d3.select(".chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

      //TODO: TAKE NOTE OF THE RADIUS VARIABLE!
      d3.json('http://walkfree.cartodb.com/api/v2/sql?q=SELECT human_development_index AS x, slavery_policy_risk AS y, slavery_policy_risk, gdppp AS radius, country_name, region FROM gsi_geom_copy WHERE gdppp IS NOT NULL', function(dataset) {
        dataset = dataset.rows;

        var x_scale = d3.scale.linear()
          .range([m, w-m])
          .domain([d3.min(dataset, function(d) {return d.x}), d3.max(dataset, function(d) { return d.x; })]);

        var y_scale = d3.scale.linear()
          .range([h-m, m])
          .domain([0,d3.max(dataset, function(d) { return d.y; })]);

        var r_scale = d3.scale.linear()
          .range([5, 30]) // max ball radius
          .domain([0, d3.max(dataset, function(d) { return d.radius; })])

        // x axis
        var x_axis = d3.svg.axis().scale(x_scale).ticks(8);
        svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + (h-m) + ")")
          .call(x_axis);

        svg.append("text")
          .attr("class", "x label")
          .attr("x", m)
          .attr("y", h-m+20)
          .text("HUMAN DEVELOPMENT INDEX");

        // y axis
        var y_axis = d3.svg.axis().scale(y_scale).orient("left").ticks(4);
        svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + m + ", 0 )").call(y_axis);

        svg.append("text")
          .attr("class", "y label")
          .attr("x", m-h)
          .attr("y", m-10)
          .attr("transform", "rotate(-90)")
          .text("Slavery policy risk");

        // grid
        svg.selectAll("line.grid_v").data(y_scale.ticks(4)).enter()
          .append("line")
          .attr({
            "class": "grid grid_v",
            "x1": 0,
            "x2": w,
            "y1": function(d){ return y_scale(d); },
            "y2": function(d){ return y_scale(d); }
          });

        svg.selectAll("line.grid_h").data(x_scale.ticks(8)).enter()
          .append("line")
          .attr({
            "class": "grid grid_h",
            "y1": 0,
            "y2": h,
            "x1": function(d){ return x_scale(d); },
            "x2": function(d){ return x_scale(d); }
          });

        // circles
        var circle_attr = {
          "cx": function(d) { return x_scale(d.x); },
          "cy": function(d) { return y_scale(d.y); },
          "r": function(d) { return r_scale(d.radius) },
          "class": function(d) { return d.region ; }
        };

        var circles = svg.selectAll("circle")
          .data(dataset)

        circles.enter()
          .append("circle")
          .attr(circle_attr)
          .on('mouseenter', function(e, j, u) {
            d3.select(d3.event.target)
              .transition()
              .attr('r', function(d) { return circle_attr.r(d) + 5; })
              .style('opacity', 1);

            d3.selectAll(".tipsy")
              .transition()
                .style("opacity","0")
                .remove();

            svg
              .append('svg:text')
              .style("opacity", "0")
              .attr("class", "tipsy")
              .attr("x", x_scale(e.x))
              .attr("y", y_scale(e.y))
              .style("text-anchor", "middle")
              .text(function(d) { return e.country_name + " ("+e.slavery_policy_risk.toFixed(1)+")"; })
              .transition()
                .style("opacity","1")
                .attr("y", y_scale(e.y)-r_scale(e.radius)-18);

          }).on('mouseout', function() {
            d3.select(d3.event.target)
              .transition()
              .attr('r', function(d) { return circle_attr.r(d); })
              .style('opacity', .6);

            d3.select(".tipsy")
              .transition()
                .style("opacity","0")
                .remove();
          })
      });
    },

    _updateView: function(){
      console.log('UPDATE')
    }
    
  });
