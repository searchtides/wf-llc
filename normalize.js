var normalize = {};

normalize.archive = function(archive) {
  return archive.map(function(ar) {
    if (ar['Follow/NoFollow'] == 'F') {ar['Follow/NoFollow'] = 'Do-Follow';}
    if (ar['Follow/NoFollow'] == 'NF') {ar['Follow/NoFollow'] = 'No-Follow';}
    var month;
    if (ar['Month']) {
      if (_.isString(ar['Month'])) {
        month = MONTHS_SHORT.indexOf(ar['Month']) + 1;
      } else {
        month = ar['Month'];
      }
      ar['Month'] = month;
    }
    jUnit.assert_true(_.isNumber(month) && month >= 1 && month <= 12);
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Баррикады!!!////Баррикады!!!//Баррикады!!!//Баррикады!!!//Баррикады!!!//Баррикады!!!//Баррикады!!!//Баррикады!!!
    return ar;
  });
};