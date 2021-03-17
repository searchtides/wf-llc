function normalize_module_tests() {
  return test_normalize_archive();
}

function test_normalize_archive() {
  return jUnit.test_case('', {
    'test normalizing archive' : function() {
      var archive, res;
      archive = ssa.get_vh(tt.ds('0.6'));
      jUnit.assert_eq_num(521, archive.length);
      res = normalize.archive(archive);
      jUnit.assert_eq_num(521, res.length);
      ssa.put_vh(tt.tb('0.1'), res);

    }
  });
}