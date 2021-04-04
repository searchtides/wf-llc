const vx1 = -50; const vy1 = -50; const vx2 = 1000; const vy2 = 500;

const H = 100; const R = H / 2; const CR = R / 2;

const comb = (...args) => (g) => {
  args.forEach(arg=>{
    arg(g);
  });
  return g;
};

const framed_cell = (...args)=>(g) => {
  let h = 20; let w = h;
  let ps = {
    a : [0, 0], b : [w, 0],
    c : [w, h], d : [0, h],
  };
  let paths = [];
  paths[0] = gen_path([ps['a'], ps['b']]);
  paths[1] = gen_path([ps['b'], ps['c']]);
  paths[2] = gen_path([ps['c'], ps['d']]);
  paths[3] = gen_path([ps['d'], ps['a']]);
  let gr  = g.append('g');
  args.forEach((arg, i)=>{
    if (arg) {
      gr.append('path')
        .attr('d', paths[i])
        .attr('stroke', 'black');
    }
  });
  return gr;
};

const arcFactory = (...args) => (i) => (g) => {
  let alfa = 10;
  let r = CR;
  let dy = r * Math.cos(alfa * K);
  let dx = r * Math.sin(alfa * K);
  let trs_args = tr([r - dx, r - dy]);
  let path = "M 0 0 A " + r + " " + r + ", 0, 0, 1, " + 2 * dx + " 0";
  path += ["L", dx, dy / 2].join(' ') + "Z";
  args.forEach((arg, i)=>{
    if (arg) {
      g.append('path').attr('d', path)
        .attr('transform', trs_args + 'rotate(' + i * 90  + ' ' + dx + ' ' + dy + ')')
        .attr('fill', arg).attr('stroke', 'none');
    }
  });
  return g;
};

const arc = (spin) => (i) => (g) => {
  let rotation_step = 90;
  let angle = spin * i * rotation_step;
  let alfa = 10;
  let r = CR;
  let dy = r * Math.cos(alfa * K);
  let dx = r * Math.sin(alfa * K);
  let trs_args = tr([r - dx, r - dy]);
  let path = "M 0 0 A " + r + " " + r + ", 0, 0, 1, " + 2 * dx + " 0";
  path += ["L", dx, dy / 2].join(' ');
  path += "Z";
  let gr = g.append('g');
  gr.append('path').attr('d', path).attr('transform', trs_args + 'rotate(0 ' + dx + ' ' + dy + ')')
    .attr('fill', 'none').attr('stroke', 'black');
  gr.append('path').attr('d', path).attr('transform', trs_args + 'rotate(90 ' + dx + ' ' + dy + ')');
  gr.append('path').attr('d', path).attr('transform', trs_args + 'rotate(-90 ' + dx + ' ' + dy + ')');
  gr.append('path').attr('d', path).attr('transform', trs_args + 'rotate(180 ' + dx + ' ' + dy + ')')
    .attr('fill', 'none').attr('stroke', 'black');
  return gr
  //.attr('transform', 'rotate(' + angle + ')')
    .attr('transform', 'rotate(' + angle + ', ' + CR + ', ' + CR + ')');
};

const circle1 = (i) => (g) => {
  let trs_args = tr([R / 2, R / 2]);
  g.append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', CR)
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('transform', trs_args);
};

const rect1 = (spin) => (i) => (g) => {
  let rotation_step = 90;
  let alfa = 10;
  let h = R;
  let d = h / 5;
  let gr = g.append('g');
  gr.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', h)
    .attr('height', h)
    .attr('fill', 'none')
    .attr('stroke', 'black');

  rct(h - d, 0, d, d)(gr).attr('fill', 'none').attr('stroke', 'black');
  rct(0, h - d, d, d)(gr);
  gr.attr('transform', 'rotate(' + spin * i * rotation_step  + ', ' + h / 2 + ', ' + h / 2 + ')');
  return g;

};
const step = (xs, i) => (g) => {
  xs.forEach(fn => {
    fn(i)(g);
  });
  return g;
};
const arc2 = (i) => (g) => {
  let alfa = 10;
  let r = CR;
  let dy = r * Math.cos(alfa * K);
  let dx = r * Math.sin(alfa * K);
  let trs_args = tr([r - dx, r - dy]);
  let path = "M 0 0 A " + r + " " + r + ", 0, 0, 1, " + 2 * dx + " 0";
  path += ["L", dx, dy / 2].join(' ');
  path += "Z";
  g.append('path').attr('d', path).attr('transform', trs_args + 'rotate(0 ' + dx + ' ' + dy + ')')
    .attr('fill', 'none').attr('stroke', 'black');
  g.append('path').attr('d', path).attr('transform', trs_args + 'rotate(-90 ' + dx + ' ' + dy + ')');
  return g;
};

const arc3 = (i) => (g) => {
  let alfa = 10;
  let r = CR;
  let dy = r * Math.cos(alfa * K);
  let dx = r * Math.sin(alfa * K);
  let trs_args = tr([r - dx, r - dy]);
  let path = "M 0 0 A " + r + " " + r + ", 0, 0, 1, " + 2 * dx + " 0";
  path += ["L", dx, dy / 2].join(' ');
  path += "Z";
  g.append('path').attr('d', path).attr('transform', trs_args + 'rotate(0 ' + dx + ' ' + dy + ')')
    .attr('fill', 'none').attr('stroke', 'black');
  return g;
};

