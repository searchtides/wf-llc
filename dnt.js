//version: 3.3.2
//author: yyk@mail.ru
//2019-02-16 19:00:39 2.3.2 - dnt.to_utc and dnt.to_iso8601 added
//2018-10-11 00:46:50 v2.3 - translation from js date to ISO8601 string added
//2018-09-03 00:21:20 v2.2 - last and first day of year added
//2018-08-16 16:00:00 v2.1 - new category U and morphisms to them
//2018-08-11 03:13:27 v2.0 - aliases for category transformations I_J, I_D etc
//2018-08-09 03:21:19 v1.9 doe->iso8601 fixed
//2018-05-15 17:29:27 v1.8 - add_minutes implemented
//2018-03-02 21:45:21 v1.7 - era features added
//2017-12-26 19:28:18 $ sign added as a sysnonim for dnt.to_iso8601

//dependences: utils
//data SimpleTime //example '10:00'
//data DoE = Integer
//data Woe = Integer
//data FullMonth = [<CMonth> , YYYYY]
//data MonthYear = <MonthShort> YYYY
//data UsaDate = MM/DD/YYYY
//data Iso8601d = YYYY-MM-DD
//data JsInterval = {from:Date, to: Date}
//date Period = [Iso8601d, Iso8601d]
//data TimeStructure = {ms:Int, seconds:Int, minutes:Int, hours:Int, days:Int, weeks:Int}
//data NicePeriod = String
//data FormatedTime = hh:mm
//data UnixMs = Int //unix time in milliseconds
//data ExtraShort = D-MMM //3-May, 30-Jun
//data Short = D<suffix>-MMM //3-rd May, 30-th Jun
//data AdwordsReportDate = YYYYMMDD //20170503, 20170630
//data Timezone = Timezone
//data Seconds = Int
//data YearMonth = YYYY-MM
var dnt = {};
_1_YEAR = 365;
_4_YEARS = _1_YEAR * 3 + 366;
_100_YEARS = _4_YEARS * 25 - 1;
_400_YEARS = _100_YEARS * 4 + 1;
LEAP_YEAR_MONTH_DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
MONTHS_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
MONTHS_LENGTH = {'January' : 31, 'February' : 28, 'March' : 31, 'April' : 30, 'May' : 31, 'June' : 30, 'July' : 31, 'August' : 31, 'September' : 30, 'October' : 31, 'November' : 30, 'December' : 31};

WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday','Thursday', 'Friday', 'Saturday'];
MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
MONTHS_SHORT = MONTHS.map(function(month_name) {return month_name.substr(0,3);});
WEEKDAYS_SHORT = WEEKDAYS.map(function(month_name) {return month_name.substr(0,3);});
DAY_IN_MILIS = 24 * 60 * 60 * 1000;
MS_ID_DAY = 24 * 60 * 60 * 1000;

//::Date->Iso8601
dnt.to_iso8601 = function(d, tz) {
  return Utilities.formatDate(d, tz, 'Y-MM-dd HH:mm:ss Z');
};

//::Date->Iso8601
dnt.to_utc = function(d) {
  return Utilities.formatDate(d, 'UTC', 'Y-MM-dd HH:mm:ss Z');
};

//::SimpleTime->Minutes->SimpleTime
dnt.add_minutes = function(st, offset) {
  var arr, h, m, mins_to_st;

  mins_to_st = function(n) {
    var rest, h, m;
    rest = n % (24 * 60);
    m = rest % 60;
    h = (rest - m) / 60;
    return lz(h) + ':' + lz(m);
  };

  arr = st.split(':');
  h = parseInt(arr[0]);
  m = parseInt(arr[1]);
  return  mins_to_st(h * 60 + m + offset);
};

//::DoE->DoW
dnt.dow = function(doe) {
  return doe % 7;//0 - ??? Sat? Sun? Mon
};

