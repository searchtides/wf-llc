//sp - Script Properties module
(function () {
  var get, set, link, remove;

  remove = function(name, obj) {
    if (!obj) {obj = link();}
    obj.deleteProperty(name);
  };

  link = function() {
    return PropertiesService.getScriptProperties();
  };

  set = function(name, value, obj) {
    if (!obj) {obj = link();}
    obj.setProperty(name, value);
  };

  get = function (name, obj) {
    var value;
    if (!obj) {obj = link();}
    value = obj.getProperty(name);
    if (value == undefined) {
      value = '';
      obj.setProperty(name, value);
    }
    return value;
  };

  sp = {};
  sp.remove = remove;
  sp.link = link;
  sp.get = get;
  sp.set = set;

})();