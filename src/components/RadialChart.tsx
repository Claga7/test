
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { nobelPrizeData } from './RadialChart/data';
import { DataPoint } from './RadialChart/types';
import { calculateRadialPositions, createColorScale, createSizeScale, createTooltip } from './RadialChart/utils';
import { drawRadialGrid } from './RadialChart/Grid';
import Legend from './RadialChart/Legend';

const RadialChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 900;
    const height = 900;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 350;

    svg.attr("width", width).attr("height", height);

    // Creiamo i gruppi principali
    const mainGroup = svg.append("g");
    const connectionsGroup = mainGroup.append("g").attr("class", "connections");
    const nodesGroup = mainGroup.append("g").attr("class", "nodes");
    const centerGroup = mainGroup.append("g").attr("class", "center");

    // Griglia radiale di sfondo
    drawRadialGrid(svg, centerX, centerY, radius);

    // Posizionamento radiale dei punti
    calculateRadialPositions(nobelPrizeData, centerX, centerY, radius);

    // Scale per colori e dimensioni
    const colorScale = createColorScale(nobelPrizeData);
    const sizeScale = createSizeScale(nobelPrizeData);

    // Disegnare le connessioni
    nobelPrizeData.forEach(d => {
      if (d.connections) {
        d.connections.forEach(connId => {
          const target = nobelPrizeData.find(node => node.id === connId);
          if (target && d.x && d.y && target.x && target.y) {
            connectionsGroup.append("line")
              .attr("x1", d.x)
              .attr("y1", d.y)
              .attr("x2", target.x)
              .attr("y2", target.y)
              .attr("stroke", "#6366f1")
              .attr("stroke-width", 2)
              .attr("opacity", 0.6);
          }
        });
      }
    });

    // Disegnare linee dal centro ai nodi
    nobelPrizeData.forEach(d => {
      if (d.x && d.y) {
        connectionsGroup.append("line")
          .attr("x1", centerX)
          .attr("y1", centerY)
          .attr("x2", d.x)
          .attr("y2", d.y)
          .attr("stroke", "#94a3b8")
          .attr("stroke-width", 1)
          .attr("opacity", 0.4);
      }
    });

    // Disegnare i nodi
    const nodes = nodesGroup.selectAll(".node")
      .data(nobelPrizeData)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x}, ${d.y})`);

    nodes.append("circle")
      .attr("r", d => sizeScale(d.value))
      .attr("fill", d => colorScale(d.value))
      .attr("opacity", 0.8)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2);

    // Punti interni
    nodes.append("circle")
      .attr("r", 3)
      .attr("fill", "#1e293b")
      .attr("opacity", 0.8);

    // Centro del grafico
    centerGroup.append("circle")
      .attr("cx", centerX)
      .attr("cy", centerY)
      .attr("r", 60)
      .attr("fill", "#64748b")
      .attr("opacity", 0.9)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 4);

    centerGroup.append("text")
      .attr("x", centerX)
      .attr("y", centerY - 10)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text("NOBEL");

    centerGroup.append("text")
      .attr("x", centerX)
      .attr("y", centerY + 10)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "12px")
      .text("PHYSICS");

    // Tooltip al hover
    const tooltip = createTooltip();

    nodes
      .on("mouseover", function(event, d) {
        d3.select(this).select("circle").attr("opacity", 1);
        tooltip
          .style("visibility", "visible")
          .html(`<strong>${d.name}</strong><br/>Year: ${d.year}<br/>Category: ${d.category}<br/>Value: ${d.value}`);
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

  }, []);

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <svg ref={svgRef} className="drop-shadow-sm"></svg>
        <Legend />
      </div>
    </div>
  );
};

export default RadialChart;
