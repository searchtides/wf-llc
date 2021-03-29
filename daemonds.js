function daily() {
  var res, d, daily_map, yesterday, config;
  config = get.config();
  yesterday = J_I(dnt.add_days(new Date(), -1));
  res = update.aggregated_data();
  if (res.right) {
    log(res.right + ' records fetched from Airtable', 1);
  } else {
    log(res.left, 1);
  }
  //data collected and stored on tab
  d = validate_master_data();// will be the same all time until aggregated data updated
  collect_archives();// may bring different R
  //q matrix formed
  send_report();
  add_data_quality_snapshot();
  daily_map = gen.daily_map(d.valid.map(transform.to_workbook_record));
  //TODO reduce valid set to last week or several days
  send.new_records_report(yesterday, daily_map[yesterday], config.report_to);
  log('report about new records for ' + yesterday + ' sent', 1);
  create_checklist();//this guy creates new bunch of record to check, so previous state will be lost
  //TODO - run status checker trough all checklist with conituantions
  //legacy workflow below
  update.workbooks(null, d.valid);
}
