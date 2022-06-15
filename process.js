var process = {};

process.hide = function(id) {
  var sheet;
  sheet = get.sheet('hidden');
  sheet.appendRow([id, new Date]);
  return {type : 'hide', data : 'id'};
};

process.data = function() {
  var sheet, xs, fields, today, THRESHOLD, hidden_sheet, config, vh, cs_map;
  THRESHOLD = 186;
  config = get.config();
  today = new Date();
  hidden_sheet = get.sheet('hidden');
  sheet = get.sheet('list checked');
  fields = ['id', 'Month', 'Day', 'Year', 'db_name', 'Live Article URL', 'Client','Link Status', 'type', 'idx'];
  vh = ssa.get_vh(sheet);
  cs_map = get.clients_statuses(get.sheet('client statutes'));
  vh = extract.active(vh, cs_map);
  xs = get.not_live_unhidden(vh, hidden_sheet, today, config);
  xs = xs.map(function(x, i) {
    var type;
    type = dnt.days_diff(x['Date'], today) > THRESHOLD ? 'outdated' : 'normal';
    x['type'] = type;
    x['idx'] = i;
    return _.pick(x, fields);
  });
  return {type : 'data', data : {xs : xs, date : J_I(today)}};
};