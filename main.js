var svg = d3
  .select("#svgcontainer")
  .append("svg")
  .attr("width", 1200)
  .attr("height", 600)
  .attr("viewBox", [vx1, vy1, vx2, vy2].join(' '));

let data = Object.keys(qa_map).sort().map(day=>qa_map[day]);

let p = svg.append("g").selectAll("rect")
  .data(data);
let h = 30;
p.enter()
  .append('g')
  .append('rect')
  .attr('x', 0)
  .attr('y', (d, i)=>i * h)
  .attr('height', h - 4)
  .attr('width', d=>d.om.invalid)
  .attr('fill', 'red');
p.enter()
  .append('rect')
  .attr('x', d=>d.om.invalid)
  .attr('y', (d, i)=>i * h)
  .attr('fill', 'green')
  .attr('height', h - 4)
  .attr('width', d=>d.om.valid);