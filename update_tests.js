function update_module_tests() {
  return ;
}

function test_update_aggregated_data () {
  return jUnit.test_case('', {
    'test updating aggregated data' : function() {
      update.aggregated_data();
    }
  });
}