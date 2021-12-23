var render = {};

var wrap = {};

wrap.in_tag = function(tag, h, s) {
  return "<" + tag + " " + convert.to.attrs(h) + ">" + s + "</" + tag + ">";
};

render.clients_ls_report = function(name, m) {
  var xs, css, s, head, body;
  s = '.groupTitle {margin-left: 10px; margin-top: 12px; margin-bottom: 2px; }';
  s += '.data {margin-left: 30px; margin-bottom: 2px; }';
  css = wrap.in_tag('style', {}, s);
  xs = m.map(function(r) {
    var val;
    val = r[0] == 'groupTitle' ? r[1] : wrap.in_tag('a', {href : r[1]}, r[1]);
    return wrap.in_tag('div', {class : r[0]}, val);
  });
  if (xs.length == 0) {
    xs = [wrap.in_tag('div', {class:'groupTitle'}, 'No records')];
  }
  xs.unshift([wrap.in_tag('h3', {class:'name'}, name)]);
  head = wrap.in_tag('head', {}, css);
  body = wrap.in_tag('body',{},xs.join(''));
  return wrap.in_tag('html',{},[head, body].join(''));
};
