var process = {};

process.hide = function(id) {
  var sheet;
  sheet = get.sheet('hidden');
  sheet.appendRow([id, new Date]);
  return {type : 'hide', data : 'id'};
};

process.data = function() {
  var sheet, xs, fields, today, THRESHOLD, hidden, hidden_map, config, DAYS_TO_HIDE;
  THRESHOLD = 186;
  config = get.config();
  DAYS_TO_HIDE = config.hide_period;
  today = new Date();
  hidden = get.hidden(get.sheet('hidden'), today, DAYS_TO_HIDE);
  hidden_map = vh_to_h(hidden, 'id', 'date');
  sheet = get.sheet('list checked');
  fields = ['id', 'Month', 'Day', 'Year', 'db_name', 'Live Article URL', 'Client','Link Status', 'type', 'idx'];
  xs = ssa.get_vh(sheet)
    .filter(function(x) {return x['Link Status'] !== 'LIVE';})
    .filter(function(x) {return hidden_map[x.id] == undefined;})
    .sort(sort_date)
    .map(function(x, i) {
      var type;
      type = dnt.days_diff(x['Date'], today) > THRESHOLD ? 'outdated' : 'normal';
      x['type'] = type;
      x['idx'] = i;
      return _.pick(x, fields);
    });
  return {type : 'data', data : {xs : xs, date : J_I(today)}};
};