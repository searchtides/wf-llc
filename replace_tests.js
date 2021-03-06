function replace_module_tests() {
  return test_replace_ids_with_values() &&
    test_replace_fields();
}

function test_replace_fields() {
  return jUnit.test_case('', {
    'test replacing fields' : function() {
      var res, h, fields_map;
      h = {a : 1, b : 2, c : 3};
      fields_map = {'a' : 'A', 'b' : 'B', 'c' : 'C'};
      res = replace.fields(h, fields_map);
      jUnit.assert_eq_num(1, res['A']);

      fields_map = {'b' : 'B', 'c' : 'C'};
      res = replace.fields(h, fields_map);
      jUnit.assert_true(ndef(res['A']));
    }
  });
}

function test_replace_ids_with_values() {
  return jUnit.test_case('', {
    'test replacing ids_with_values' : function() {
      var cm_map, clients_map, xs, res;
      cm_map = vh_to_h(ssa.get_vh(tt.ds('0.2')), 'id', '🔹ARTICLE TITLE');
      clients_map = vh_to_h(ssa.get_vh(tt.ds('0.3')), 'id', 'Client');
      xs = ssa.get_vh(tt.ds('0.1'));
      res = replace.ids_with_values(xs, cm_map, clients_map, {});
      jUnit.assert_eq('FanDuel', res[1]['CLIENT*']);
      jUnit.assert_eq('Pointers for Super Bowl Futures Betting This 2021', res[1]['CM']);
    }
  });
}