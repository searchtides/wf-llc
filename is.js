is = {};

is.anchor_wrapped_in_atag = function(a) {
  var tags, regex, xs, valued_tags, link_template, p;
  valued_tags = extract.valued_tags(a);//::->[ATag] all <a> tags which contained anchor
  return valued_tags.length > 0;
};

//::{:html :link}->Bool
is.link_present = function(a) {
  var tags, xs, link_template, proper_link_tags, regex;
  tags = extract.a_tags(a.html);
  xs = tags.map(extract.links_and_anchors);
  link_template = normalize.link(a.link);
  regex = new RegExp(link_template);
  proper_link_tags = xs.filter(function(x) {
    var site_link;
    site_link = normalize.link(x.link);
    return regex.test(site_link);
  });
  return proper_link_tags.length > 0;
};

//::{link: anchor: html:} -> Bool
is.anchor_present = function(a) {
  var anchor, html;
  anchor = normalize.html(a.anchor.toLowerCase());
  html = normalize.html(a.html);
  return html.indexOf(anchor) > -1;
};

//::{link: anchor: html:} -> Bool
is.present = function(a) {
  var tags, regex, xs, valued_tags, link_template, p;
  valued_tags = extract.valued_tags(a);//::->[ATag] all <a> tags which contained anchor
  if (valued_tags.length == 0) return false;
  //here we have links only with anchor text
  xs = valued_tags.map(extract.links_and_anchors);
  link_template = normalize.link(a.link);
  regex = new RegExp(link_template);
  return xs.some(function(x) {
    var site_link;
    site_link = normalize.link(x.link);
    return regex.test(site_link);
  });
};