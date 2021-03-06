function get_module_tests() {
  return test_get_cm_map() &&
      test_get_clients_map() &&
      test_get_status() &&
      test_get_teams_map() &&
      test_get_dup_map() &&
      test_get_dbs_map() &&
      test_get_clients_emails() &&
      test_get_hidden() &&
      test_get_fields_map();
}

function test_get_clients_statuses() {
  return jUnit.test_case('', {
    'test getting clients statuses' : function() {
      var res;
      res = get.clients_statuses(tt.ds('0.23'));
      jUnit.assert_eq('Internal', res['additional fanduel']['CMS MASTER']);
      jUnit.assert_eq('ACTIVE', res['tvg']['VENDORS']);
    }
  });
}

function test_get_fields_map() {
  return jUnit.test_case('', {
    'test getting fields map' : function() {
      var res, config;
      res = get.fields_map(tt.ds('0.22'));
      jUnit.assert_eq_num(2, _.keys(res).length);
      jUnit.assert_eq_num(2, _.keys(res.orm).length);
      jUnit.assert_eq_num(2, _.keys(res.regular).length);
    }
  });
}

function test_get_hidden() {
  return jUnit.test_case('', {
    'test getting hidden' : function() {
      var res, sheet, date, period;
      date = new Date('2022/04/26');
      sheet = tt.ds('0.21');
      res = get.hidden(sheet, date, 1);
      jUnit.assert_eq_num(0, res.length);
      res = get.hidden(sheet, date, 6);
      jUnit.assert_eq_num(1, res.length);
      res = get.hidden(sheet, date, 7);
      jUnit.assert_eq_num(2, res.length);
      res = get.hidden(sheet, date, 10);
      jUnit.assert_eq_num(5, res.length);
    }
  });
}

function test_get_clients_emails() {
  return jUnit.test_case('', {
    'test getting clients email' : function() {
      var res, config;
      res = get.clients_emails(tt.ds('0.20'));
      jUnit.assert_eq('yuriykochetkov@gmail.com', res[0].email);
    }
  });
}

function test_get_data_from_db() {
  return jUnit.test_case('', {
    'test getting data from db' : function() {
      var res, config, db_id, xs;
      config = get.config();
      db_id = 'appVgRlu9Y3PLSSqx';
      res = get.data_from_db(config, db_id);
      jUnit.assert_true(def(res.right));
    }
  });
}

function test_get_dbs_map() {
  return jUnit.test_case('', {
    'test getting database map' : function() {
      var sheet, res;
      sheet = tt.ds('0.17');
      res = get.dbs_map(sheet);
      jUnit.assert_eq_num(2, keys(res).length);
      jUnit.assert_eq('Searchtides', res['appITyYZgPYYMkPMg'].name);
      jUnit.assert_eq('ST2.0', res['appVgRlu9Y3PLSSqx'].name);
    }
  });
}

function test_get_statuses_stats() {
  return jUnit.test_case('', {
    'test getting statistics for statuses' : function() {
      var checklist, res;
      checklist = ssa.get_vh(tt.ds('0.15'));
      res = get.statuses_stats(checklist);
      jUnit.assert_eq_num(1979, res.green);
      jUnit.assert_eq_num(34, res.with_defects);
      jUnit.assert_eq_num(105, res.unreachable);
      jUnit.assert_eq_num(131, res.dead);
      jUnit.assert_eq_num(270, res.non_green);
      jUnit.assert_true(res.non_green == res.dead + res.with_defects + res.unreachable);
    }
  });
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
      var res, config;
      config = get.config();
      res = get.teams_map({config : config}).right;
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
      var res, config, a;
      config = get.config();
      a = {config : _.extend({}, config, {database_id : 'appVgRlu9Y3PLSSqx'})};
      res = get.om_table(a);
      jUnit.assert_true(res.right);
    }
  });
}

function test_get_clients_map() {
  return jUnit.test_case('', {
    'test getting clients map' : function() {
      var res, config;
      config = get.config();
      res = get.clients_map({config : config});
      jUnit.assert_true(res.right);
    }
  });
}

function test_get_cm_map() {
  return jUnit.test_case('', {
    'test getting cm map' : function() {
      var res, config;
      config = get.config();
      config['database_id'] = 'appITyYZgPYYMkPMg';
      res = get.cm_map({config : config});
      jUnit.assert_true(res.right);
    }
  });
}