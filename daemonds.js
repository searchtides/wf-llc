function daily() {
  var res;
  res = update.aggregated_data();
  if (res.right) {
    log(res.right + ' records fetched from Airtable', 1);
  } else {
    log(res.left, 1);
  }
  validate_master_data();
  normalize_valid();
  update.workbooks();
}
