
import * as d3 from 'd3';
import { DataPoint } from './types';

export const calculateRadialPositions = (data: DataPoint[], centerX: number, centerY: number, radius: number) => {
  const angleStep = (2 * Math.PI) / data.length;
  
  data.forEach((d, i) => {
    const angle = i * angleStep;
    const distance = radius * 0.85;
    d.x = centerX + Math.cos(angle - Math.PI/2) * distance;
    d.y = centerY + Math.sin(angle - Math.PI/2) * distance;
  });
};

export const createColorScale = (data: DataPoint[]) => {
  return d3.scaleSequential(d3.interpolateViridis)
    .domain(d3.extent(data, d => d.value) as [number, number]);
};

export const createSizeScale = (data: DataPoint[]) => {
  return d3.scaleSqrt()
    .domain(d3.extent(data, d => d.value) as [number, number])
    .range([8, 40]);
};

export const createTooltip = () => {
  return d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background", "rgba(0,0,0,0.8)")
    .style("color", "white")
    .style("padding", "8px 12px")
    .style("border-radius", "6px")
    .style("font-size", "12px")
    .style("pointer-events", "none")
    .style("z-index", "1000");
};
