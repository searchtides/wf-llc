var wrap = {};

wrap.in_tag = function(tag, h, s) {
  return "<" + tag + " " + convert.to.attrs(h) + ">" + s + "</" + tag + ">";
};
