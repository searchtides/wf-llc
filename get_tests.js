function get_module_tests() {
  return test_get_cm_map() &&
      test_get_clients_map() &&
      test_get_status() &&
      test_get_teams_map() &&
      test_get_dup_map();
}

function test_get_dup_map() {
  return jUnit.test_case('', {
    'test getting dup map' : function() {
      var checklist, res;
      checklist = ssa.get_vh(tt.ds('0.11'));
      res = get.dup_map(checklist);
      jUnit.assert_eq_num(379, keys(res).length);
    }
  });
}

function test_get_teams_map() {
  return jUnit.test_case('', {
    'test getting teams map' : function() {
      var res;
      res = get.teams_map().right;
      jUnit.assert_true(res);
    }
  });
}

function test_get_status() {
  return jUnit.test_case('', {
    'test getting status' : function() {
      var batch, res, checklist, h, clause;
      checklist = ssa.get_vh(tt.ds('0.9'));
      h = checklist[0];
      batch = {anchor : h['Anchor Text'], target_link : h['Target URL'], url : h['Live Article URL']};
      res = get.status(batch);
      clause = ['LIVE', 'LIVE, BUT CORRUPTED ANCHOR', 'NOT LIVE', 'UNABLE TO CRAWL'].indexOf(res) > -1;
    }
  });
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