const rct = (x, y, w, h) => (g) => {
  return g.append('rect')
    .attr('x', x)
    .attr('y', y)
    .attr('width', w)
    .attr('height', h);
};

const encripted = (n) => (g) => {
  let h = 20; let w = 15;
  let ps = {
    a : [0, 0], b : [w, 0],
    c : [0, h], d : [w, h],
    e : [0, 2 * h], f : [w, 2 * h]
  };
  let digits = {
    0 : [0, 6, 5, 4, 8, 7],
    1 : [1, 5, 6],
    2 : [0, 6, 3, 4],
    3 : [0, 1, 2, 3],
    4 : [7, 2, 6, 5],
    5 : [0, 7, 2, 5, 4],
    6 : [0, 7, 2, 5, 4, 8],
    7 : [0, 1, 8],
    8 : [0, 6, 5, 4, 8, 7, 2],
    9 : [0, 6, 2, 7, 3],
  };
  let paths = [];
  paths[0] = gen_path([ps['a'], ps['b']]);
  paths[1] = gen_path([ps['c'], ps['b']]);
  paths[2] = gen_path([ps['c'], ps['d']]);
  paths[3] = gen_path([ps['e'], ps['d']]);
  paths[4] = gen_path([ps['e'], ps['f']]);
  paths[5] = gen_path([ps['d'], ps['f']]);
  paths[6] = gen_path([ps['b'], ps['d']]);
  paths[7] = gen_path([ps['a'], ps['c']]);
  paths[8] = gen_path([ps['c'], ps['e']]);
  let bars = digits[n];
  let resPath = bars.map(idx => paths[idx]).join('');
  let gr = g.append('g');
  gr.append('path')
    .attr('d', resPath)
    .attr('stroke', 'black')
    .attr('transform', 'scale(-1, 1) ' + tr([-2 * w, 0]));
  gr.append('path')
    .attr('d', resPath)
    .attr('stroke', 'black');
  return gr;
};

const K = Math.PI / 180;
//::[]->String
const tr = (p) => 'translate(' + p.join(', ') + ')';
//::SvgGroup->SvgGroup
const star = (g) => {
  let starPath = gen_z_path(gen_star_points(50, 25, 5));
  return g.append('path')
    .attr('d', starPath)
    .attr('transform', 'rotate(-90)');
};
const circle = (g) => {
  return g.append('circle')
    .attr('cx', 0)
    .attr('yx', 0)
    .attr('r', 50);
};
const rect = (g) => {
  return g.append('rect')
    .attr('x', -50)
    .attr('y', -50)
    .attr('width', 100)
    .attr('height', 100);
};
const triangle_norm = (g) => {
  let points;
  let L = 50;
  let hL = L / 2;
  points = [[hL, 0], [L, L], [0, L]].map(p => [p[0], p[1]]);//triagnl
  let trianglePath = gen_z_path(points);
  return g.append('path')
    .attr('d', trianglePath)
    .attr('transform', tr([-hL, -hL]));
};

const triangle_small = (g) => {
  let points;
  let L = 50;
  let hL = L / 2;
  points = [[hL, 0], [L, L], [0, L]].map(p => [p[0], p[1]]);//triagnl
  let trianglePath = gen_z_path(points);
  let transformations;
  transformations = 'scale(0.5, 0.5)';
  transformations += tr([-hL, -hL]);
  return g.append('path')
    .attr('d', trianglePath)
    .attr('transform', transformations);
};

const triangle_big = (g) => {
  let points;
  let L = 50;
  let hL = L / 2;
  points = [[hL, 0], [L, L], [0, L]].map(p => [p[0], p[1]]);//triagnl
  let trianglePath = gen_z_path(points);
  let transformations;
  transformations = 'scale(1.5, 1.5)';
  transformations += tr([-hL, -hL]);
  return g.append('path')
    .attr('d', trianglePath)
    .attr('transform', transformations);
};

var lineGenerator = d3.line();

const grad_to_point = (grad) => {
  let k = Math.PI / 180;
  let x = Math.cos(k * grad);
  let y = Math.sin(k * grad);
  return [x, y];
};

const tf2 = x => x.toFixed(2);
const gen_path = (points => {
  let ls = points.slice(1, points.length).map(p => "L" + p.map(tf2).join(',')).join('');
  let ms = "M" + points[0].map(tf2).join(',');
  return ms + ls;
});

const gen_z_path = (points => {
  let ls = points.slice(1, points.length).map(p => "L" + p.map(tf2).join(',')).join('');
  let ms = "M" + points[0].map(tf2).join(',');
  return ms + ls + "Z";
});

const add_path = (main_g, p) => { return main_g.append('g').append('path').attr('d', p); };

const gen_star_points = function (r1, r2, n) {
  let dG = 360 / n;
  let dr = dG / 2;
  let grads = _.range(0, n).map(i => { return i * dG; });
  let grads2 = grads.map(grad => grad + dr);
  let points = grads.map(grad_to_point).map(p => p.map(x => x * r1));
  let points2 = grads2.map(grad_to_point).map(p => p.map(x => x * r2));
  return _.zip(points, points2).reduce((a, b) => a.concat(b));
};
