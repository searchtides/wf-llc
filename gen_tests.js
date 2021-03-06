function gen_module_tests() {
  return test_gen_qa_report() &&
    test_gen_daily_map() &&
    test_gen_qa_map() &&
    test_gen_map_for_clients_ls_report() &&
    test_gen_domains_clients_count_map();
}

function test_gen_clients_status_map() {
  return jUnit.test_case('', {
    'test generating clients status map' : function() {
      var h, res;
      h = read_map('https://drive.google.com/file/d/1fsdcpIBe1HSJ5QO1G6iEBvZNU6mmS8Wl/view?usp=sharing');
      res = gen.clients_status_map(h);
      jUnit.assert_eq_num(32, _.keys(res).length);
      jUnit.assert_eq('ACTIVE', res['creative metal']['VENDORS']);
      jUnit.assert_eq('ACTIVE', res['creative metal']['LBT']);
    }
  });
}

function test_gen_domains_clients_count_map() {
  return jUnit.test_case('', {
    'test generating domains count map by client' : function() {
      var xs, map, res, i, prev, cur, date, status, prev_day;
      xs = ssa.get_vh(tt.ds('0.4'));
      res = gen.domains_clients_count_map(xs);
      jUnit.assert_eq_num(2, res['playersstats.com']['fanduel']);
    }
  });
}

function test_gen_map_for_clients_ls_report() {
  return jUnit.test_case('', {
    'test generating matrix for clients links status report' : function() {
      var xs, map, res, i, prev, cur, date, status, prev_day;
      xs = ssa.get_vh(tt.ds('0.15'));
      map = group.by_client(xs);
      date = new Date('2021/06/01');
      res = gen.map_for_clients_ls_report(map['FanDuel'], date);
      jUnit.assert_eq_num(4, keys(res).length);
    }
  });
}

function test_gen_qa_report() {
  return jUnit.test_case('', {
    'test generating quality report' : function() {
      var xs, qa_map, res;
      xs = ssa.get_vh(tt.ds('0.14'));
      qa_map = gen.qa_map(xs);
      res = gen.qa_report(qa_map,'2021-03-23');
      jUnit.assert_true(res == 'Previous day is missing in the QA map');
      res = gen.qa_report(qa_map,'2021-03-31');
      jUnit.assert_true(res.indexOf('superscript neutral') == 232);
    }
  });
}

function test_gen_qa_days_diff() {
  return jUnit.test_case('', {
    'test generating quality diff between days' : function() {
      var xs, qa_map, res;
      xs = ssa.get_vh(tt.ds('0.14'));
      qa_map = gen.qa_map(xs);
      res = gen.qa_days_diff(qa_map,'2021-03-31','2021-04-02');
      jUnit.assert_eq_num(9, res.om.invalid);
      res = gen.qa_days_diff(qa_map,'2021-03-24','2021-04-02');
      jUnit.assert_true(-379 == Number(res.archive.valid));
    }
  });
}

function test_gen_qa_map() {
  return jUnit.test_case('', {
    'test generating quality assuarance map' : function() {
      var xs, res;
      xs = ssa.get_vh(tt.ds('0.14'));
      res = gen.qa_map(xs);
      jUnit.assert_eq_num(586, res['2021-03-24'].om.valid);
      jUnit.assert_eq_num(586, res['2021-04-02'].om.valid);
      jUnit.assert_eq_num(119, res['2021-03-24'].om.invalid);
      jUnit.assert_eq_num(157, res['2021-04-02'].om.invalid);
    }
  });
}

function test_gen_daily_map() {
  return jUnit.test_case('', {
    'test generating daily map' : function() {
      var xs, res;
      xs = ssa.get_vh(tt.ds('0.15'));
      res = gen.daily_map(xs);
      jUnit.assert_eq_num(13, res['2021-01-04'].length);
    }
  });
}