//::DayOfEpoch->[DayOfEpoch, DayOfEpoch]
dnt.get_woe_boundaries = function(doe) {
  var full_weeks, start;
  full_weeks = div(doe, 7);
  start = full_weeks * 7;
  return [start, start + 6];
};

//::Iso8601->Integer
dnt.day_of_our_era = function(iso8601) {
  var year, d, full_months, full_circles, rest, centuries_in_rest, small_circles_in_rest, months_days, full_months,
    day_pos, month, day, months;

  day_pos = 0;
  d = iso8601.split('-');
  year = Number(d[0]);
  month = Number(d[1]);
  day = Number(d[2]);

  full_circles = div(year - 1, 400);
  day_pos = full_circles * _400_YEARS;
  rest = (year - 1) % 400;
  centuries_in_rest  = div(rest, 100);
  day_pos += centuries_in_rest * _100_YEARS;
  rest = rest % 100;
  small_circles_in_rest = div(rest, 4);
  day_pos += small_circles_in_rest * (_4_YEARS);
  rest = rest % 4;
  day_pos += rest * _1_YEAR;
  months_days = dnt.is_leap(year) ? LEAP_YEAR_MONTH_DAYS : MONTHS_DAYS;
  months = months_days.slice(0, month - 1);
  full_months = months.reduce(sum, 0);//summarize all days in full months
  day_pos += full_months;
  day_pos += day;
  //day_pos = full_circles *_400_YEARS + centuries_in_rest*_100_YEARS + small_circles_in_rest*(_4_YEARS) + rest*_1_YEAR
  //+full_months + day
  return day_pos;
};

//::Integer->iso8601d
dnt.era_day_to_$ = function(day) {
  var year, months_days, diff, rest, days_in_year, c_month, mega_steps, mega_rest,
    full_circles, centuries, years, small_circles, rest_years, date_structure, day_count_var2;
  rest = day;
  mega_steps = div(day, _400_YEARS);
  rest = rest - mega_steps * _400_YEARS;
  centuries = div(rest, _100_YEARS);
  rest = rest - centuries * _100_YEARS;
  small_circles = div(rest, _4_YEARS);
  rest = rest - small_circles * _4_YEARS;
  rest_years = div(rest, _1_YEAR);
  if (rest_years == 4) {
    //we have at least 365*4=>730*2=>1460
    rest_years = 3;
  }
  rest = rest - rest_years * _1_YEAR;
  var d = date_structure = {day : day,
    big_circles : mega_steps,
    centuries : centuries,
    small_circles : small_circles,
    rest_years : rest_years,
    rest : rest};
  if (d.rest == 0) {
    day_count_var2 =  d.big_circles * _400_YEARS + d.centuries * _100_YEARS + d.small_circles * _4_YEARS + d.rest_years * 365 + d.rest;
    year = d.big_circles * 400 + d.centuries * 100 + d.small_circles * 4 + d.rest_years;
    if (d.centuries == 4) {
      //it is a century issue
      return l4z(year) + '-12-30';
    } else {
      return l4z(year) + '-12-31';
    }
  } else {
    year = d.big_circles * 400 + d.centuries * 100 + d.small_circles * 4 + d.rest_years + 1;
    months_days = dnt.is_leap(year) ? LEAP_YEAR_MONTH_DAYS : MONTHS_DAYS;
    c_month = 0;
    var days_in_month;
    days_in_month = months_days[c_month];
    while (rest > 0 && rest > days_in_month) {
      rest = rest - months_days[c_month];
      c_month++;
      days_in_month = months_days[c_month];
    }
    return [l4z(year), lz(c_month + 1), lz(rest)].join('-');
  }
  return;
};

dnt.week_of_our_era = function(iso8601) {
  return Math.floor(dnt.day_of_our_era(iso8601) / 7) + 1;
};

dnt.is_leap = function(year) {return ((year % 4 == 0) && (year % 100) != 0 || (year % 400) == 0);};

