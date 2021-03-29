function send_module_tests() {
  return;
}

function test_send_new_records_report() {
  return jUnit.test_case('', {
    'test sending reports with new records ' : function() {
      var xs, daily_map, day;
      xs = ssa.get_vh(tt.ds('0.7')).map(transform.to_workbook_record);
      daily_map = gen.daily_map(xs);
      day = '2021-02-24';
      send.new_records_report(day, daily_map[day], 'yuriy@searchtides.com');
    }
  });
}