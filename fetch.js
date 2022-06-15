var fetch = {};

//::Config->[Database]->FieldsMap->ClientStatuses
fetch.clients_statuses = function(conf, ds, fields_map) {
  var res, xs;
  res = {};
  xs = ds.map(function(db) {
    var fields, fetch_attempt, config, type;
    type = db.type;
    config = {airtable_token : conf.airtable_token, database_id : db.id};
    fields = _.keys(fields_map[type]);
    fetch_attempt = get.table(db.client_table, fields, config);
    if (fetch_attempt.right) {
      res[db.name] = fetch_attempt.right.map(function(x) {
        var h = {};
        _.keys(x).forEach(function(k) {
          var new_k;
          new_k = fields_map[type][k] ? lc(fields_map[type][k]) : k;
          h[new_k] = x[k];
        });
        return h;
      });
      return true;
    } else {
      return false;
    }
  });
  if (xs.every(function(x) {return x;})) {
    return {right : res};
  }
  return {left : 'error during getting client status map from airtable'};
};

////::{:table_name, :fields, :filter :config}->Either String Hashmap
fetch.all = function(a) {
  var xs, res, offset, arg;
  xs = [];
  do {
    arg = _.extend({}, a, {offset : offset});
    res = fetch.airtable(arg);
    if (res.right) {
      xs = xs.concat(res.right.records);
      offset = res.right.offset;
    } else {
      return res;
    }
  } while (res.right && res.right.offset);
  return {right : xs};
};

//::{:table_name, :fields, :filter, :offset :config}->Either String Hashmap
fetch.airtable = function(a) {
  var url, table_name, options, res, h, result_map, fn, field, formula, fields, fields_str, offset, config, headers, database_id;
  table_name = a.table_name;
  formula = a.formula;
  fields = a.fields;
  offset = a.offset;
  config = a.config;
  database_id = config.database_id;
  url = [AIRTALBE_ENDPOINT, database_id, table_name].join('/') + '?';
  if (fields) {
    fields_str = fields.map(function(field) {return encodeURI('fields[]=' + field);}).join('&');
    url += fields_str;
  }
  if (offset) {url += '&offset=' + offset;}
  if (formula) {
    url += '&filterByFormula=' + encodeURI(formula);
  }
  headers = {
    "Authorization" : "Bearer " + config.airtable_token,
    "Content-Type" : "application/json"
  };
  options =  {method : 'get', headers : headers, muteHttpExceptions : true};
  fn = function(s) {return JSON.parse(s);};
  res = http_req({url : url, options : options, fn : fn});
  return res;

};