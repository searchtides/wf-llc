var mp = {};

//[Hashmap]->[String]->[[a]]
mp.vh_to_m = function(vh, headers) {
  var matrix;
  matrix = [];
  vh.forEach(function(h) {
    var keys, row;
    keys = Object.keys(h);
    row = [];
    headers.forEach(function(header) {
      if (~keys.indexOf(header)) {
        row.push(h[header]);
      } else {
        row.push('');
      }
    });
    matrix.push(row);
  });
  return matrix;
};

//[[a]]->[String]->[Hashmap]
mp.m_to_vh = function(m, headers) {
  //output: vector of hashtables (v_of_h) where keys of the hashes is columns headers
  var v_of_h;
  v_of_h = [];
  m.forEach(function(r) {
    var h;
    h = {};
    headers.forEach(function(item, j) {
      h[item] = r[j];
    });
    v_of_h.push(h);
  });
  return v_of_h;
};
