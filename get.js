//get 0.6.0

var get = {};

get.statuses_stats = function (checked_list) {
  var res, groups_map, group, xs;
  res = {};
  groups_map = {
    'total' : function() {return true;},
    'green' : function(x) {return x['Link Status'] == LINK_STATUSES[0];},
    'non_green' : function(x) {return x['Link Status'] != LINK_STATUSES[0];},
    'dead' : function(x) {return x['Link Status'] == LINK_STATUSES[2];},
    'with_defects' : function(x) {return x['Link Status'] == LINK_STATUSES[1];},
    'unreachable' : function(x) {return x['Link Status'] == LINK_STATUSES[3];}
  };

  for (group in groups_map) {
    var xs = checked_list.filter(groups_map[group]);
    res[group] = xs.length;
  }
  return res;
};

//::[GeneralRecord]->{<id>:Int}
get.dup_map = function(checklist) {
  var xs, ys, res;
  res = {};
  checklist.forEach(function(h) {
    var hs = h['hash'];
    blow(res, hs, 0);
    res[hs]++;
  });
  xs = _.pairs(res);
  ys = xs.filter(function(x) {return x[1] > 1;});
  return _.object(ys);
};

get.vh = function(s) {return ssa.get_vh(get.sheet(s));};

get.q_matrix = function() {
  var archive_valid, archive_invalid, valid_q, invalid_q, q_matrix;
  valid_q = Number(sp.get('total_om_valid'));
  invalid_q = Number(sp.get('total_om_invalid', invalid_q));
  archive_valid = Number(sp.get('total_archive_valid'));
  archive_invalid = Number(sp.get('total_archive_invalid'));
  q_matrix = [['om', valid_q, invalid_q, ],[ 'archive', archive_valid, archive_invalid]];
  return q_matrix;
};

//::{anchor:String, target_link:String url:String}->Status
get.status = function(h) {
  var html, present, link_present, status;
  try {
    html = UrlFetchApp.fetch(h.url).getContentText().replace(new RegExp("\n", 'g'), ' ');
    present = is.present({html : html, anchor : h.anchor, link : h.target_link});
    if (present) {
      status = 'LIVE';
    } else {
      link_present = is.link_present({html : html, anchor : h.anchor, link : h.target_link});
      status = link_present ? 'LIVE, BUT CORRUPTED ANCHOR' : 'NOT LIVE';
    }
  } catch (e) {
    //log(JSON.stringify(e));
    status = 'UNABLE TO CRAWL';
  }
  return status;
};

get.workbooks_map = function(sheet) {
  var m, res;
  sheet = sheet || get.sheet('workbooks map');
  m = sheet.getDataRange().getValues();
  res = {};
  m.forEach(function(r) {
    var ss_url;
    ss_url = r[1];
    if (/https:\/\/docs.google.com\/spreadsheets/.test(ss_url)) {
      res[r[0]] = r[1];
    }
  });
  return res;
};

//::String->Hashmap
get.map = function(table_name, field, config) {
  var res, xs, m, offset, headers, ys, table_name, fields, fetch_attempt, res_map, config;
  fetch_attempt = fetch.all({table_name : table_name, fields : [field], config : config});
  if (fetch_attempt.right) {
    xs = fetch_attempt.right;
    ys = xs.map(function(x) { return _.extend({}, x.fields, _.pick(x, 'id'));});
    res_map = vh_to_h(ys, 'id', field);
    return {right : res_map};
  } else {
    return fetch_attempt;
  }
};

get.clients_map = function(a) {return get.map('CLIENTS', 'Client', a.config);};

get.teams_map = function(a) {return get.map('TEAM', 'Name', a.config);};

get.cm_map = function(a) {return get.map('CM', '🔹ARTICLE TITLE', a.config);};

//::IO()->Either Error [Record]
get.om_table = function(a) {
  var table_name, fields, formula, xs, ys, fetch_attempt;
  table_name = 'OM';
  fields = ['STATUS 1', 'Import Date'].concat(FIELDS);
  formula = "{STATUS 1} = 'Published'";
  fetch_attempt = fetch.all({table_name : table_name, fields : fields, formula : formula, config : a.config});
  if (fetch_attempt.right) {
    xs = fetch_attempt.right;
    ys = xs.map(function(x) { return _.extend({}, x.fields, _.pick(x, 'id'));});
    return {right : ys};
  } else {
    return fetch_attempt;
  }
};

//GFolder->[Spreadsheet]
get.spreadsheets = function(folder, batch_size) {
  var file_iter, res, file, counter, cont;
  res = [];
  counter = 0;
  cont = true;
  file_iter = folder.getFilesByType('application/vnd.google-apps.spreadsheet');
  while (file_iter.hasNext() && cont) {
    file = file_iter.next();
    res.push(SpreadsheetApp.openById(file.getId()));
    if (batch_size) {
      counter++;
      cont = counter < batch_size;
    }
  }
  return res;
};

/*
  This function helps to copy formats and values from one spreadsheet to another
*/
//::Range->[[{Background: FontColor: Value: FontWeight: HorizontalAlignment}]]
get.formats = function(range) {
  return _.range(0, range.getHeight()).map(function(row) {
    return _.range(0, range.getWidth()).map(function(col) {
      var cell = range.getCell(row + 1, col + 1);
      return {Background : cell.getBackground(),
        FontColor : cell.getFontColor(),
        Value : cell.getValue(),
        FontWeight : cell.getFontWeight(),
        HorizontalAlignment : cell.getHorizontalAlignment()
      };
    });
  });
};

/*
  This function helps to create map of aliases for given vector of values that situated on the tab
*/
//::GSheet->Hashmap
get.assoc_map = function(sheet) {
  var m, source_fields, aliases, res;
  m = sheet.getDataRange().getValues();
  source_fields = m[0];
  aliases = m[1];
  res = {};
  aliases.forEach(function(alias, i) {
    if (ne(alias)) {
      res[source_fields[i]] = alias;
    }
  });
  return res;
};

/*
  This function returns redirect url for things like OAuth2.0
*/
//::IO () -> String
get.redirect_url = function() {
  var config, script_id, url;
  script_id = ScriptApp.getScriptId();
  url = 'https://script.google.com/macros/d/' + script_id + '/usercallback';
  return url;
};

/*
  This function necessary when you establish OAuth2.0 protocol
*/
//::{:client_id :client :service_name :auth_base_url :token_url}->OAuth2Service
get.service = function(a) {
  return OAuth2.createService(a.service_name)
    .setAuthorizationBaseUrl(a.auth_base_url)
    .setTokenUrl(a.token_url)
    .setClientId(a.client_id)
    .setClientSecret(a.client_secret)
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties());
};

/*
  Very usefull function that returns hashmap where keys are names of the tabs in the spreadsheet
*/
//::GSpreadsheet->{<sheetId>:GSheet}
get.sheets_map = function(ss) {
  var res, sheets;
  sheets = ss.getSheets();
  res = {};
  sheets.forEach(function(sheet) {
    res[sheet.getName()] = sheet;
  });
  return res;
};

/*
  The most usefull function. Actually it is a just a alias to another
*/
//::String->GSheet
get.sheet = function(name) {return SpreadsheetApp.getActive().getSheetByName(name);};

get.config = function() {
  var sheet, m, res;
  sheet = SpreadsheetApp.getActive().getSheetByName('config');
  m = sheet.getDataRange().getValues().slice(1);
  res = {};
  m.forEach(function(r) {res[r[0]] = r[1];});
  return res;
};

//get 0.6.0