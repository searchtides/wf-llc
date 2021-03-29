var convert = {};
convert.to = {};

convert.to.attrs = function(h) {
  var p, s;
  s = '';
  for (p in h) {
    s += p + "='" + h[p] + "' ";
  }
  return s.trim();
};