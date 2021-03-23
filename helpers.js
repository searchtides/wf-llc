function normalize_valid() {
  var sheet, xs, dest_sheet, ys;
  sheet = get.sheet('valid');
  xs = ssa.get_vh(sheet);
  ys = normalize.valid(xs);
  dest_sheet = get.sheet('normalized');
  ssa.put_vh(dest_sheet, ys);
  return ys;
}

function gen_report(matrix) {
  var ys = matrix.map(function(pair){return pair[0] + pair[1];});
  //::Tripple->String
  var subres = function(trio){
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
  }
  var total_records = (ys.reduce(sum));
  var total_valid = matrix.map(function(pair){return pair[0];}).reduce(sum);
  var total_invalid = matrix.map(function(pair){return pair[1];}).reduce(sum);
  var total_res = subres([total_valid, total_invalid, 'total']);
  var analitic_res = matrix.map(subres).join("\n");
  
  return total_res + analitic_res;
}

function validate_master_data() {
  var xs, ys, valid, invalid, sheet_for_invalid_data, valid_q, invalid_q, config, res, total_q;
  config = get.config();
  xs = ssa.get_vh(get.sheet('aggregated data'));
  invalid = _.filter(xs, invalid_predicate);
  valid = _.reject(xs, invalid_predicate);
  valid.forEach(function(x) {jUnit.assert_true(x['IP Location'].indexOf('Transaction') == -1);});
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Barricades!!!////Barricades!!!//Barricades!!!//Barricades!!!//Barricades!!!//Barricades!!!//Barricades!!!
  total_q = xs.length;
  valid_q = valid.length;
  invalid_q = invalid.length;
  jUnit.assert_true(xs.length == valid.length + invalid.length);
  //This must pass. In other way, something strange happenning in the Universe
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Barricades!!!////Barricades!!!//Barricades!!!//Barricades!!!//Barricades!!!//Barricades!!!//Barricades!!!
  var archive_valid = Number(sp.get('total_archive_valid'));
  var archive_invalid = Number(sp.get('total_archive_invalid'));
  var q_matrix = [[valid_q, invalid_q, 'om'],[archive_valid, archive_invalid, 'archive']];
  var res2 = gen_report(q_matrix);
  clog('res2: ');
  clog(res2);
  MailApp.sendEmail(config.report_to, 'OM records validation result for ' + J_I(new Date()), res2);
  sheet_for_invalid_data = get.sheet('invalid');
  ssa.put_vh(sheet_for_invalid_data, invalid);
  var sheet_for_valid_data = get.sheet('valid');
  ssa.put_vh(sheet_for_valid_data, valid);
  crop.sheet(sheet_for_valid_data);
  crop.sheet(sheet_for_invalid_data);
}