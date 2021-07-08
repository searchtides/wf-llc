var replace = {};

replace.fields = function(h, fields_map) {
  var xs;
  xs = _.pairs(h).map(function(pair) {
    var key;
    key = fields_map[pair[0]] ? fields_map[pair[0]] : pair[0];
    return [key, pair[1]];
  });
  return _.object(xs);
};

replace.ids_with_values = function(xs, cm_map, clients_map, teams_map, db_name) {
  var ys;
  ys = xs.map(function(x) {
    var field;
    field = 'CLIENT*';
    if (clients_map[x[field]]) {x[field] = clients_map[x[field]];}
    field = 'CM';
    if (cm_map[x[field]]) {x[field] = cm_map[x[field]];}
    field = 'TEAM';
    if (teams_map[x[field]]) {x[field] = teams_map[x[field]];}
    x['db_name'] = db_name;
    return x;
  });
  return ys;
};