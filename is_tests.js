function is_module_tests() {
  return test_is_link_present();
}

function test_is_link_present() {
  return jUnit.test_case('', {
    'test checking if link present in html' : function() {
      var url, id, html, res, h;
      url = 'https://drive.google.com/file/d/11QkQpzVRKkb32bp36See4sg6wLY0KusX/view?usp=sharing';
      id = url.split('/')[5];
      html = DriveApp.getFileById(id).getBlob().getDataAsString();
      h = {html : html, anchor : 'https://www.fanduel.com/super-bowl-betting/', link : 'https://www.fanduel.com/super-bowl-betting'};
      res = is.link_present(h);
      jUnit.assert_false(res);
    }
  });
}