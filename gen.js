var gen = {};

//::[WorkbookRecord]->[LsClientReportRecord]
gen.m_for_clients_ls_report = function(xs) {
  var ys, zs, res, status;
  ys = xs.filter(function(x) {return x['Link Status'] != 'LIVE';});
  zs = ys.sort(function(x, y) {
    var a, b;
    a = x['Link Status'];
    b = y['Link Status'];
    return a > b ? 1 : (a < b ? -1 : 0);
  });
  res = [];
  zs.forEach(function(z) {
    if (status !== z['Link Status']) {
      status = z['Link Status'];
      res.push(['groupTitle', status, '']);
    }
    res.push(['data', z['Live Article URL'], [z['Year'], lz(z['Month']), lz(z['Day'])].join('-')]);
  });
  return res;
};

gen.ls_report = function(g_map) {
  var m, htmlBody, html, design_map, groups;
  groups = ['total', 'green', 'non_green', 'dead', 'with_defects', 'unreachable'];
  design_map = {
    'green' : {
      title : 'Live',
      class : 'green',
      title_class : 'regular',
      sheet : 'green'
    },
    'total' : {
      title : 'Total',
      class : 'regular',
      title_class : 'regular',
      sheet : 'list checked'
    },
    'non_green' : {
      title : 'Non-green',
      class : 'non-green',
      title_class : 'regular',
      sheet : 'non-green'
    },
    'dead' : {
      title : '| Not live',
      class : 'red small',
      title_class : 'small',
      sheet : 'not live'
    },
    'with_defects' : {
      title : '| Bad anchor',
      class : 'orange small',
      title_class : 'small',
      sheet : 'anchor defect'
    },
    'unreachable' : {
      title : '| Unreachabe',
      class : 'blue small',
      title_class : 'small',
      sheet : 'unreachable'
    }
  };
  m = keys(g_map).map(function(group) {
    var col1, col2, h, ss_url, tab_id, link_to_tab;
    h = design_map[group];
    ss_url = SpreadsheetApp.getActive().getUrl();
    tab_id = get.sheet(h.sheet).getSheetId();
    link_to_tab = ss_url + '#gid=' + tab_id;
    col1 = '<a ' + convert.to.attrs({class : h.title_class})  + 'href="' + link_to_tab + '">'  + h.title + '</a>';
    col2 = wrap.in_tag('span', {class : h.class}, g_map[group]);
    return [col1 , col2];
  });
  htmlBody = gen.html_table(m);
  var css = '.regular {}';
  css += '.small {font-size:0.8em;}';
  css += '.green {color:green;}';
  css += '.red {color:red;}';
  css += '.orange {color:orange;}';
  css += '.blue {color:blue;}';
  css += '.non-green {color:gray;}';
  var style = wrap.in_tag('style', {} , css);
  var html_header = wrap.in_tag('head', {}, style);
  html = html_header + htmlBody;
  return html;
};

//::QaMap->Iso8601d->Html
gen.qa_report = function(qa_map, day) {
  var day_before, diff, xs, m, table_html, html, html_body, A, B, totals_by_group, diff_by_groups,
    totals_by_valid, diff_by_valid, total, QAday;
  day_before = D_I(I_D(day) - 1);
  diff = gen.qa_days_diff(qa_map, day_before, day);
  if (keys(diff).length == 0) {return 'Previous day is missing in the QA map';}
  A = ['om', 'archive'];
  B = ['valid', 'invalid'];
  totals_by_group = A.map(function(g) {return B.map(function(s) {return qa_map[day][g][s];}).reduce(sum);});
  diff_by_groups = A.map(function(g) {return B.map(function(s) {return diff[g][s];}).reduce(sum);});
  totals_by_valid = B.map(function(s) {return A.map(function(g) {return qa_map[day][g][s];}).reduce(sum);});
  diff_by_valid = B.map(function(s) {return A.map(function(g) {return diff[g][s];}).reduce(sum);});
  total = totals_by_group.reduce(sum);
  QAday = qa_map[day];
  QAday.total = {valid : totals_by_valid[0], invalid : totals_by_valid[1]};
  diff.total = {valid : diff_by_valid[0], invalid : diff_by_valid[1]};
  xs = A.concat('total').map(function(g) {
    var ys;
    ys = B.map(function(s) {
      var res, value, sgn, s_sig, cls;
      value = diff[g] ? diff[g][s] : 0;
      sgn = sign(value);
      if (s == 'valid') {
        if (sgn > 0) {cls = 'positive';} else if (sgn < 0) {cls = 'negative';} else {cls = 'neutral';};
      } else {
        if (sgn > 0) {cls = 'negative';} else if (sgn < 0) {cls = 'positive';} else {cls = 'neutral';};
      }
      s_sig = g_or_eq_sign(sgn);
      res = QAday[g][s];
      res += wrap.in_tag('span', {class : 'superscript ' + cls}, '(' + s_sig + value + ')');
      return res;
    });
    return [g].concat(ys);
  });

  xs.unshift(['', 'Valid', 'Invalid']);
  table_html = gen.html_table(xs);
  html_body = wrap.in_tag('body', {}, table_html);
  var css = '.superscript {vertical-align: top; font-size:0.6em}';
  css += '.positive {color:green;}';
  css += '.negative {color:red;}';
  var style = wrap.in_tag('style', {} , css);
  var html_header = wrap.in_tag('head', {}, style);
  html = html_header + html_body;
  return html;
};

//::QaMap->Iso8601d->Iso8601d->{:valid :invalid}
gen.qa_days_diff = function(qa_map, day1, day2) {
  var res;
  res = {};
  if (qa_map[day1] && qa_map[day2]) {
    keys(qa_map[day1])/*om&archive*/.map(function(p) {
      res[p] = {};
      keys(qa_map[day1][p])/*valid&invalid*/.map(function(s) {
        res[p][s] = qa_map[day2][p][s] - qa_map[day1][p][s];
      });
    });
  }
  return res;
};

gen.qa_map = function(vh) {
  var res;
  res = {};
  vh.forEach(function(h) {
    var day, group;
    group = h['group'];
    day = J_I(h['timestamp']);
    blow(res, day, {});
    blow(res[day], group, {});
    res[day][group].valid = h['valid'];
    res[day][group].invalid = h['invalid'];
  });
  return res;
};

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