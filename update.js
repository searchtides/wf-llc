var update = {};

//::WorkbooksMap->[OMRecord]->IO()
update.workbooks = function(w_map, source_xs) {
  var w_map, client, xs, ys, ss, sheet, zs, range, formats, client_records;
  w_map = w_map || get.workbooks_map();
  ys = source_xs.map(transform.to_workbook_record);
  range = get.sheet('template').getDataRange();
  formats = get.formats(range);
  for (client in w_map) {
    client_records = ys.filter(function(y) {return y['Client'] == client;});
    update.workbook(client, w_map[client], client_records, formats);
  }
};

update.workbook = function(client, url, xs, formats) {
  var ss, archive_sheet, archive, combined, sort_fn, access, sheet, zs, sheet_name;
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
      archive_sheet = ss.getSheetByName('archive')
      if (archive_sheet) {
        archive = ssa.get_vh(archive_sheet);
        var valid_archive = _.reject(archive, invalid_predicate);
        archive = normalize.archive(valid_archive);
      } else {
        archive = [];
      }
      sort_fn = sorter_maker('Date');
      combined = xs.concat(archive).sort(sort_fn);
      clog(combined.length);
      ssa.put_vh(sheet, combined);
    }
}

update.aggregated_data = function(sheet) {
  var attempts, xs, cm_map, clients_map, succes, ys;
  sheet = sheet || get.sheet('aggregated data');
  attempts = [];
  attempts[0] = get.clients_map();
  attempts[1] = get.cm_map();
  attempts[2] = get.om_table();
  succes = attempts.every(function(attempt) {return attempt.right;});
  if (succes) {
    clients_map = attempts[0].right;
    cm_map = attempts[1].right;
    xs = attempts[2].right;
    ys = replace.ids_with_values(xs, cm_map, clients_map);
    ssa.put_vh(sheet, ys);
    return {right : ys.length};
  } else {
    return {left : 'Error getting data from airtable'};
  }
};
