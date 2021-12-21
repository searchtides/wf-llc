function group_module_tests() {
  return test_group_by_client();
}

function test_group_by_client() {
  return jUnit.test_case('', {
    'test grouping workbooks records by client' : function() {
      var xs, res;
      xs = ssa.get_vh(tt.ds('0.15'));
      res = group.by_client(xs);
      jUnit.assert_eq_num(10, keys(res).length);
      jUnit.assert_eq_num(902, res['FanDuel'].length);
      jUnit.assert_eq_num(70, res['Eligo'].length);
      jUnit.assert_eq_num(556, res['CreditNinja'].length);
      jUnit.assert_eq_num(109, res['Sundae'].length);
      jUnit.assert_eq_num(67, res['BuzzRx'].length);
      jUnit.assert_eq_num(447, res['TVG'].length);
      jUnit.assert_eq_num(66, res['Itshot'].length);
      jUnit.assert_eq_num(23, res['BarBend'].length);
      jUnit.assert_eq_num(1, res['ShieldCo'].length);
      jUnit.assert_eq_num(8, res['MuckRack'].length);
    }
  });
}
