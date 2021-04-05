var send = {};

send.link_statuses_report = function(xs, recepients) {
  var g_map, htmlBody, options, subject;
  subject = 'Links statuses report on ';
  //time for last checked link?
  g_map = get.statuses_stats(xs);
  htmlBody = gen.ls_report(g_map);
  options = {to : recepients, subject : subject, htmlBody : htmlBody};
  MailApp.sendEmail(options);
};

send.qa_report = function(sheet, day, recepients) {
  var xs, qa_map, res, subject, options;
  xs = ssa.get_vh(sheet);
  qa_map = gen.qa_map(xs);
  res = gen.qa_report(qa_map, day);
  subject =  'OM records validation result for ' + day;
  options = {to : recepients, subject : subject, htmlBody : res};
  MailApp.sendEmail(options);
};

send.new_records_report = function(day, vh, recipients) {
  var body, subject, m, headers;
  if (vh) {
    headers = ['Client', 'Live Article URL', 'Anchor Text', 'Target URL'];
    m = mp.vh_to_m(vh, headers);
    m.unshift(headers);
    body = gen.html_table(m);
    subject = 'New links on ' + day;
  } else {
    subject = 'No new links on ' + day;
    body = '';
  }
  MailApp.sendEmail({to : recipients, subject : subject, htmlBody : body});
};
