function render_module_tests() {
  return test_clients_ls_report();
}

function test_clients_ls_report() {
  return jUnit.test_case('', {
    'test rendering clients link status report' : function() {
      var m, res;
      m = [];
      res = render.clients_ls_report('TestName', m);
      jUnit.assert_true(/No records/.test(res));

      m  = tt.ds('0.19').getDataRange().getValues();
      res = render.clients_ls_report('TestName', m);
      jUnit.assert_true(/style/.test(res));
      jUnit.assert_true(/groupTitle/.test(res));
    }
  });
}