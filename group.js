var group = {};

//::[WorkbookRecord]->{<Client>:[WorkbookRecord]}
group.by_client = function(xs) {
  var res;
  res = {};
  xs.forEach(function(x) {
    blow(res, x['Client'], []);
    res[x['Client']].push(x);
  });
  return res;
};
