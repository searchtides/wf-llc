function send_module_tests() {
  return;
}

function test_send_link_statuses_report() {
  return jUnit.test_case('', {
    'test sending link statuses report' : function() {
      var sheet, day, xs;
      sheet = tt.ds('0.15');
      xs = ssa.get_vh(sheet);
      day = '2021-04-05';
      send.link_statuses_report(day, xs,  'yuriy@searchtides.com');
    }
  });
}

function test_send_qa_report() {
  return jUnit.test_case('', {
    'test sending qa report' : function() {
      var sheet, day;
      sheet = tt.ds('0.16');
      day = '2021-03-31';
      send.qa_report(sheet, day,  'yuriy@searchtides.com', 5, 30);
    }
  });
}

function test_send_new_records_report() {
  return jUnit.test_case('', {
    'test sending reports with new records ' : function() {
      var xs, daily_map, day;
      xs = ssa.get_vh(tt.ds('0.7')).map(transform.to_workbook_record);
      daily_map = gen.daily_map(xs);
      day = '2021-04-07';
      send.new_records_report(day, daily_map[day], 'yuriy@searchtides.com');

      xs = ssa.get_vh(tt.ds('0.7')).map(transform.to_workbook_record);
      daily_map = gen.daily_map(xs);
      day = '2021-02-24';
      send.new_records_report(day, daily_map[day], 'yuriy@searchtides.com');
    }
  });
}
