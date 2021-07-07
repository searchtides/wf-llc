function main_test() {
  return jUnit.test_case('General test', {
    'test gen module' : function() {
      jUnit.assert('gen tests must be passed',gen_module_tests());
    }
  });
}