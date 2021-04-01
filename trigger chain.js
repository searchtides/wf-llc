function start_checking_iterations() {
  //set evironment vairables if necessary
  //logging
  log('first checking iteration started', 1);
  checking_status_iteration();
}

function checking_status_iteration() {
  var vh, xs, ys, sheet, idx_start, elapsed, B_SIZE, t_diff, processed, i, h, batch, x, TIME_LIMIT, timeout,
  check_log_sheet;
  check_log_sheet = get.sheet('check log');
  TIME_LIMIT = 25*60*1000;//ms
  remove_trigger('checking_status_iteration');
  sheet = get.sheet('checklist');
  vh = ssa.get_vh(sheet);
  xs = takeWhile(function(x){return !empty(x['Link Status']);}, vh);
  idx_start = xs.length;
  ys = vh.slice(idx_start, vh.length);
  elapsed = 0;
  if (ys.length == 0) {
    //all statuses gathered
    finish_iterations(vh.length);
  } else {
    var statuses = [];
    i=0;
    do {
      h = ys[i];
      batch = extract.check_options(h);
      var t = new Date();
      x = measure(get.status, [batch]);
      elapsed += x.time;
      vh[idx_start + i]['Link Status'] = x.res;//!!!!!!!MUTATING INPUT ARRAY
      check_log_sheet.appendRow([t, h['Client'], x.time, x.res, batch.url, batch.anchor, batch.target_link]);
      i++;
      timeout = elapsed >= TIME_LIMIT
    } while(!timeout && i < ys.length);
  }
  ssa.put_vh(sheet, vh);
  if (timeout) {
   log(i + ' records checked. Casting next checking iteration', 1);
   ScriptApp.newTrigger('checking_status_iteration').timeBased().after(1000).create()
  } else {
    finish_iterations(vh.length);
  }
}

function finish_iterations(n) {
  var checked, vh;
  log('all ' + n + ' links have been checked', 1);
  vh = get.vh('checklist');
  ssa.put_vh(get.sheet('list checked'), vh);
  update.workbooks(null, vh);
}