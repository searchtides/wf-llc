//utils 0.4.0

sign = function(x) {return x > 0 ? 1 : (x < 0 ? -1 : 0);};
g_or_eq_sign = function(x) {return x >= 0 ? '+' : '-';};

hash = function(h) {return get_md5(_.values(_.pick(h, TRIPPLE)).join(''));};

function unescape(str) {
  return str.replace(/&#(\d+);/g, function(match, numStr) {
    var num = parseInt(numStr, 10); // read num as normal number
    return String.fromCharCode(num);
  });
}

invalid_predicate = function(x) {
  var a, b, fields;
  fields = keys(x);
  a = fields.some(function(field) {return empty(x[field]);});
  if (x['IP Location']) {
    b = x['IP Location'].indexOf('Transaction') > -1;
  }
  return a || b;
};

sorter_maker = function(p) {
  return function(x, y) {
    var a, b;
    a = x[p] > y[p];
    b = x[p] < y[p];
    return a ? -1 : b ? 1 : 0;
  };
};

//::AdjacencyMatrix->AdjacencyList
function convertToAdjList(adjMatrix) {
  return adjMatrix.map(
    function(r) {
      return r.map(
        function(v, i) {return v ? i : -1;}
      ).filter(function(v) {return v !== -1;});
    }
  );
}

//::AdjacencyList->AdjacencyMatrix
function convertToAjdMatrix(adjList, v) {
  var m;
  m = _.range(0, v).map(function() {return _.range(0, v).map(function() {return 0;});});
  adjList.forEach(function(node, i) {
    node.forEach(function(x) {
      m[i][x] = 1;
    });
  });
  return m;
}

//::Bool->Bool
not = function(x) {return !x;};

//::Bool->Bool->Bool
or = function(a, b) {return a || b;};

//::Bool->Bool->Bool
and = function(a, b) {return a && b;};

numsort = function(a, b) {return Number(a) - Number(b);};

lc = function(x) {return x.toLowerCase();};

takeWhile = function(p, xs) {
  var res, drop;
  drop = false;
  res = [];
  xs.forEach(function(x) {
    if (p(x) && !drop) {res.push(x);}
    else {
      drop = true;
    }
  });
  return res;
};

//::Concatable->Concatable->Concatable
concat = function(a, b) {
  if (_.isArray(a) && _.isArray(b)) {return a.concat(b);}
  if (_.isString(a) && _.isString(b)) {return a + b;}
};

//::a->a->Bool
le = function(x,y) {return x <= y;};
less = function(x,y) {return x < y;};

//::a->a->Bool
ge = function(x,y) {return x >= y;};
greater = function(x,y) {return x > y;};

dropbox_link = function(s) {
  return s.replace('www.dropbox', 'dl.dropboxusercontent');
};

function normalize_name(x) {
  return x.charAt(0).toUpperCase() + x.slice(1).toLowerCase();
}

num = function(x) {return Number(x);};

//::Date->Iso8601
to_iso8601 = function(js_date) {
  var arr, year, month, day, time, time_offset;
  arr = js_date.toString().split(' ');
  year = arr[3];
  day = arr[2];
  month = lz(js_date.getMonth() + 1);
  time = arr[4];
  time_offset = arr[5].slice(3);
  return [year, month, day].join('-') + 'T' + time + time_offset;
};

minutes_to_hm = function(minutes) {
  if (num(minutes)) {
    return Math.floor(minutes / 60) + 'h' + Math.floor((minutes % 60)) + 'm';
  };
  return minutes;
};

//::Url->String->String
link = function(url, string) {
  return '<a href="' + url + '">' + string + '</a>';
};

//::String->Bool
empty = function(x) {return typeof x == 'string' &&  x == '';};

//::String->Bool
ne = function(x) {return !empty(x);};

clog = function(x) {Logger.log(x);};

//::Function->Function->Function
compose = function(f, g) {
  return function(x) {
    return f(g(x));
  };
};

copy = function(x) {return JSON.parse(JSON.stringify(x));};

//::a->a->a
sum = function(a, b) {return a + b;};

concat = function(a, b) {return a.toString() + b.toString();};

//::a->Bool
ndef = function(x) {
  if (typeof x == 'undefined') return true;
  if (x == null) return true;
  else return false;
};

//::a->Bool
def = function(x) {return !ndef(x);};//shortcut for == undefined;

keys = function(x) {return Object.keys(x);};

hyperlink = function(x, name) {return '=HYPERLINK("' + x[name].db_link + '", "' + name + '")';};

