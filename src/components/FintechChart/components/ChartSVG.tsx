
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ProcessedStartup } from '@/types/fintech';
import { getChartDimensions, getCountryAngles } from '../utils/chartUtils';

interface ChartSVGProps {
  processedData: ProcessedStartup[];
  countries: string[];
}

const ChartSVG: React.FC<ChartSVGProps> = ({ processedData, countries }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height, centerX, centerY, radius } = getChartDimensions();
    const countryAngles = getCountryAngles(countries);
    const angleStep = (2 * Math.PI) / countries.length;

    svg.attr("width", width).attr("height", height);

    const mainGroup = svg.append("g");
    const connectionsGroup = mainGroup.append("g").attr("class", "connections");
    const nodesGroup = mainGroup.append("g").attr("class", "nodes");
    const centerGroup = mainGroup.append("g").attr("class", "center");

    // Grid
    const gridGroup = mainGroup.append("g").attr("class", "grid").style("opacity", 0.3);
    
    const yearLabels = [2000, 2005, 2010, 2015, 2020];
    for (let i = 1; i <= 5; i++) {
      const r = (radius / 5) * i;
      gridGroup.append("circle")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", r)
        .attr("fill", "none")
        .attr("stroke", "#e2e8f0")
        .attr("stroke-width", 1);
      
      gridGroup.append("text")
        .attr("x", centerX + r + 5)
        .attr("y", centerY)
        .attr("font-size", "10px")
        .attr("fill", "#64748b")
        .text(yearLabels[i-1]);
    }

    // Radial lines
    countries.forEach((country, i) => {
      const angle = i * angleStep;
      gridGroup.append("line")
        .attr("x1", centerX)
        .attr("y1", centerY)
        .attr("x2", centerX + Math.cos(angle - Math.PI/2) * radius)
        .attr("y2", centerY + Math.sin(angle - Math.PI/2) * radius)
        .attr("stroke", "#e2e8f0")
        .attr("stroke-width", 0.5);
      
      const labelDistance = radius + 30;
      const labelX = centerX + Math.cos(angle - Math.PI/2) * labelDistance;
      const labelY = centerY + Math.sin(angle - Math.PI/2) * labelDistance;
      
      gridGroup.append("text")
        .attr("x", labelX)
        .attr("y", labelY)
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("font-weight", "bold")
        .attr("fill", "#374151")
        .text(country);
    });

    // Scales
    const maxGroupSize = d3.max(processedData, d => d.groupSize) || 1;
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([1, maxGroupSize]);

    const sizeScale = d3.scaleSqrt()
      .domain(d3.extent(processedData, d => d.funding) as [number, number])
      .range([8, 50]);

    // Connection lines
    processedData.forEach(d => {
      connectionsGroup.append("line")
        .attr("x1", centerX)
        .attr("y1", centerY)
        .attr("x2", d.x)
        .attr("y2", d.y)
        .attr("stroke", "#94a3b8")
        .attr("stroke-width", 0.5)
        .attr("opacity", 0.3);
    });

    // Nodes
    const nodes = nodesGroup.selectAll(".node")
      .data(processedData)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x}, ${d.y})`);

    nodes.append("circle")
      .attr("r", d => sizeScale(d.funding))
      .attr("fill", d => colorScale(d.groupSize))
      .attr("opacity", 0.8)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2);

    // Center
    centerGroup.append("circle")
      .attr("cx", centerX)
      .attr("cy", centerY)
      .attr("r", 50)
      .attr("fill", "#1e40af")
      .attr("opacity", 0.9)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 4);

    centerGroup.append("text")
      .attr("x", centerX)
      .attr("y", centerY - 8)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .text("FINTECH");

    centerGroup.append("text")
      .attr("x", centerX)
      .attr("y", centerY + 8)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "10px")
      .text("2025");

    // Tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "fintech-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "rgba(0,0,0,0.9)")
      .style("color", "white")
      .style("padding", "12px")
      .style("border-radius", "8px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "1000")
      .style("max-width", "250px");

    nodes
      .on("mouseover", function(event, d) {
        d3.select(this).select("circle").attr("opacity", 1);
        tooltip
          .style("visibility", "visible")
          .html(`
            <strong>${d.name}</strong><br/>
            Paese: ${d.country}<br/>
            Anno fondazione: ${d.foundingYear}<br/>
            Funding: $${d.funding}M<br/>
            Startup nello stesso gruppo: ${d.groupSize}
          `);
      })
      .on("mousemove", function(event) {
        tooltip
          .style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).select("circle").attr("opacity", 0.8);
        tooltip.style("visibility", "hidden");
      });

    return () => {
      d3.selectAll(".fintech-tooltip").remove();
    };
  }, [processedData, countries]);

  return <svg ref={svgRef} className="drop-shadow-sm"></svg>;
};

export default ChartSVG;
