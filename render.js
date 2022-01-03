var render = {};

var wrap = {};

wrap.in_tag = function(tag, h, s) {
  return "<" + tag + " " + convert.to.attrs(h) + ">" + s + "</" + tag + ">";
};

render.pivot_ls_report = function(ls_map, day) {
  var xs, css, head, body, ys, title, report_body;
  xs = keys(ls_map).map(function(name) {
    var m;
    m = gen.m_for_clients_ls_report(ls_map[name]);
    return render.ls_report_body(name, m);
  }).reduce(concatA);
  css = wrap.in_tag('style', {}, render.ls_css());
  head = wrap.in_tag('head', {}, css);
  ys = [wrap.in_tag('h2', {}, 'Report on ' + day), PLACEHOLDER_TEMPLATE];
  title = ys.join('');
  report_body = '<dev>' + xs.join('') + '</dev>';
  body = wrap.in_tag('body', {}, title + report_body);
  return wrap.in_tag('html',{},[head, body].join(''));
};

render.ls_css = function() {
  var s;
  s = '.groupTitle {margin-left: 10px; margin-top: 12px; margin-bottom: 2px; }';
  s += '.data {margin-left: 30px; margin-bottom: 2px; }';
  return s;
};

render.clients_ls_report = function(name, m) {
  var css, head, body;
  css = wrap.in_tag('style', {}, render.ls_css());
  head = wrap.in_tag('head', {}, css);
  body = wrap.in_tag('body', {}, render.ls_report_body(name, m));
  return wrap.in_tag('html',{},[head, body].join(''));
};

render.ls_report_body = function(name, m) {
  var xs;
  xs = m.map(function(r) {
    var val;
    val = r[0] == 'groupTitle' ? r[1] : wrap.in_tag('a', {href : r[1]}, r[1]);
    return wrap.in_tag('div', {class : r[0]}, val);
  });
  if (xs.length == 0) {
    xs = [wrap.in_tag('div', {class : 'groupTitle'}, 'No records')];
  }
  xs.unshift([wrap.in_tag('h3', {class : 'name'}, name)]);
  return xs;
};
