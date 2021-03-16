//crop module v0.1 by yyk@mail.ru
var crop = {};

crop.sheets = function() {
  var sheets;
  sheets = SpreadsheetApp.getActive().getSheets();
  sheets.forEach(function(sheet) {
    crop.sheet(sheet);
  });
};

crop.sheet = function(sheet, width, hight) {
  var max_w, max_h, w, h;
  max_w = sheet.getMaxColumns();
  max_h = sheet.getMaxRows();
  if (!width) {width = sheet.getLastColumn();}
  if (!hight) {hight = sheet.getLastRow();}
  w = max_w - width;h = max_h - hight;
  if (w) {
    if (width == 0 && max_w > 1) {
      sheet.deleteColumns(width + 2 , w - 1);
    }
    else if (width !== 0) {
      sheet.deleteColumns(width + 1 , w);
    }
  }
  if (h) {
    if (hight == 0 && max_h > 1) {
      sheet.deleteRows(hight + 2, h - 1);
    }
    else if (hight !== 0) {
      sheet.deleteRows(hight + 1, h);
    }
  }
};
//crop module v0.1 by yyk@mail.ru