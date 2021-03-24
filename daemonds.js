function daily() {
  var res, normalized;
  res = update.aggregated_data();
  if (res.right) {
    log(res.right + ' records fetched from Airtable', 1);
  } else {
    log(res.left, 1);
  }
  validate_master_data();
  send_report();
  normalized = normalize_valid();
  update.workbooks(null, normalized);
}
