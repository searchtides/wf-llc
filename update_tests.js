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

function test_update_special() {
  return jUnit.test_case('', {
    'test gentle data updating' : function() {
      var source_sheet, delta, short_invalid;
      source_sheet = tt.ds('0.8');
      short_invalid = ssa.get_vh(tt.ds('0.9'));
      delta = vh_to_hh(short_invalid, 'id');
      clog(keys(delta));
      update.special(source_sheet, delta);
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