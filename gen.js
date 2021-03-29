var gen = {};

gen.html_table = function(m) {
  var rows;
  rows = m.map(function(r) {
    var tds;
    tds = r.map(function(x) {return wrap.in_tag('td', {}, x);});
    return wrap.in_tag('tr', {}, tds.join(''));
  }).join('');
  return wrap.in_tag('table', {}, rows);
};

//::[OMTableRecord]->{<iso8601d>:[OMTableRecord]}
gen.daily_map = function(xs) {
  var res, day;
  res = {};
  xs.forEach(function(x) {
    var day;
    day = J_I(x['Date']);
    blow(res, day, []);
    res[day].push(x);
  });
  return res;
};