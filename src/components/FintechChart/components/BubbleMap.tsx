import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { CountryData } from '../utils/mapUtils';

interface BubbleMapProps {
  countryData: CountryData[];
}

const BubbleMap: React.FC<BubbleMapProps> = ({ countryData }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !countryData.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 1000;
    const height = 600;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    svg.attr("width", width).attr("height", height);

    // Create angles for countries (same as radial chart but arranged around center)
    const angleStep = (2 * Math.PI) / countryData.length;
    
    // Scales
    const maxFunding = d3.max(countryData, d => d.totalFunding) || 1;
    const maxStartups = d3.max(countryData, d => d.startupCount) || 1;
    
    const sizeScale = d3.scaleSqrt()
      .domain([0, maxFunding])
      .range([8, 60]);

    // BCG Color palette
    const colorScale = d3.scaleLinear<string>()
      .domain([1, maxStartups])
      .range(["#DCF9E3", "#197A56"])
      .interpolate(d3.interpolateHcl);

    const mainGroup = svg.append("g");

    // Background
    mainGroup.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#f8fafc");

    // Title
    const titleGroup = mainGroup.append("g").attr("class", "title");
    
    titleGroup.append("text")
      .attr("x", centerX)
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .attr("font-size", "20px")
      .attr("font-weight", "bold")
      .attr("fill", "#21BF61")
      .text("Fintech Startups per Paese");

    titleGroup.append("text")
      .attr("x", centerX)
      .attr("y", 65)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("fill", "#64748b")
      .text("Dimensioni = Funding Totale | Colore = Numero Startup");

    // Draw country bubbles in circular arrangement
    const countriesGroup = mainGroup.append("g").attr("class", "countries");
    
    countryData.forEach((country, i) => {
      const angle = i * angleStep;
      const distance = radius * (0.6 + Math.random() * 0.4); // Add some randomness to avoid overlap
      const x = centerX + Math.cos(angle - Math.PI/2) * distance;
      const y = centerY + Math.sin(angle - Math.PI/2) * distance;
      
      const bubbleRadius = sizeScale(country.totalFunding);
      const fillColor = colorScale(country.startupCount);

      const countryGroup = countriesGroup.append("g")
        .attr("transform", `translate(${x}, ${y})`);

      // Country bubble
      const bubble = countryGroup.append("circle")
        .attr("r", bubbleRadius)
        .attr("fill", fillColor)
        .attr("stroke", "#21BF61")
        .attr("stroke-width", 2)
        .attr("opacity", 0.8)
        .style("cursor", "pointer");

      // Country label
      countryGroup.append("text")
        .attr("y", bubbleRadius + 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("font-weight", "bold")
        .attr("fill", "#374151")
        .text(country.country);

      // Startup count inside bubble (if bubble is large enough)
      if (bubbleRadius > 15) {
        countryGroup.append("text")
          .attr("text-anchor", "middle")
          .attr("font-size", "12px")
          .attr("font-weight", "bold")
          .attr("fill", "white")
          .attr("dy", "0.35em")
          .text(country.startupCount);
      }

      // Tooltip
      const tooltip = d3.select("body").append("div")
        .attr("class", "bubble-map-tooltip")
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

      bubble
        .on("mouseover", function(event) {
          d3.select(this).attr("opacity", 1).attr("stroke-width", 3);
          tooltip
            .style("visibility", "visible")
            .html(`
              <strong>${country.country}</strong><br/>
              Numero startup: ${country.startupCount}<br/>
              Funding totale: $${country.totalFunding.toFixed(1)}M<br/>
              Funding medio: $${country.averageFunding.toFixed(1)}M
            `);
        })
        .on("mousemove", function(event) {
          tooltip
            .style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
          d3.select(this).attr("opacity", 0.8).attr("stroke-width", 2);
          tooltip.style("visibility", "hidden");
        });
    });

    // Legend
    const legendGroup = mainGroup.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(50, 480)");

    // Size legend
    const sizeLegend = legendGroup.append("g").attr("class", "size-legend");
    sizeLegend.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "#374151")
      .text("Funding Totale:");

    const sizeValues = [
      { value: maxFunding * 0.2, label: `$${(maxFunding * 0.2).toFixed(0)}M` },
      { value: maxFunding * 0.6, label: `$${(maxFunding * 0.6).toFixed(0)}M` },
      { value: maxFunding, label: `$${maxFunding.toFixed(0)}M` }
    ];

    sizeValues.forEach((item, i) => {
      const bubbleRadius = sizeScale(item.value);
      sizeLegend.append("circle")
        .attr("cx", i * 120 + 40)
        .attr("cy", 30)
        .attr("r", bubbleRadius)
        .attr("fill", "#21BF61")
        .attr("opacity", 0.6)
        .attr("stroke", "#21BF61")
        .attr("stroke-width", 2);

      sizeLegend.append("text")
        .attr("x", i * 120 + 40)
        .attr("y", 70)
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("fill", "#64748b")
        .text(item.label);
    });

    // Color legend
    const colorLegend = legendGroup.append("g")
      .attr("class", "color-legend")
      .attr("transform", "translate(400, 0)");

    colorLegend.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "#374151")
      .text("Numero Startup:");

    const colorGradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "color-gradient-bubble")
      .attr("x1", "0%")
      .attr("x2", "100%");

    colorGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#DCF9E3");

    colorGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#197A56");

    colorLegend.append("rect")
      .attr("x", 0)
      .attr("y", 15)
      .attr("width", 120)
      .attr("height", 20)
      .attr("fill", "url(#color-gradient-bubble)")
      .attr("stroke", "#e2e8f0");

    colorLegend.append("text")
      .attr("x", 0)
      .attr("y", 50)
      .attr("font-size", "11px")
      .attr("fill", "#64748b")
      .text("1");

    colorLegend.append("text")
      .attr("x", 120)
      .attr("y", 50)
      .attr("text-anchor", "end")
      .attr("font-size", "11px")
      .attr("fill", "#64748b")
      .text(maxStartups.toString());

    return () => {
      d3.selectAll(".bubble-map-tooltip").remove();
    };
  }, [countryData]);

  return <svg ref={svgRef} className="drop-shadow-sm bg-white rounded-lg"></svg>;
};

export default BubbleMap;