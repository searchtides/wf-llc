function render_module_tests() {
  return test_clients_ls_report() &&
    test_clients_pivot_ls_report();
}

function test_clients_pivot_ls_report() {
  return jUnit.test_case('', {
    'test rendering clients link status report' : function() {
      var xs, map, res, date;
      xs = ssa.get_vh(tt.ds('0.15'));
      map = group.by_client(xs);
      date = new Date('2021/06/01');
      res = render.pivot_ls_report(map, date);
      DriveApp.createFile('pivot.html', res, 'text/html');
      jUnit.assert_true(/style/.test(res));
      jUnit.assert_true(/groupTitle/.test(res));
      jUnit.assert_true(/name/.test(res));
      jUnit.assert_true(/FanDuel/.test(res));
    }
  });
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