//::Date->Period
dnt.get_week_boundaries = function(a) {
  var mon, sun, diff, weekday, date;
  if (dnt.is_date(a)) {
    date = a;
    weekday = date.getDay();
    diff = weekday == 0 ? 6 : weekday - 1;
    mon = dnt.add_days(date, -diff);
    sun = dnt.add_days(mon, 6);
    return [dnt.to_iso8601d(mon), dnt.to_iso8601d(sun)];
  } else {
    if (is.num(a)) {
      //agrument is a number treats like a number or era week
      var day;
      //???
    }
  }
};

dnt.fm_s = function(fm) {return MONTHS[fm[0]] + ' ' + fm[1];};

//FullMonth->Number->FullMonth
dnt.add_months = function(fm, n) {
  var shift, dozens, res, months, years;
  months = fm[1] * 12 + fm[0];
  months += n;
  years = (months - months % 12) / 12;
  res = [months % 12, years];
  return res;
};

//::Date->FullMonth
dnt.get_full_month = function(date) {return [date.getMonth(), date.getFullYear()];};

//::Date->YearMonth
dnt.to_ym = function(d) {return d.getFullYear() + '-' + lz((d.getMonth() + 1));};

//::MonthYear->Bool
dnt.valid_my = function(s) {
  return MONTHS_SHORT.indexOf(s.trim().split(' ')[0]) > -1;
};

//::MonthYear->YearMonth
dnt.my_to_ym = function(m_y) {
  var arr, month_name, month, year;
  arr = m_y.split(' ');
  month_name = arr[0];
  month = MONTHS_SHORT.indexOf(month_name);
  year = Number(arr[1]);
  return year + '-' + (month + 1);
};

//::Date->Date
dnt.last_day_of_month = function(date) {
  var d, year, month;
  year = date.getFullYear(date);
  month = date.getMonth();
  d = new Date(year, month + 1, 0);
  return d;
};

//::YearMonth->Period
dnt.ym_to_period = function(ym) {
  var arr, start_date, end_date;
  arr = ym.split('-');
  start_date = new Date(arr[0], Number(arr[1]) - 1, 1);
  end_date = dnt.last_day_of_month(start_date);
  return [dnt.to_iso8601d(start_date), dnt.to_iso8601d(end_date)];
};

lz = function(x) {return ('00' + x).substr(-2);};
//::Date -> Iso8601d
dnt.to_iso8601d = function(d) {return d.getFullYear() + '-' + lz((d.getMonth() + 1)) + '-' + lz(d.getDate());};

dnt.iso8601d_to_mdy = function(iso8601d) {
  var arr, month, year, day;
  arr = iso8601d.split('-').map(function(x) {return Number(x);});
  year = arr[0];
  month = MONTHS_SHORT[arr[1] - 1];
  day = arr[2];
  return month + ' ' + day + ', ' + year;
};

dnt.get_weekday_sequence = function(weekday, date, n) {
  var i, res, start_date;
  res = [];
  start_date = dnt.get_immediate_weekday(weekday, date);
  res.push(start_date);
  for (i = 1;i < n;i++) {
    res.push(dnt.add_days(start_date, -i * 7));
  }
  return res;
};

dnt.get_immediate_weekday = function(weekday, date) {
  var current_weekday, diff;
  current_weekday = date.getDay();
  diff = current_weekday - weekday;
  if (diff <= 0) return dnt.add_days(date, -(7 + diff));
  return dnt.add_days(date,  - Math.abs(diff));
};

//::Date->Date
dnt.first_day_of_year = function(date) {return dnt.iso8601d_to_date(date.getFullYear() + '-01-01');};

//::Date->Date
dnt.last_day_of_year = function(date) {return dnt.iso8601d_to_date(date.getFullYear() + '-12-31');};

//::Date->Date
dnt.first_day_of_month = function(date) {return new Date(date.getFullYear(), date.getMonth(), 1);};

//::Date->Iso8601d
dnt.first_day_of_prev_month = function(date) {return dnt.iso8601d_to_date(dnt.dec_month(dnt.to_month(date)) + '-01');};

