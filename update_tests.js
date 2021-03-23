function update_module_tests() {
  return test_update_aggregated_data;
}

function test_update_workbooks() {
  return jUnit.test_case('', {
    'test updating workbooks' : function() {
      var w_map, res;
      w_map = get.workbooks_map(tt.ds('0.5'));
      jUnit.assert_eq_num(1, keys(w_map).length);
      update.workbooks(w_map);
    }
  });
}

function test_update_aggregated_data () {
  return jUnit.test_case('', {
    'test updating aggregated data' : function() {
      update.aggregated_data();
    }
  });
}