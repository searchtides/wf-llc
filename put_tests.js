function test_put_clients_statuses() {
  return jUnit.test_case('', {
    'test saving clients statuses on tab' : function() {
      var h, res;
      //read clients_status_map.json from testsdata
      h = read_map('https://drive.google.com/file/d/1KEPuFIE-RqycBEZEgyQkJd6E80eNA78X/view?usp=sharing');
      put.client_statuses(tt.tb('0.4'), h);
    }
  });
}