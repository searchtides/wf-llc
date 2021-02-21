function get_module_tests() {
  return test_get_cm_map() &&
      test_get_clients_map();
}

function test_get_om_table() {
  return jUnit.test_case('', {
    'test getting om table' : function() {
      var res;
      res = get.om_table();
      jUnit.assert_true(res.right);
    }
  });
}

function test_get_clients_map() {
  return jUnit.test_case('', {
    'test getting clients map' : function() {
      var res;
      res = get.clients_map();
      jUnit.assert_true(res.right);
    }
  });
}

function test_get_cm_map() {
  return jUnit.test_case('', {
    'test getting cm map' : function() {
      var res;
      res = get.cm_map();
      jUnit.assert_true(res.right);
    }
  });
}