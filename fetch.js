var fetch = {};

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