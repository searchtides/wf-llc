function gen_module_tests() {
  return test_gen_qa_report() &&
    test_gen_daily_map() &&
    test_gen_qa_map();
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
