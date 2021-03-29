var send = {};

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