//::[Hashtable] -> String -> Hhi
vh_to_hhi = function (vh, key_field) {
  var res;
  res = {};
  vh.forEach(function(h, i) {
    res[h[key_field]] = {idx : i, h : h};
  });
  return res;
};

//::[Hashtable] -> String -> Hh
vh_to_hh = function(vh, key_field) {
  var res;
  res = {};
  vh.forEach(function(h, i) {
    res[h[key_field]] = h;
  });
  return res;
};

//::[Hashtable] -> String->Stirng-> Object
vh_to_h = function(vh, key_field, value_field) {
  var res;
  res = {};
  vh.forEach(function(h, i) {
    res[h[key_field]] = h[value_field];
  });
  return res;
};

//::a->a->a
sum = function(a, b) {return a + b;};

//::Int->Int->Int
div = function(x, n) {return Math.floor(x / n);};

//::String->String
l4z = function(x) {return ('000' + x).substr(-4);};

//::String->String
lz = function(x) {return ('00' + x).substr(-2);};

//::a->a->Bool
le = function(x,y) {return x <= y;};

//::a->a->Bool
ge = function(x,y) {return x >= y;};

//::IO()->String
s4 = function() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

//::IO()->String
guid = function () {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};

hh_to_vh = function(hh) {return Object.keys(hh).map(function(key) {return hh[key];});};

function trim(x) {return x.trim();}

function blow(h, prop, value) {
  value = value;
  if (h[prop] == undefined) h[prop] = value;
  return h;
}

function remove_timebase_trigger(function_name) {
  var triggers;
  triggers =  ScriptApp.getProjectTriggers();
  triggers.forEach(function(element) {
    if (element.getTriggerSource() == ScriptApp.TriggerSource.CLOCK && element.getHandlerFunction() == function_name) {
      ScriptApp.deleteTrigger(element);
      log('trigger ' + function_name + ' deleted');
    }
  });
}

function add_hours(date, n) {
  var d;
  d = new Date(date.getTime());
  d.setHours(d.getHours() + n);
  return d;
}

//::[IndexedVector]->[IndexedVector];
recount_from = function(xs, start_number) {
  return xs.map(function(x, i) {x[INDEX] = i + start_number;return x;});
};

function filter_not_contains(xs, templates) {
  return xs.filter(function(x) {
    return templates.map(function(template) {
      return ! new RegExp(template).test(x.name);
    }).reduce(function(a, b) {return a && b;}, true);
  });
}

function filter_contains(xs, templates) {
  return xs.filter(function(x) {
    return templates.map(function(template) {
      return new RegExp(template).test(x.name);
    }).reduce(function(a, b) {return a || b;}, false);
  });
}

