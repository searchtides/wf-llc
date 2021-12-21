var transform = {};

//::AggregationRecord->WorkbookRecord
transform.to_workbook_record = function(x) {
  var res, arr;
  res = {};
  keys(x).forEach(function(source_field) {
    if (FIELDS_MAP[source_field]) {
      res[FIELDS_MAP[source_field]] = x[source_field];
    }
  });
  if (_.isDate(res['Date'])) {
    res['Year'] = res['Date'].getFullYear();
    res['Month'] = res['Date'].getMonth() + 1;
    res['Day'] = res['Date'].getDate();
  } else {
    //must be string
    arr = res['Date'].split('-');
    res['Year'] = arr[0];
    res['Month'] = arr[1];
    res['Day'] = arr[2];
  }
  return res;
};