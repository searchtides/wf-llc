var replace = {};

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