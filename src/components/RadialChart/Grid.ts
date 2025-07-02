
import * as d3 from 'd3';

export const drawRadialGrid = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, centerX: number, centerY: number, radius: number) => {
  const gridGroup = svg.append("g").attr("class", "grid").style("opacity", 0.3);
  
  // Cerchi concentrici
  for (let i = 1; i <= 5; i++) {
    gridGroup.append("circle")
      .attr("cx", centerX)
      .attr("cy", centerY)
      .attr("r", (radius / 5) * i)
      .attr("fill", "none")
      .attr("stroke", "#e2e8f0")
      .attr("stroke-width", 1);
  }

  // Linee radiali
  for (let i = 0; i < 36; i++) {
    const angle = (i * 10) * (Math.PI / 180);
    gridGroup.append("line")
      .attr("x1", centerX)
      .attr("y1", centerY)
      .attr("x2", centerX + Math.cos(angle - Math.PI/2) * radius)
      .attr("y2", centerY + Math.sin(angle - Math.PI/2) * radius)
      .attr("stroke", "#e2e8f0")
      .attr("stroke-width", 0.5);
  }
};
