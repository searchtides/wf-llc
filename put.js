var put = {};

put.map = function(sheet, h) {
  var m;
  m = keys(h).map(function(key) {return [key, h[key]];});
  sheet.clear();
  if (m.length) {
    sheet.getRange(1, 1, m.length, m[0].length).setValues(m);
  }
};