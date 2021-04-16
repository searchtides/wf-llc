var update = {};

//::WorkbooksMap->[GeneralRecord]->IO()
update.workbooks = function(w_map, source_xs) {
  var w_map, client, xs, ys, ss, sheet, zs, range, formats, client_records;
  w_map = w_map || get.workbooks_map();
  ys = source_xs;
  range = get.sheet('template').getDataRange();
  formats = get.formats(range);
  for (client in w_map) {
    client_records = ys.filter(function(y) {return y['Client'] == client;});
    update.workbook(client, w_map[client], client_records, formats);
  }
};

update.workbook = function(client, url, xs, formats) {
  var ss, sort_fn, access, sheet, zs, sheet_name;
  sheet_name = 'Live Links';
  try {
    ss = SpreadsheetApp.openByUrl(url);
    access = true;
  } catch (e) {
    log('not able to open ' + client + ' spreadsheet with the link: ' + url, 1);
    access = false;
  }
  if (access) {
    sheet = ss.getSheetByName(sheet_name);
    if (sheet == null) {
      sheet = ss.insertSheet(sheet_name);
      apply.formats(sheet, 1, 1, formats);
    }
    sort_fn = sorter_maker('Date');
    ssa.put_vh(sheet, xs.sort(sort_fn));
  }
};

update.aggregated_data = function(sheet) {
  var config, dbs_map, runs, succes, vh;
  config = get.config();
  dbs_map = get.dbs_map(get.sheet('dbs'));
  sheet = sheet || get.sheet('aggregated data');
  runs = keys(dbs_map).map(function(db_id) {
    var attempts, xs, cm_map, clients_map, succes, ys, teams_map, a;
    a = {config : _.extend({}, config, {database_id : db_id})};
    attempts = [];
    attempts[0] = get.clients_map(a);
    attempts[1] = get.cm_map(a);
    attempts[2] = get.om_table(a);
    attempts[3] = get.teams_map(a);
    succes = attempts.every(function(attempt) {return attempt.right;});
    if (succes) {
      clients_map = attempts[0].right;
      cm_map = attempts[1].right;
      xs = attempts[2].right;
      teams_map = attempts[3].right;
      ys = replace.ids_with_values(xs, cm_map, clients_map, teams_map, dbs_map[db_id].name);
      return {right : ys};
    } else {
      return {left : 'Error getting data from airtable'};
    }
  });
  succes = runs.every(function(x) {return x.right;});
  if (succes) {
    vh = runs.map(function(x) {return x.right;}).reduce(function(a, b) {return a.concat(b);});
    ssa.put_vh(sheet, vh);
    return {right : true};
  } else {
    return {left : 'some failures happened during fetching data from Airtable'};
  }
};
