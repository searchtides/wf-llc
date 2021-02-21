//get 0.6.0

var get = {};

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