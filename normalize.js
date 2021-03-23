var normalize = {};

//::[OMRecord]->[OMRecord]
normalize.valid = function(raw) {
  raw.forEach(function(x) {
    var fields;
    fields = keys(x);
    fields.forEach(function(field) {
      if (typeof x[field] == 'string') {
        x[field] = x[field].trim();
      }
    });
  });
  return raw;
};

normalize.archive = function(archive) {
  var xs, ys;
  xs = _.reject(archive, invalid_predicate);
  ys = _.filter(archive, invalid_predicate);
  return xs.map(function(ar) {
    ar['IP Location'] = ar['IP Location'].trim();
    if (ar['Follow/NoFollow'] == 'F') {ar['Follow/NoFollow'] = 'Do-Follow';}
    if (ar['Follow/NoFollow'] == 'NF') {ar['Follow/NoFollow'] = 'No-Follow';}
    var month;
    if (ar['Month']) {
      if (_.isString(ar['Month'])) {
        month = MONTHS_SHORT.indexOf(ar['Month']) + 1;
      } else {
        month = ar['Month'];
      }
      ar['Month'] = month;
    }
    jUnit.assert_true(_.isNumber(month) && month >= 1 && month <= 12);
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Баррикады!!!////Баррикады!!!//Баррикады!!!//Баррикады!!!//Баррикады!!!//Баррикады!!!//Баррикады!!!//Баррикады!!!
    var date = new Date();
    date.setYear(ar['Year']);
    date.setMonth(month - 1);
    date.setDate(ar['Day']);
    ar['Date'] = J_I(date);
    return ar;
  });
};