//::Date->Period
dnt.prev_month_period = function(date) {
  var first, last, prev_month_date;
  prev_month_date = new Date(date.getTime());
  prev_month_date.setMonth(prev_month_date.getMonth() - 1);
  first = dnt.first_day_of_month(prev_month_date);
  last = dnt.last_day_of_month(first);
  return [dnt.$(first), dnt.$(last)];
};

//::Date->Period
dnt.get_week_workdays = function(date) {
  var mon, fri, diff, weekday;
  weekday = date.getDay();
  diff = weekday == 0 ? 6 : weekday - 1;
  mon = dnt.add_days(date, -diff);
  fri = dnt.add_days(mon, 4);
  return [dnt.to_iso8601d(mon), dnt.to_iso8601d(fri)];
};

//::Date->UsaDate
dnt.jsdate_to_usa = function(date) {
  var year = date.getFullYear();
  var month = ('00' + (date.getMonth() + 1)).substr(-2);
  var day = ('00' + date.getDate()).substr(-2);
  return month + '/' + day + '/' + year;
};

//::Iso8601d->Int->Iso8601d
dnt.inc_iso8601d = function(d, n) {
  var jsdate, x;
  jsdate = dnt.iso8601d_to_date(d);
  x = jsdate.getDate() + n;
  jsdate.setDate(x);
  return dnt.to_iso8601d(jsdate);
};

//::Date->Int
dnt.get_doy = function(x) {
  var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  var mn = x.getMonth();
  var dn = x.getDate();
  var dayOfYear = dayCount[mn] + dn;
  if (mn > 1 && dnt.is_leap_year(x)) dayOfYear++;
  return dayOfYear;
};

//Date->Boolean
dnt.is_leap_year = function(x) {
  var year = x.getFullYear();
  if ((year & 3) != 0) return false;
  return ((year % 100) != 0 || (year % 400) == 0);
};

//::Date->Date->Period
dnt.to_period = function(from, to) {
  return [dnt.to_iso8601d(from), dnt.to_iso8601d(to)];
};

//::YearMonth -> ShortMonth
dnt.short_month = function(ym) {
  var arr, month;
  arr = ym.split('-');
  month = parseInt(arr[1], 10) - 1;
  return MONTHS_SHORT[month] + ' ' + arr[0];
};

//::YearMonth -> YearMonth
dnt.inc_month = function(ym) {
  var year, month, arr;
  arr = ym.split('-');
  year = parseInt(arr[0], 10);
  month = parseInt(arr[1], 10);
  year = month == 12 ? (year + 1) : year;
  month = month == 12 ? 1 : (month + 1);
  return year + '-' + lz(month);
};

//::YearMonth -> YearMonth
dnt.dec_month = function(ym) {
  var year, month, arr;
  arr = ym.split('-');
  year = parseInt(arr[0], 10);
  month = parseInt(arr[1], 10);
  year = month == 1 ? (year - 1) : year;
  month = month == 1 ? 12 : (month - 1);
  return year + '-' + lz(month);
};

//:: Date -> YearMonth
dnt.to_month = function(date) {
  return dnt.to_iso8601d(date).split('-').slice(0,2).join('-');
};

dnt.weekdays_diff = function(startDate, endDate) {
  var elapsed, daysBeforeFirstSaturday, daysAfterLastSunday;
  var ifThen = function (a, b, c) {
    return a == b ? c : a;
  };

  elapsed = endDate - startDate;
  elapsed = Math.floor(elapsed / 86400000);

  daysBeforeFirstSunday = (7 - startDate.getDay()) % 7;
  daysAfterLastSunday = endDate.getDay();

  elapsed -= (daysBeforeFirstSunday + daysAfterLastSunday);
  elapsed = (elapsed / 7) * 5;
  elapsed += ifThen(daysBeforeFirstSunday - 1, -1, 0) + ifThen(daysAfterLastSunday, 6, 5);

  return Math.ceil(elapsed);
};

