function update_module_tests() {
  return test_update_aggregated_data;
}

function test_update_hidden() {
  return jUnit.test_case('', {
    'test updating hidden' : function() {
      var sheet, dest_sheet, date, period, xs;
      date = new Date('2022/04/26');
      sheet = tt.ds('0.21');
      dest_sheet = tt.tb('0.3');
      update.hidden(sheet, date, 7, dest_sheet);
      xs = ssa.get_vh(dest_sheet);
      jUnit.assert_eq_num(2, xs.length);
    }
  });
}

function test_update_workbooks() {
  return jUnit.test_case('', {
    'test updating workbooks' : function() {
      var w_map, res, checked;
      checked = ssa.get_vh(tt.ds('0.12'));
      jUnit.assert_eq('TVG', checked[0]['Client']);
      jUnit.assert_eq('TVG', checked[checked.length - 1]['Client']);
      w_map = get.workbooks_map(tt.ds('0.5'));
      jUnit.assert_eq_num(1, keys(w_map).length);
      update.workbooks(w_map, checked);
    }
  });
}

function test_update_aggregated_data () {
  return jUnit.test_case('', {
    'test updating aggregated data' : function() {
      var res;
      res = update.aggregated_data();
      jUnit.assert_true(keys(res).length == 1);
    }
  });
}