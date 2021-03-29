function gen_module_tests() {
  return test_gen_daily_map();
}

function test_gen_daily_map() {
  return jUnit.test_case('', {
    'test generating daily map' : function() {
      var xs, res;
      xs = ssa.get_vh(tt.ds('0.7'));
      res = gen.daily_map(xs);
      jUnit.assert_eq_num(7, res['2021-01-04'].length);
    }
  });
}