//::Date -> Timezone -> Date
dnt.local_date = function(date, timezone) {
  var s_date;
  s_date = Utilities.formatDate(date, timezone, 'MMMM dd, yyyy HH:mm:ss');
  return new Date(s_date);
};
//::Date -> Timezone -> Seconds
dnt.getValueAsSeconds = function(value, tz) {
  var dateString, date, epoch, diff;
  dateString = Utilities.formatDate(value, tz,'EEE, d MMM yyyy HH:mm:ss');
  date = new Date(dateString);
  epoch = new Date('Dec 30, 1899 00:00:00');
  diff = date.getTime() - epoch.getTime();
  return Math.round(diff / 1000);
};

//::Period -> NicePeriod
dnt.period_nice = function(period) {
  var from, to, from_year, to_year;
  from = dnt.iso8601d_to_date(period[0]);
  to = dnt.iso8601d_to_date(period[1]);
  from_year = from.getFullYear();
  to_year = to.getFullYear();
  if (from_year != to_year) {
    return dnt.to_short(from) + ', ' + from_year + ' - ' + dnt.to_short(to) + ', ' + to_year;
  }
  return dnt.to_short(from) + ' - ' + dnt.to_short(to) + ', ' + to_year;
};

//::Date -> Short
dnt.to_short = function(date) {
  var day;
  day = date.getDate();
  return day + suffix(day) + ' ' + MONTHS_SHORT[date.getMonth()];
};

//::Iso8601d -> Period
dnt.month_to_date = function(date) {
  var arr;
  arr = date.split('-');
  arr[2] = '01';
  return [arr.join('-'), date];
};

//::Iso8601d -> Period
dnt.get_last_7_days = function(date) {
  var js_date, from, to;
  js_date = dnt.iso8601d_to_date(date);
  to = dnt.add_days(js_date, -1);
  from = dnt.add_days(js_date, -7);
  return [dnt.to_iso8601d(from), dnt.to_iso8601d(to)];
};

//Date -> Int -> JsInterval
dnt.get_week_period = function(date, n) {//returns period starts on n weeks before beginning of the last week
  //and ends at the end of the lastweek;
  var lw;
  lw = dnt.get_last_week(new Date(), -1);
  return {from : dnt.add_days(lw.from, -n * 7), to : lw.to};
};

//::Date -> Int -> JsInterval
dnt.get_last_week = function(date, offset) {
  var day_of_week, sun_date, adjustment, sat_date;
  day_of_week = date.getDay();
  adjustment = 8 + ((6 + day_of_week) % 7) + offset;
  sun_date = new Date(dnt.bod(date) - DAY_IN_MILIS * adjustment);
  sat_date = new Date(sun_date.getTime() + DAY_IN_MILIS * 6);
  return ({from : sun_date, to : sat_date});
};

//:Date -> Int
dnt.get_week = function(date) {//return number of week in a year
  var target, dayNr, firstThursday;
  target = new Date(date.valueOf());
  dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() != 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target) / 604800000); // 604800000 = 7 * 24 * 3600 * 1000
};

//Date -> AdwordsReportDate
dnt.js2adwords = function(date) {
  return date.getFullYear() + lz(date.getMonth() + 1) + lz(date.getDate());
};

