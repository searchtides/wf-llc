var update = {};

update.client_statuses = function(config) {
  var ds, fields_map, fetch_attempt, cs_map;
  ds = ssa.get_vh(get.sheet('dbs'));
  fields_map = get.fields_map(get.sheet('clients fields map'));
  fetch_attempt = fetch.clients_statuses(config, ds, fields_map);
  if (fetch_attempt.left) {
    log(fetch_attempt.left, 1);
    return;
  }
  cs_map = gen.clients_status_map(fetch_attempt.right);
  put.client_statuses(get.sheet('client statutes'), cs_map);
};

update.domain_count_map = function() {
  var sheet, vh, domains_map, res, options, headers, payload;
  sheet = get.sheet('aggregated data');
  vh = ssa.get_vh(sheet);
  domains_map = gen.domains_clients_count_map(vh);
  headers = {
    "Content-Type" : "application/json"
  };
  payload = JSON.stringify({'domainsMap' : domains_map});
  options =  {method : 'post', headers : headers, muteHttpExceptions : true, payload : payload};
  return http_req({url : DOMAINS_MAP_UPDATE_ENDPOINT, options : options});
};

update.hidden = function(sheet, date, period, dest_sheet) {
  var xs;
  dest_sheet = dest_sheet || sheet;
  xs = get.hidden(sheet, date, period);
  ssa.clear_matrix(dest_sheet, 2, 1);
  if (xs.length) {
    ssa.put_vh(dest_sheet, xs);
  }
};

//::WorkbooksMap->[GeneralRecord]->IO()
update.workbooks = function(w_map, source_xs) {
  var w_map, client, xs, ys, ss, sheet, zs, range, formats, client_records;
  w_map = w_map || get.workbooks_map();
  ys = source_xs;
  range = get.sheet('template').getDataRange();
  formats = get.formats(range);
  for (client in w_map) {
    client_records = ys.filter(function(y) {return lc(y['Client']) == lc(client);});
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
  var config, ds, runs, succes, vh, xs, orm_runs, rs, orms;
  config = get.config();
  ds = ssa.get_vh(get.sheet('dbs'));
  rs = ds.filter(function(h) {return h['type'] == 'regular';});
  orms = ds.filter(function(h) {return h['type'] == 'orm';});
  sheet = sheet || get.sheet('aggregated data');
  xs = rs.map(function(h) {
    return get.data_from_db(config, h.id, h.name);
  });
  orm_runs = orms.map(function(h) {
    return get.orm_data(config, h.id, h.name);
  });
  runs = xs.concat(orm_runs);
  succes = runs.every(function(x) {return x.right;});
  if (succes) {
    vh = runs.map(function(x) {return x.right;}).reduce(function(a, b) {return a.concat(b);});
    ssa.put_vh(sheet, vh);
    return {right : vh.length};
  } else {
    return {left : 'some failures happened during fetching data from Airtable'};
  }
};
