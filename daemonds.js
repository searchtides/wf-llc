function daily() {
  var res, normalized;
  res = update.aggregated_data();
  if (res.right) {
    log(res.right + ' records fetched from Airtable', 1);
  } else {
    log(res.left, 1);
  }
  //data collected and stored on tab
  validate_master_data();// will be the same all time until aggregated data updated
  collect_archives();// may bring different R
  //q matrix formed
  send_report();
  add_data_quality_snapshot();
  create_checklist();//this guy creates new bunch of record to check, so previous state will be lost
  //TODO - run status checker trough all checklist with conituantions
  //legacy workflow below
  normalized = normalize_valid();
  update.workbooks(null, normalized);
}