//Date -> Date -> Int
dnt.days_diff = function(startDate, endDate) {
  var treatAsUTC, millisecondsPerDay;
  millisecondsPerDay = 24 * 60 * 60 * 1000;
  treatAsUTC = function(date) {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
  };
  return Math.floor((treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay);
};

//::Int -> Int -> FormatedTime
dnt.format_time = function(h, m) {return lz(h) + ':' + lz(m);};

//Int -> FormatedTime
dnt.minutes_to_time = function(n) {
  var h, m;
  h = Math.floor(n / 60);
  m = n - h * 60;
  return dnt.format_time(h, m);
};

//::YYYY-MM -> JsTimestamp
dnt.months_to_jstimestamp = function(s) {
  var arr;
  arr = s.split('-');
  return new Date(Number(arr[0]), Number(arr[1]) - 1, 1, 0, 0, 0);
};

//::Date -> UnixMs
dnt.begining_of_month = function(jsdate) {
  var date;
  date = new Date(jsdate.getTime());
  date.setDate(1);
  return dnt.begining_of_day(date);
};

//::Date -> Date -> [UnixMs, UnixMs]
dnt.months = function(js1, js2) {
  var month1, month2;
  return [dnt.begining_of_month(js1), dnt.begining_of_month(js2)];
};

//::Iso8601d -> Date
dnt.iso8601d_to_date = function(s) {
  var r;
  r = s.split('-').map(function(x) {return Number(x);});
  return new Date(r[0], r[1] - 1, r[2], 0, 0, 0);
};

//::Date -> ExtraShort
dnt.jsdate_to_extra_short = function(date) {
  return date.getDate() + '-' + MONTHS_SHORT[date.getMonth()];
};

//::Date -> Int -> Date
dnt.add_days = function(date, n) {
  var d1, x;
  d1 = new Date(date.getTime());//making copy of object
  x = d1.getDate() + n;
  d1.setDate(x);
  return d1;
};

//::UnixMs -> TimeStructure
dnt.parse = function(x) {
  var ms, secs, mins, hours, days, rest, weeks;
  rest = x;
  ms = rest % 1000;
  rest = Math.floor((rest - ms) / 1000);
  secs = rest % 60;
  rest = Math.floor((rest - secs) / 60);
  mins = rest % 60;
  rest = Math.floor((rest - mins) / 60);
  hours = rest % 24;
  rest = Math.floor((rest - hours) / 24);
  days = rest;
  weeks = Math.floor((rest - days) / 7);
  return {
    ms : ms,
    seconds : secs,
    minutes : mins,
    hours : hours,
    days : days,
    weeks : weeks
  };
};

//:Date -> Date
dnt.to_utc = function (jsdate) {
  var result;
  result = new Date(jsdate);
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result;
};

//::Date -> Unix_ms
dnt.begining_of_day = function(date) {
  var year, month, day;
  year = date.getFullYear();
  month = date.getMonth();
  day = date.getDate();
  return new Date(year, month, day).getTime();
};

//::UnixMs -> Int
dnt.to_weeks = function(ms) {return Math.floor(ms / (7 * 24 * 60 * 60 * 1000));};

//::UnixMs -> Int
dnt.to_days = function(ms) {return Math.floor(ms / (24 * 60 * 60 * 1000));};

//::UnixMs -> Int
dnt.to_hours = function(ms) {return Math.floor(ms / (60 * 60 * 1000));};//maximun full hours;

//::UnixMs -> Int
dnt.to_minutes = function(ms) {return Math.floor(ms / (60 * 1000));};

//::UnixMs -> Seconds
dnt.to_seconds = function(ms) {return Math.floor(ms / 1000);};

//::JsInterval -> TimeStructure
dnt.diff = function(arg) {
  var ms;
  ms = arg.to.getTime() - arg.from.getTime();
  return {ms : ms,
    seconds : dnt.to_seconds(ms),
    minutes : dnt.to_minutes(ms),
    hours : dnt.to_hours(ms),
    days : dnt.to_days(ms),
    weeks : dnt.to_weeks(ms)
  };
};

//::Function->Function->Function
compose = function(f, g) {
  return function(x) {
    return f(g(x));
  };
};

I_D = dnt.day_of_our_era;
D_I = dnt.era_day_to_$;
J_I = dnt.to_iso8601d;
I_J = dnt.iso8601d_to_date;
J_D = compose(I_D, J_I);
D_J = compose(I_J,D_I);

U_J = function(x) {return new Date(x);};
J_U = function(x) {return x.getTime();};
U_D = compose(J_D, U_J);
D_U = compose(J_U, D_J);
U_I = compose(J_I, U_J);

//version: 3.3.2