function get_random_int(min, max) {
  //inclusive box min and max
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function process_word(x) {
  var s;
  s = x.replace(/[,."\/=!?:;]/g, '').replace(/^-/g, '').replace(/$-/g, '');
  return s;
}

//::[GParagraph]->Dict
function get_stat(ps) {
  var words, xs, res;
  words = flat(ps.map(function(p) {
    var sentenses, words;
    sentenses = p.split('.');
    words = sentenses.map(function(s) {return s.split(' '); });
    return flat(words);
  })
  );
  xs =  words.map(function(x) {
    var word, processed;
    word = x.toLowerCase();
    processed = process_word(word);
    //clog(word + '->' + processed);
    return processed;
  });
  res = {};
  xs.forEach(function(x) {
    if (res[x] == undefined) {res[x] = 0;}
    res[x]++;
  });
  return res;
}

lenz = function(p, pred) {return function(x,y) {return pred(x[p], y[p]);};};

function existy(x) {return x !== null && x !== undefined && x !== '';}

function truthy(x) {return (x !== false) && existy(x);}

//::(a->Boolean)->SortResult
function comparator(pred) {
  return function(x, y) {
    if (truthy(pred(x, y))) {
      return -1;
    } else {
      if (truthy(pred(y, x))) {
        return 1;
      } else {
        return 0;
      }
    }
  };
}

pluck = function(x, fields) {
  var res;
  res = {};
  fields.forEach(function(fld) {res[fld] = x[fld];});
  return res;
};

//::GroupedVhIndexed -> Vh
hhi_to_vh = function(hh_i) {
  var m, m2;
  m = [];
  keys(hh_i).forEach(function(key) {
    var core;
    core = hh_i[key].h;
    m.push([hh_i[key].idx, core]);//Here we came to matrix;
  });
  m2 =  m.sort(function(a, b) {
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
    return 0;
  });
  return m2.map(function(r) {return r[1];});//here vh;
};

remove_cdata = function(s) {
  return s.replace(/<\!\[CDATA\[/g, '').replace(/\]\]>/g,'');
};

function empty_range(arr, from , to) {return arr.slice(from, to + 1).every(function(x) {return x == '';});}

function iter_to_vh(iter) {
  var r;
  r = [];
  while (iter.hasNext()) {
    r.push(iter.next());
  };
  return r;
}

suffix = function (n) {
  var last, two_last, str;
  if (n < 1) return '';
  str = n.toString().split('');
  last = str.slice(str.length - 1);
  two_last = str.slice(str.length - 2);
  n = Number(two_last.join(''));
  if (n >= 4 && n <= 21) return 'th';
  if (last == 1) return 'st';
  if (last == 2) return 'nd';
  if (last == 3) return 'rd';
  return 'th';
};

function autoresize_columns(sheet) {
  var cols, i;
  sheet.getLastColumn();
  for (i = 1;i <= cols;i++) {
    sheet.autoResizeColumn(i);
  }
};

function xor(a, b) {return ( a || b ) && !( a && b );};

function get_doy(x) {
  return dnt.get_doy(x);
}

//::[Hashtalbe]->[Hashtable]
function reverse_object(h) {
  var res;
  res = {};
  Object.keys(h).forEach(function(key) {res[h[key]] = key;});
  return res;
}

//::[Hashtable] -> String -> GroupedBlocks
function vh_to_hvh(vh, key_field, fn) {
  var res;
  if (fn == undefined) {fn = function(x) {return x;};};
  if (is.empty_vh(vh)) return vh;
  res = {};
  vh.forEach(function(h, i) {
    var key;
    key = fn(h[key_field]);
    if (res[key] == undefined) {
      res[key] = {};
    }
    res[key].push(h);
  });
  return res;
}

function remove_trigger(func_name) {
  var triggers, removed;
  removed = false;
  triggers =  ScriptApp.getProjectTriggers();
  triggers.forEach(function(element) {
    if (element.getHandlerFunction() == func_name) {
      ScriptApp.deleteTrigger(element);
      removed = true;
    }
  });
  return removed;
}

function detect_period(d, start, d1, d2, end) {
  if (d > end || d < start) return undefined;
  if (d >= start && d < d1) return 3;
  if (d >= d1 && d < d2) return 2;
  if (d >= d2 && d <= end) return 1;
}

function digit_at_pos(num, pos) {
  var s, n;
  s = num.toString();
  n = s.length;
  if (pos > n) return 0;
  return Number(s.charAt(n - pos - 1));
}

var compose = function(f, g) {
  return function(x) {
    return f(g(x));
  };
};

var shove = function(f) {
  return function(tuple) {
    var x  = tuple[0],
      s  = tuple[1],
      fx = f(x),
      y  = fx[0],
      t  = fx[1];

    return [y, s + t];
  };
};

var unit = function(x) { return [x, '']; };
var lift = function(f) { return compose(unit, f); };

function flat(v) {return v.reduce(function(a, b) {return a.concat(b);}, []);};

function fmap(v, f) {return v.reduce(function(a, b) {return a.concat(b);}, []).map(f);};

function cut_last(s) {
  if (s == '') return s;
  return s.substr(0, s.length - 1);
}

//::Int -> Stirng
function n_to_a1(a) {//RC -> A1
  var asc1,asc2, m, p, first;
  n = a - 1;
  p = n % 26;
  m = (n - p) / 26;
  asc2 = ('A'.charCodeAt(0)) + p ;
  first = m ? String.fromCharCode(('A'.charCodeAt(0)) + (m - 1)) : '';
  return  first + String.fromCharCode(asc2);
}

//::String -> Int
function a1_to_n(s) {
  var n, i, d, sum, base;
  sum = 0;base = 26;
  n = s.length;
  for (i = 0;i < n;i++) {
    d = s.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
    sum += Math.pow(base, n - i - 1) * d;
  }
  return sum;
}

max = function(arr) {return Math.max.apply(null, arr);};

//::Vh -> [String] -> Hashtable
function sum_fields(vh, fields) {
  var res;
  res = {};
  fields.forEach(function(field) {res[field] = 0;});
  vh.forEach(function(h) {
    fields.forEach(function(field) {res[field] += h[field];});
  });
  return res;
}

function mix_to_h(h, source, list) {
  list.forEach(function(item) {
    h[item] = source[item];
  });
}

function dflt(sheet, def_name) {
  return sheet == undefined ? SpreadsheetApp.getActive().getSheetByName(def_name) : sheet;
}

function remove_triggers() {
  var triggers;
  triggers =  ScriptApp.getProjectTriggers();
  triggers.forEach(function(element) {
    ScriptApp.deleteTrigger(element);
  });
}

function trigger_installed(func_name, triggers) {
  var triggers, res, i;
  res = false;
  if (triggers) {triggers =  ScriptApp.getProjectTriggers();}
  for (i = 0;i < triggers.length;i++) {
    if (triggers[i].getHandlerFunction() == func_name) {res = true;break;}
  }
  return res;
}

function excel_date_to_js(n) {
  var date;
  //n - quantity of days from 1900-01-01 (excel standard);
  //returns milliseconds from 1970-01-01 (unix epoche)
  date = new Date((n - 25569) * 24 * 60 * 60 * 1000);
  return get_utc_date(date);
}

function js_to_excel_date(date) {
  //input - javascript Date object
  //output - quantity of days from 1900-01-01;
  return days_diff(new Date('1970/01/01'), date) + 25569;
}

function time_to_minutes(s) {
  var r, h, m;
  r = s.split(':');
  h = Number(r[0]);
  m = Number(r[1]);
  return h * 60 + m;
}

function interval_to_time_interval(x) {
  return minutes_to_time(x.from) + ' - ' + minutes_to_time(x.to);
}

//Just another function to parse csv
function CSVToArray( strData, strDelimiter ) {
  // Check to see if the delimiter is defined. If not,
  // then default to COMMA.
  strDelimiter = (strDelimiter || ",");

  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
    (
      // Delimiters.
      "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

      // Quoted fields.
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

      // Standard fields.
      "([^\"\\" + strDelimiter + "\\r\\n]*))"
    ),
    "gi"
  );

  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]];

  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;

  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while (arrMatches = objPattern.exec( strData )) {

    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[ 1 ];

    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (
      strMatchedDelimiter.length &&
      (strMatchedDelimiter != strDelimiter)
    ) {

      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push( [] );

    }

    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[ 2 ]) {

      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      var strMatchedValue = arrMatches[ 2 ].replace(
        new RegExp( "\"\"", "g" ),
        "\""
      );

    } else {

      // We found a non-quoted value.
      var strMatchedValue = arrMatches[ 3 ];

    }

    // Now that we have our value string, let's add
    // it to the data array.
    arrData[ arrData.length - 1 ].push( strMatchedValue );
  }

  // Return the parsed data.
  return ( arrData );
};

