function onOpen() {
  var submenu = [
    {name : "Install trigger", functionName : "install_triggers"},
    {name : "Manual run", functionName : "manual_run"},
  ];
  SpreadsheetApp.getActiveSpreadsheet().addMenu('More actions', submenu);
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