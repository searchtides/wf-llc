var render = {};

var wrap = {};

wrap.in_tag = function(tag, h, s) {
  return "<" + tag + " " + convert.to.attrs(h) + ">" + s + "</" + tag + ">";
};

//::Hashmap->Date
render.pivot_ls_report = function(ls_map, date) {
  var content, css, head, body, ys, title, report_body;
  content = keys(ls_map).map(function(name) {
    var map;
    map = gen.map_for_clients_ls_report(ls_map[name], date);
    return render.ls_report_body(name, map);
  }).join('');
  css = wrap.in_tag('style', {}, render.ls_css());
  head = wrap.in_tag('head', {}, css);
  ys = [wrap.in_tag('h2', {}, 'Report on ' + J_I(date)), PLACEHOLDER_TEMPLATE];
  title = ys.join('');
  report_body = '<dev>' + content + '</dev>';
  body = wrap.in_tag('body', {}, title + report_body);
  return wrap.in_tag('html',{},[head, body].join(''));
};

render.ls_css = function() {
  var s;
  s = '.groupTitle {margin-left: 10px; margin-top: 12px; margin-bottom: 2px; }';
  s += '.data {margin-left: 30px; margin-bottom: 2px; }';
  s += '.outdated {color: red}';
  s += 'tr {white-space: nowrap;}td {padding-right: 4px;}';
  return s;
};

render.clients_ls_report = function(name, m) {
  var css, head, body;
  css = wrap.in_tag('style', {}, render.ls_css());
  head = wrap.in_tag('head', {}, css);
  body = wrap.in_tag('body', {}, render.ls_report_body(name, m));
  return wrap.in_tag('html',{},[head, body].join(''));
};

render.ls_report_body = function(name, map) {
  var title, content;
  if (keys(map).length) {
    content = keys(map).sort().map(function(status) {
      var zs, rows, table;
      zs = map[status].map(function(x) {
        var day, db_name, link;
        day = wrap.in_tag('span', {class : x.type}, x.day);
        db_name = x.db_name;
        link = wrap.in_tag('a', {href : x.link}, x.link);
        return [day, db_name, link].map(function(z) {return wrap.in_tag('td', {}, z);}).join('');
      });
      rows = zs.map(function(z) {return wrap.in_tag('tr', {}, z);}).join('');
      table = wrap.in_tag('table', {class : 'data'}, rows);
      return wrap.in_tag('div', {class : 'groupTitle'}, status) + table;
    }).join('');
  } else {
    content = wrap.in_tag('div', {class : 'groupTitle'}, 'No records');
  }
  title = wrap.in_tag('h3', {class : 'name'}, name);
  return title + content;
};
