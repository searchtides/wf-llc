var extract = {};

//::WorkbookRecrods->{:anchor :target_link :url}
extract.check_options = function(h) {
  return {anchor : h['Anchor Text'], target_link : h['Target URL'], url : h['Live Article URL']};
};

//::{:anchor :html} ->[ATag]
extract.valued_tags = function(a) {
  var a_tags, regex, valued_tags, p;
  p = normalize.html(a.anchor.toLowerCase());
  regex = new RegExp(p);
  a_tags = extract.a_tags(a.html);
  valued_tags = a_tags.filter(function(x) {
    var s;
    s = normalize.html(x);
    return s.indexOf(p) > -1;
  });
  return valued_tags;
};

//::String -> [Tag]
extract.a_tags = function(html) {
  var res, regex;
  regex = /<a\s(.*?)<\/a>/g;//regex to retreive data in tag <a>
  res = [];
  while ((arr = regex.exec(html)) !== null) {
    res.push(arr[0]);
  }
  return res;
};

extract.links_and_anchors = function(x) {
  var anchor, link, res;
  res = />(.*?)<\/a>/.exec(x);
  if (_.isNull(res)) {anchor = '';}
  else {anchor = res[1];};
  res = /href=(.*?)[ |>]/.exec(x);
  if (_.isNull(res)) {link = '';}
  else { link = res[1].replace(/"/g, '');}
  return {anchor : anchor, link : link};
};
