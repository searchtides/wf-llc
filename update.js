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
    try {
      update.workbook(client, w_map[client], client_records, formats);
      Utilities.sleep(1000);
      SpreadsheetApp.flush();
    } catch (e) {
      log(e.message);
    }
  }
};

update.workbook = function(client, url, xs, formats) {
  var ss, sort_fn, access, sheet, zs, sheet_name, id, user, access_type;
  sheet_name = 'Live Links';
  try {
    ss = SpreadsheetApp.openByUrl(url);
    access = true;
  } catch (e) {
    log('not able to open ' + client + ' spreadsheet with the link: ' + url, 1);
    access = false;
  }
  if (access) {
    id = ss.getId();
    user = Session.getActiveUser().getEmail();
    access_type = DriveApp.getFileById(id).getAccess(user);
    if (access_type == 'EDIT' || access_type == 'OWNER') {
      sheet = ss.getSheetByName(sheet_name);
      if (sheet == null) {
        sheet = ss.insertSheet(sheet_name);
        apply.formats(sheet, 1, 1, formats);
      }
      sort_fn = sorter_maker('Date');
      ssa.put_vh(sheet, xs.sort(sort_fn));
      log(client + ' workbook updated', 1);
    } else {
      log('workbook for client ' + client + ' not shared', 1);
    }
  }
};

update.aggregated_data = function(sheet) {
  var config, dbs_map, runs, succes, vh, xs, orm_run;
  config = get.config();
  dbs_map = get.dbs_map(get.sheet('dbs'));
  sheet = sheet || get.sheet('aggregated data');
  xs = keys(dbs_map).map(function(db_id) {
    return get.data_from_db(config, db_id, dbs_map[db_id].name);
  });
  orm_run = get.orm_data(config);
  runs = xs.concat([orm_run]);
  succes = runs.every(function(x) {return x.right;});
  if (succes) {
    vh = runs.map(function(x) {return x.right;}).reduce(function(a, b) {return a.concat(b);});
    ssa.put_vh(sheet, vh);
    return {right : vh.length};
  } else {
    return {left : 'some failures happened during fetching data from Airtable'};
  }
};
