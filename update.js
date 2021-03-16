var update = {};

update.workbooks = function() {
  var w_map, client, xs, ys, ss, sheet, zs, sheet_name, range, formats;
  sheet_name = 'imported';
  w_map = get.workbooks_map();
  xs = ssa.get_vh(get.sheet('normalized'));
  ys = xs.map(transform.to_workbook_record);
  for (client in w_map) {
    try {
      ss = SpreadsheetApp.openByUrl(w_map[client]);
      sheet = ss.getSheetByName(sheet_name);
      if (sheet == null) {
        sheet = ss.insertSheet(sheet_name);
        range = get.sheet('template').getDataRange();
        formats = get.formats(range);
        apply.formats(sheet, 1, 1, formats);
      }
      zs = ys.filter(function(y) {return y['Client'] == client;});
      ssa.put_vh(sheet, zs);
    } catch (e) {
      log('not able to open ' + client + ' spreadsheet with the link: ' + w_map[client], 1);
    }
  }
};

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
