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

      var w = 900,
          h = 410,
          m = 30;

      var dataset = [];

      var svg = d3.select(".chart")
        .append("svg")
        .attr("width", w+m)
        .attr("height", h+m);

      var circle_attr = {
        "cx": function(d) { return x_scale(d.x); },
        "cy": function(d) { return y_scale(d.y); },
        "r": function(d) { return r_scale(d.radius) },
        "fill": function(d) { return '#F00' ; }
      };

      d3.json('http://walkfree.cartodb.com/api/v2/sql?q=SELECT gdppp AS x, slavery_policy_risk AS y, cartodb_id AS radius FROM gsi_geom WHERE gdppp IS NOT NULL', function(dataset) {
        dataset = dataset.rows;

        x_scale = d3.scale.linear()
          .range([m, w])
          .domain([0, d3.max(dataset, function(d) { return d.x; })]);

        y_scale = d3.scale.linear()
          .range([m, h])
          .domain([0, d3.max(dataset, function(d) { return d.y; })]);

        r_scale = d3.scale.linear()
          .range([10, 20]) // max ball radius
          .domain([0, d3.max(dataset, function(d) { return d.radius; })])

        var circles = svg.selectAll("circle")
          .data(dataset)

        circles.enter()
          .append("circle")
          .attr(circle_attr)
          .on('mouseover', function(e, j, u) {
            d3.select(d3.event.target)
              .transition()
              .attr('r', function(d) { return circle_attr.r(d) + 5; })
          }).on('mouseout', function() {
            d3.select(d3.event.target)
              .transition()
              .attr('r', function(d) { return circle_attr.r(d); });
          })
      });
    },
  });
