function start_checking_iterations() {
  //set evironment vairables if necessary
  //logging
  log("first checking iteration started", 1);
  checking_status_iteration();
}

function checking_status_iteration() {
  var vh, xs, ys, sheet, idx_start, i, h, batch, x, TIME_LIMIT, timeout, t1, t2, diff, config;
  config = get.config();
  TIME_LIMIT = config.iteration_limit * 60 * 1000; //ms
  remove_trigger("checking_status_iteration");
  sheet = get.sheet("checklist");
  vh = ssa.get_vh(sheet);
  xs = takeWhile(function (x) {
    return !empty(x["Link Status"]);
  }, vh);
  idx_start = xs.length;
  ys = vh.slice(idx_start, vh.length);
  if (ys.length == 0) {
    //all statuses gathered
    finish_iterations(vh.length);
  } else {
    t1 = new Date().getTime();
    i = 0;
    do {
      h = ys[i];
      batch = extract.check_options(h);
      var t = new Date();
      x = measure(get.status, [batch]);
      vh[idx_start + i]["Link Status"] = x.res; //!!!!!!!MUTATING INPUT ARRAY
      i++;
      t2 = new Date().getTime();
      diff = t2 - t1;
      timeout = diff >= TIME_LIMIT;
    } while (!timeout && i < ys.length);
  }
  ssa.put_vh(sheet, vh);
  if (timeout) {
    log(
      i +
        " records checked in " +
        format_num(diff) +
        "ms. Casting next checking iteration",
      1
    );
    ScriptApp.newTrigger("checking_status_iteration")
      .timeBased()
      .after(1000)
      .create();
  } else {
    finish_iterations(vh.length);
  }
}

function finish_iterations(n) {
  var checked, vh, config, sheet, filter;
  config = get.config();
  log("all " + n + " links have been checked", 1);
  vh = get.vh("checklist");
  sheet = get.sheet("list checked");
  //next two lines is precaution to avoid issue https://issuetracker.google.com/issues/111316666
  filter = sheet.getFilter();
  if (filter) filter.remove();
  ssa.put_vh(sheet, vh);
  refresh_records_in_groups();
  send.link_statuses_report(J_I(new Date()), vh, config.report_to);
  update.workbooks(null, vh);
  send_ls_reports(vh);
}

function send_ls_reports(vh) {
  var xs, map, day, config, html;
  config = get.config();
  day = J_I(new Date());
  vh = vh || get.vh("list checked");
  map = group.by_client(vh);
  html = render.pivot_ls_report(map);
  try {
    send.pivot_ls_report(day, html, config.report_to);
  } catch (e) {
    log(e.message);
  }
  xs = get.clients_emails(get.sheet("workbooks map"));
  xs.forEach(function (x) {
    var html, m;
    m = gen.m_for_clients_ls_report(map[x.client]);
    html = render.clients_ls_report(x.client, m);
    try {
      send.clients_ls_report(day, html, x.client, x.email);
    } catch (e) {
      log(e.message);
    }
  });
}
