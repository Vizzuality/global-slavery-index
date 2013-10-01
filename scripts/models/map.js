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
  "access_to_fin_services_rank",
  "corruption_index",
  "corruption_rank",
  "country_name",
  "develop_rights_risk",
  "discrimination_risk",
  "gdppp",
  "gdppp_rank",
  "human_development_index",
  "human_development_rank",
  "human_rights_risk",
  "iso3",
  "mean",
  "region_name",
  "slavery_policy_risk",
  "state_stability_risk",
  "region",
  "population",
  "slaves",
  "featured"
]

function GSData() {
  var table = 'gsi_geom_copy';
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
