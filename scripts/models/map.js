// TODO: remove non-unsed columns
var gs_columns = [
  //"the_geom",
  //"cartodb_id",
  //"created_at",
  //"updated_at",
  //"the_geom_webmercator",
  "iso_a3",
  "name",
  "access_to_fin_services_index",
  "corruption_index",
  "develop_rights_risk",
  "discrimination_risk",
  "gdppp",
  "human_development_index",
  "human_rights_risk",
  "mean",
  "slavery_policy_risk",
  "state_stability_risk",
  "region",
  "population",
  "slaves_lb_rounded",
  "slaves_ub_rounded",
  "featured",
  "rank",
  "us_tip_report_ranking",
  "remittances_of_gdp",
  "url"
]

function GSData() {
  var table = 'new_index_numbers';
  var sql = new cartodb.SQL({ user: 'walkfree' });

  function _gsdata() {}

  function _columnsSQL(opt) { 
    opt = opt || {};
    var columns = [].concat(gs_columns).concat(opt.extra_columns || []);
    
    return 'select ' + columns.join(',') + ' from ' + table + " ";
  }

  _gsdata.featured = function(c) {
      return sql.execute(_columnsSQL() + "WHERE featured = true", c);
  };

  _gsdata.filter = function(where, options) {
    options = options || {};
    if (options.bounds) {
      options.extra_columns = (options.extra_columns || []);
      options.extra_columns.push('the_geom');

    }
    var filters = [];
    for (var k in where) {
      filters.push(k + " = '{{" + k  + "}}'");
    }

    var _sql = _columnsSQL(options) + "where " + filters.join(" AND ");

    return options.bounds ? sql.getBounds(_sql, where) : sql.execute(_sql, where);
  };

  return _gsdata;
}

var gsdata = GSData();

slavery.ui.model.Map = Backbone.Model.extend({
  defaults: {
    area: 'world'
  }
});
