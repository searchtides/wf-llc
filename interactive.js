function onOpen() {
  var submenu = [
    {name : "Add details to 'not live'", functionName : "recheck_not_live"},
    {name : "Add details to 'anchor defect'", functionName : "recheck_defect_anchor"},
    {name : "Install trigger", functionName : "install_triggers"},
    {name : "Manual run", functionName : "manual_run"}
  ];
  SpreadsheetApp.getActiveSpreadsheet().addMenu('More actions', submenu);
}

function recheck_defect_anchor() {
  add_details(get.sheet('anchor defect'), LINK_STATUSES[1]);
}

function recheck_not_live() {
  add_details(get.sheet('not live'), LINK_STATUSES[2]);
}
function add_details(sheet, status) {
  var vh, xs, ys;
  vh = ssa.get_vh(sheet);
  log(vh.length + ' in the roster', 1);
  xs = vh.map(function(h) {
    var link, anchor, target_link, html, banch, status;
    link = h['Live Article URL'];
    anchor = h['Anchor Text'];
    target_link = h['Target URL'];
    h['Anchor presense'] = '';
    h['Target URL presense'] = '';
    h['Wrapped anchor presense'] = '';
    try {
      var resp;
      resp = UrlFetchApp.fetch(link);
      h['Response code'] = resp.getResponseCode();
      html = resp.getContentText().replace(new RegExp("\n", 'g'), ' ');
      banch = {link : target_link,  anchor : anchor,  html : html};
      h['Anchor presense'] = is.anchor_present(banch);
      h['Target URL presense'] = is.link_present(banch);
      h['Wrapped anchor presense'] = is.anchor_wrapped_in_atag(banch);
      if (h['Anchor presense'] && h['Target URL presense'] && h['Wrapped anchor presense'] ) {
        //it must be LIVE!
        h['Link Status'] = LINK_STATUSES[0];
      } else if (h['Target URL presense'] && !h['Wrapped anchor presense']) {
        h['Link Status'] = LINK_STATUSES[1];
      } else {
        h['Link Status'] = LINK_STATUSES[2];
      }
    } catch (e) {
      h['Link Status'] = LINK_STATUSES[3];
    }
    return h;
  });
  ys = xs.filter(function(x) {return x['Link Status'] == status;});
  log(ys.length + ' not live left', 1);
  ssa.put_vh(sheet, ys);
  crop.sheet(sheet);
}

function manual_run() {
  daily();
}

function install_triggers() {
  var ss;
  remove_triggers();
  ss = SpreadsheetApp.getActive();
  ScriptApp.newTrigger(TIME_DAEMON).timeBased().everyMinutes(1).create();
  Browser.msgBox('All triggers have been installed under ' + Session.getActiveUser() + ' account');
}

function remove_triggers() {
  var triggers;
  triggers =  ScriptApp.getProjectTriggers();
  triggers.forEach(function(element) {
    ScriptApp.deleteTrigger(element);
  });
}