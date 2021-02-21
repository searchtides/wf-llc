var apply = {};

apply.formats = function(sheet, startRow, startCol, m) {
  m.forEach(function(r, y) {
    r.forEach(function(h, x) {
      var cell;
      cell = sheet.getRange(startRow + y, startCol + x);
      for (var p in m[y][x]) {
        cell['set' + p](m[y][x][p]);
      }
    });
  });
};