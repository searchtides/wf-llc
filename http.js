//::{url: String, options: GUrlFetchAppOptions, f: Function}->IO Either Error String
function http_req(x) {
  var res, res_code, fn;
  try {
    res = UrlFetchApp.fetch(x.url, x.options);
    res_code = res.getResponseCode();
    if (res_code == 200) {
      if (x.fn == undefined) {fn = function(x) {return x;};} else {fn = x.fn;}
      return {right : fn(res.getContentText())};
    }
    else {
      clog(res.getContentText());
      return {left : 'Bad response code ' + res_code};
    }
  } catch (e) {
    return {left : 'UrlFetchApp.fetch error ' + e.message};
  }
}