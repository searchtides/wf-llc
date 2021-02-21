var fetch = {};

//::{:table_name, :fields, :filter, :offset}->Either String Hashmap
fetch.airtable = function(a) {
  var url, table_name, options, res, h, result_map, fn, field, formula, fields, fields_str, offset;
  table_name = a.table_name;
  formula = a.formula;
  fields = a.fields;
  offset = a.offset;
  url = [AIRTALBE_ENDPOINT, DATABASE_ID, table_name].join('/') + '?';
  if (fields) {
    fields_str = fields.map(function(field) {return encodeURI('fields[]=' + field);}).join('&');
    url += fields_str;
  }
  if (offset) {url += '&offset=' + offset;}
  if (formula) {
    url += '&filterByFormula=' + encodeURI(formula);
  }
  options =  {method : 'get', headers : HEADERS, muteHttpExceptions : true};
  fn = function(s) {return JSON.parse(s);};
  res = http_req({url : url, options : options, fn : fn});
  return res;

};

fetch.om2 = function(offset) {
  var table_name, fields, formula;
  table_name = 'OM';
  fields = ['STATUS 1', 'Import Date'].concat(FIELDS);
  formula = "{STATUS 1} = 'Published'";
  return fetch.airtable({table_name : table_name, fields : fields, formula : formula, offset : offset});
};

//::IO()->Either Error Hashmap
fetch.om = function(offset) {
  var url, table_name, options, res, h, result_map, fn, field, formula, fields, fields_str;
  //formula = "AND(LEFT({Import Date}, 4) = '2021', {STATUS 1} = 'Published')";
  formula = "{STATUS 1} = 'Published'";
  table_name = 'OM';
  fields = ['STATUS 1', 'Import Date'].concat(FIELDS);
  fields_str = fields.map(function(field) {return encodeURI('fields[]=' + field);}).join('&');
  url = [AIRTALBE_ENDPOINT, DATABASE_ID, table_name].join('/') + '?' + fields_str + '&filterByFormula=' + encodeURI(formula);
  if (offset) {url += '&offset=' + offset;}
  options =  {method : 'get', headers : HEADERS, muteHttpExceptions : true};
  fn = function(s) {return JSON.parse(s);};
  res = http_req({url : url, options : options, fn : fn});
  return res;
};

//:: IO () -> Either Error Hashmap
fetch.clients_map = function() {
  var url, table_name, options, res, h, result_map, fn;
  table_name = 'CLIENTS';
  url = [AIRTALBE_ENDPOINT, DATABASE_ID, table_name].join('/') + '?fields=Client&fields=STATUS';
  options =  {method : 'get', headers : HEADERS};
  fn = function(s) {return JSON.parse(s);};
  res = http_req({url : url, options : options, fn : fn});
  if (res.right) {
    result_map = {};
    res.right.records.forEach(function(x) {
      var client_name;
      client_name = x['fields']['Client'];
      if (x['fields']['STATUS'] == 'ACTIVE') {
        result_map[client_name] = x['id'];
      };
    });
    return {right : result_map};
  } else {
    return res;
  }
};
