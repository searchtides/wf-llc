function normalize_valid() {
  var sheet, xs, dest_sheet, ys;
  sheet = get.sheet('valid');
  xs = ssa.get_vh(sheet);
  ys = normalize.valid(xs);
  dest_sheet = get.sheet('normalized');
  ssa.put_vh(dest_sheet, ys);
  return ys;
}

function validate_master_data() {
  var xs, ys, valid, invalid, sheet_for_invalid_data, valid_q, invalid_q, invalid_predicate;
  xs = ssa.get_vh(get.sheet('aggregated data'));

  invalid_predicate = function(x) {
    var a, b, fields;
    fields = keys(x);
    a = fields.some(function(field) {return empty(x[field]);});
    b = x['IP Location'].indexOf('Transaction') > -1;
    return a || b;
  };
  invalid = _.filter(xs, invalid_predicate);
  valid = _.reject(xs, invalid_predicate);
  valid.forEach(function(x) {
    jUnit.assert_true(x['IP Location'].indexOf('Transaction') == -1);
  });
  valid_q = valid.length;
  invalid_q = invalid.length;
  jUnit.assert_true(xs.length == valid.length + invalid.length);
  //This must pass. In other way, something strange happenning in the Universe
  var total_q, k1, k2, R, res;
  res = "\n";
  total_q = xs.length;
  k1 = invalid_q / total_q;
  k2 = valid_q / total_q;
  var valid_percentage = (Math.round(k2 * 100)).toFixed(0);
  var invalid_percentage = (Math.round(k1 * 100)).toFixed(0);
  var R = valid_percentage / invalid_percentage;

  res += 'Total records:' + total_q + "\n";
  res += 'Invalid records(' + invalid_percentage + '%):' + invalid_q + "\n";
  res += 'Valid records(' + valid_percentage + '%):' +  valid_q + "\n";
  res += 'R=' + R.toFixed(2) + "\n";
  clog(res);
  //TODO - send report to management
  //routine saving data and cropping the sheets to gain time from scrolling
  sheet_for_invalid_data = get.sheet('invalid');
  ssa.put_vh(sheet_for_invalid_data, invalid);
  var sheet_for_valid_data = get.sheet('valid');
  ssa.put_vh(sheet_for_valid_data, valid);
  crop.sheet(sheet_for_valid_data);
  crop.sheet(sheet_for_invalid_data);
}