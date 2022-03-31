function refresh_records_in_groups() {
  var checked_list, non_green, dead, unreachable, corrupted, corrupted_sheet, green, non_green_sheet,
    ureachable_sheet, not_live_sheet, green_sheet;

  checked_list = get.vh('list checked');
  green = checked_list.filter(function(x) {return x['Link Status'] == LINK_STATUSES[0];});
  green_sheet = get.sheet('green');
  ssa.put_vh(green_sheet, green);
  crop.sheet(green_sheet);

  non_green_sheet = get.sheet('non-green');
  non_green = checked_list.filter(function(x) {return x['Link Status'] != LINK_STATUSES[0];});
  ssa.put_vh(non_green_sheet, non_green);
  crop.sheet(non_green_sheet);

  not_live_sheet = get.sheet('not live');
  dead = checked_list.filter(function(x) {return x['Link Status'] == LINK_STATUSES[2];});
  ssa.put_vh(not_live_sheet, dead);
  crop.sheet(not_live_sheet);

  corrupted_sheet = get.sheet('anchor defect');
  corrupted = checked_list.filter(function(x) {return x['Link Status'] == LINK_STATUSES[1];});
  ssa.put_vh(corrupted_sheet, corrupted);
  crop.sheet(corrupted_sheet);

  ureachable_sheet = get.sheet('unreachable');
  unreachable = checked_list.filter(function(x) {return x['Link Status'] == LINK_STATUSES[3];});
  ssa.put_vh(ureachable_sheet, unreachable);
  crop.sheet(ureachable_sheet);
}

function create_checklist() {
  // only valid data from both sources
  var valid, valid_archive, xs, ys, vh, sheet, filter;
  valid = ssa.get_vh(get.sheet('valid'));
  xs = valid.map(transform.to_workbook_record);
  valid_archive = ssa.get_vh(get.sheet('valid archives'))
    .map(function(h) {return _.extend({}, h, {'TEAM' : '', 'db_name' : 'workbook archive'});});
  ys = valid_archive.concat(xs);
  vh = ys.map(function(h) {return _.extend({}, h, {hash : hash(h)});});
  sheet = get.sheet('checklist');
  //next two lines is precaution to avoid issue https://issuetracker.google.com/issues/111316666
  filter = sheet.getFilter();
  if (filter) filter.remove();
  ssa.put_vh(sheet, vh);
}

function collect_archives() {
  var w_map, client, ss, archive_sheet, archive, valid_archive, invalid_archive, total_invalids, xs, ys,
    dest_sheet, total_valids, wth_clients;
  dest_sheet = get.sheet('invalid archives');
  total_invalids = total_valids = 0;
  xs = [];ys = [];
  w_map = get.workbooks_map();
  for (client in w_map) {
    ss = SpreadsheetApp.openByUrl(w_map[client]);
    archive_sheet = ss.getSheetByName('archive');
    if (archive_sheet) {
      archive = ssa.get_vh(archive_sheet);
      valid_archive = normalize.archive(_.reject(archive, invalid_predicate));
      invalid_archive = _.filter(archive, invalid_predicate);
      wth_clients = invalid_archive.map(function(x) {x['Client'] = client;return x;});
      xs = xs.concat(wth_clients);
      wth_clients = valid_archive.map(function(x) {x['Client'] = client;return x;});
      ys = ys.concat(wth_clients);
      total_invalids += invalid_archive.length;
      total_valids += valid_archive.length;
    } else {
      clog(client  + ' No archive tab');
    }
  }
  sp.set('total_archive_valid', total_valids);
  sp.set('total_archive_invalid', total_invalids);
  jUnit.assert_true(total_invalids == xs.length);
  ssa.put_vh(dest_sheet, xs);
  ssa.put_vh(get.sheet('valid archives'), ys);
  return [total_valids, total_valids];
}

function add_data_quality_snapshot() {
  var q_matrix, dest_sheet, start_row, vh, timed_q_matrix, timestamp;
  dest_sheet = get.sheet('QA');
  start_row = dest_sheet.getLastRow() + 1;
  q_matrix = get.q_matrix();
  timestamp = new Date();
  timed_q_matrix = q_matrix.map(function(tripple) {return [timestamp].concat(tripple);});
  ssa.append_matrix(timed_q_matrix, dest_sheet, 1);
}

//::IO()->QaMap
function validate_master_data() {
  //saves results in proper script properties
  var xs, ys, valid, invalid, sheet_for_invalid_data, sheet_for_valid_data, valid_q, invalid_q, res, total_q, sort_fn;
  xs = ssa.get_vh(get.sheet('aggregated data'));
  total_q = xs.length;

  sort_fn = sorter_maker('Live Link Date');
  invalid = _.filter(xs, invalid_predicate).sort(sort_fn);
  invalid_q = invalid.length;

  valid = normalize.valid(_.reject(xs, invalid_predicate)).sort(sort_fn);
  valid_q = valid.length;

  valid.forEach(function(x) {jUnit.assert_true(x['IP Location'].indexOf('Transaction') == -1);});
  jUnit.assert_true(xs.length == valid.length + invalid.length);
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Barricades!!!////Barricades!!!//Barricades!!!//Barricades!!!//Barricades!!!//Barricades!!!//Barricades!!!

  sp.set('total_om_valid', valid_q);
  sp.set('total_om_invalid', invalid_q);

  //visualusation in details for humans
  var q_map = {'valid' : valid, 'invalid' : invalid};
  ['valid', 'invalid'].forEach(function(type) {
    var sheet, filter;
    sheet = get.sheet(type);
    filter = sheet.getFilter();
    if (filter) filter.remove();
    ssa.put_vh(sheet, q_map[type]);
    crop.sheet(sheet);
  });

  return q_map;
}

function gen_report(matrix) {
  var ys = matrix.map(function(pair) {return pair[0] + pair[1];});
  //::Tripple->String
  var subres = function(trio) {
    var total_q, k1, k2, R, res, valid_q, invalid_q;
    valid_q = trio[0];
    invalid_q = trio[1];
    total_q = valid_q + invalid_q;
    k1 = invalid_q / total_q;
    k2 = valid_q / total_q;
    var valid_percentage = (Math.round(k2 * 100)).toFixed(0);
    var invalid_percentage = (Math.round(k1 * 100)).toFixed(0);
    var R = valid_percentage / invalid_percentage;
    res = "\n";
    res += trio[2] + "\n";
    res += 'R=' + R.toFixed(2) + "\n";
    res += 'Total records:' + total_q + "\n";
    res += 'Invalid records(' + invalid_percentage + '%):' + invalid_q + "\n";
    res += 'Valid records(' + valid_percentage + '%):' +  valid_q + "\n";
    return res;
  };
  var total_records = (ys.reduce(sum));
  var total_valid = matrix.map(function(pair) {return pair[0];}).reduce(sum);
  var total_invalid = matrix.map(function(pair) {return pair[1];}).reduce(sum);
  var total_res = subres([total_valid, total_invalid, 'total']);
  var analitic_res = matrix.map(subres).join("\n");

  return total_res + analitic_res;
}