function transform_module_tests() {
  return test_transform_to_workbook_record();
}

function test_transform_to_workbook_record() {
  return jUnit.test_case('', {
    'test transforming record from airtable to workbooks record' : function() {
      var xs, res;
      xs = ssa.get_vh(tt.ds('0.4'));
      res = transform.to_workbook_record(xs[0]);
      jUnit.assert_eq_num(15, keys(res).length);
      jUnit.assert_eq(2021, res['Year']);
      jUnit.assert_eq(1, res['Month']);
      jUnit.assert_eq_num(25, res['Day']);
    }
  });
}