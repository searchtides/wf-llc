var put = {};

//::GSheet->ClientStatusesMap->IO()
put.client_statuses = function(sheet, h) {
  var clients, dbs, fn, m;
  clients = _.keys(h).sort();
  fn = _.compose(_.unique, _.flatten);
  dbs = fn(clients.map(function(client) {return _.keys(h[client]);})).sort();
  m = clients.map(function(client) {
    return [client].concat(dbs.map(function(db) {
      return h[client][db] ? h[client][db] : '';
    }));
  });
  m.unshift([''].concat(dbs));
  sheet.clear();
  sheet.getRange(1, 1, m.length, m[0].length).setValues(m);
};

put.map = function(sheet, h) {
  var m;
  m = keys(h).map(function(key) {return [key, h[key]];});
  sheet.clear();
  if (m.length) {
    sheet.getRange(1, 1, m.length, m[0].length).setValues(m);
  }
};