function identity(x) {return x;};

function to_iso(ms) {
  return new Date(ms).toISOString();
}
//::String -> String
function cdr(s) {return s.substr(-s.length + 1);};

//::Int -> Int -> Any -> [[Any]]
function generate_matrix(h, w, val) {
  var m, i, j;
  m = [];
  for (i = 0;i < h;i++) {
    m[i] = [];
    for (j = 0;j < w;j++) {
      m[i][j] = val;
    }
  }
  return m;
}

//{x::ValidNotes} -> [Dso]
function valid_notes_to_dsos(a) {
  var y, type, xxs, vh;
  y = a.x; vh = [];
  for (type in y) {
    xxs = y[type].map(function(z) {return parse[type](z);}).map(function(w) {return convert.to.dso({type : type, obj : w});});
    vh = vh.concat(xxs);
  };
  return vh;
}

function text_from_file(file) {
  var txt;
  if (file.getMimeType() == 'application/vnd.google-apps.document') {
    txt = DocumentApp.openById(file.getId()).getBody().getText();
  }
  else {
    txt = file.getBlob().getDataAsString();
  }
  return txt;
}

function call_once(x) {
  var n = 0;
  return function(y) {
    if (n) return;
    n = 1;
    return x(y);
  };
}

function format_num(n) {
  var s, i, res, ch, len, k;
  s = n.toString();res = '';
  len = s.length;
  for (i = len;i > 0;i--) {
    ch = s.charAt(i - 1);
    res = ch + res;
    k = len - i + 1;
    if ((k % 3) == 0 && k) {res = ' ' + res;};
  };
  return res.trim();
}

function get_md5(string) {
  var digest;
  digest = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, string);
  return (Utilities.base64Encode(digest));
}
//utils 0.4.0