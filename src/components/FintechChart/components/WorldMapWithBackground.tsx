import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { CountryData } from '../utils/mapUtils';

interface WorldMapWithBackgroundProps {
  countryData: CountryData[];
}

const WorldMapWithBackground: React.FC<WorldMapWithBackgroundProps> = ({ countryData }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !countryData.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 1000;
    const height = 600;
    svg.attr("width", width).attr("height", height);

    // Scales
    const maxFunding = d3.max(countryData, d => d.totalFunding) || 1;
    const maxStartups = d3.max(countryData, d => d.startupCount) || 1;
    
    const radiusScale = d3.scaleSqrt()
      .domain([0, maxFunding])
      .range([8, 40]);

    // BCG Color palette
    const colorScale = d3.scaleLinear<string>()
      .domain([0, maxStartups])
      .range(["#DCF9E3", "#197A56"])
      .interpolate(d3.interpolateHcl);

    // Country positions (more precise)
    const countryPositions: Record<string, [number, number]> = {
      'Stati Uniti': [250, 180],
      'United States of America': [250, 180],
      'Regno Unito': [500, 140],
      'United Kingdom': [500, 140],
      'Cina': [750, 200],
      'China': [750, 200],
      'Brasile': [350, 350],
      'Brazil': [350, 350],
      'Svezia': [530, 100],
      'Sweden': [530, 100],
      'Germania': [520, 160],
      'Germany': [520, 160],
      'Francia': [480, 180],
      'France': [480, 180],
      'Italia': [520, 200],
      'Italy': [520, 200],
      'Spagna': [460, 220],
      'Spain': [460, 220],
      'Canada': [200, 120],
      'Australia': [800, 420],
      'Giappone': [850, 200],
      'Japan': [850, 200],
      'Corea del Sud': [820, 220],
      'South Korea': [820, 220],
      'India': [680, 250],
      'Singapore': [750, 320],
      'Svizzera': [510, 170],
      'Switzerland': [510, 170],
      'Norvegia': [520, 80],
      'Norway': [520, 80],
      'Danimarca': [520, 120],
      'Denmark': [520, 120],
      'Finlandia': [560, 80],
      'Finland': [560, 80],
      'Paesi Bassi': [500, 150],
      'Netherlands': [500, 150]
    };

    const mainGroup = svg.append("g");

    // Background
    mainGroup.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#f8fafc");

    // Draw continent shapes for better geography
    // North America
    mainGroup.append("ellipse")
      .attr("cx", 200)
      .attr("cy", 160)
      .attr("rx", 80)
      .attr("ry", 60)
      .attr("fill", "#e2e8f0")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", 1)
      .attr("opacity", 0.5);

    // Europe
    mainGroup.append("ellipse")
      .attr("cx", 520)
      .attr("cy", 150)
      .attr("rx", 50)
      .attr("ry", 40)
      .attr("fill", "#e2e8f0")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", 1)
      .attr("opacity", 0.5);

    // Asia
    mainGroup.append("ellipse")
      .attr("cx", 750)
      .attr("cy", 200)
      .attr("rx", 120)
      .attr("ry", 80)
      .attr("fill", "#e2e8f0")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", 1)
      .attr("opacity", 0.5);

    // Australia
    mainGroup.append("ellipse")
      .attr("cx", 800)
      .attr("cy", 420)
      .attr("rx", 40)
      .attr("ry", 25)
      .attr("fill", "#e2e8f0")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", 1)
      .attr("opacity", 0.5);

    // South America
    mainGroup.append("ellipse")
      .attr("cx", 320)
      .attr("cy", 350)
      .attr("rx", 50)
      .attr("ry", 80)
      .attr("fill", "#e2e8f0")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", 1)
      .attr("opacity", 0.5);

    // Africa
    mainGroup.append("ellipse")
      .attr("cx", 520)
      .attr("cy", 280)
      .attr("rx", 60)
      .attr("ry", 90)
      .attr("fill", "#e2e8f0")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", 1)
      .attr("opacity", 0.5);

    // Draw country circles
    countryData.forEach(country => {
      const position = countryPositions[country.country];
      
      if (position) {
        const [x, y] = position;
        const radius = radiusScale(country.totalFunding);
        const fillColor = colorScale(country.startupCount);

        const countryGroup = mainGroup.append("g")
          .attr("transform", `translate(${x}, ${y})`);

        const circle = countryGroup.append("circle")
          .attr("r", radius)
          .attr("fill", fillColor)
          .attr("stroke", "#197A56")
          .attr("stroke-width", 2)
          .attr("opacity", 0.9)
          .style("cursor", "pointer");

        // Country label
        countryGroup.append("text")
          .attr("y", radius + 15)
          .attr("text-anchor", "middle")
          .attr("font-size", "10px")
          .attr("font-weight", "bold")
          .attr("fill", "#374151")
          .text(country.country);

        // Startup count inside larger bubbles
        if (radius > 12) {
          countryGroup.append("text")
            .attr("text-anchor", "middle")
            .attr("font-size", "11px")
            .attr("font-weight", "bold")
            .attr("fill", "white")
            .attr("dy", "0.35em")
            .text(country.startupCount);
        }

        // Tooltip
        const tooltip = d3.select("body").append("div")
          .attr("class", "world-map-tooltip")
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

        circle
          .on("mouseover", function(event) {
            d3.select(this).attr("opacity", 1).attr("stroke-width", 3);
            tooltip
              .style("visibility", "visible")
              .html(`
                <strong>${country.country}</strong><br/>
                Startup: ${country.startupCount}<br/>
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
            d3.select(this).attr("opacity", 0.9).attr("stroke-width", 2);
            tooltip.style("visibility", "hidden");
          });
      }
    });

    // Title
    const titleGroup = svg.append("g").attr("class", "title");
    
    titleGroup.append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .attr("fill", "#197A56")
      .text("Mappa Mondiale Fintech Startups");

    titleGroup.append("text")
      .attr("x", width / 2)
      .attr("y", 50)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#64748b")
      .text("Dimensioni = Funding Totale | Colore = Numero Startup");

    // Legend
    const legendGroup = svg.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(50, 520)");

    // Size legend
    const sizeLegend = legendGroup.append("g").attr("class", "size-legend");
    sizeLegend.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("fill", "#374151")
      .text("Funding:");

    const sizeValues = [
      { value: maxFunding * 0.3, label: `$${(maxFunding * 0.3).toFixed(0)}M` },
      { value: maxFunding * 0.7, label: `$${(maxFunding * 0.7).toFixed(0)}M` },
      { value: maxFunding, label: `$${maxFunding.toFixed(0)}M` }
    ];

    sizeValues.forEach((item, i) => {
      const radius = radiusScale(item.value);
      sizeLegend.append("circle")
        .attr("cx", i * 90 + 20)
        .attr("cy", 25)
        .attr("r", radius)
        .attr("fill", "#197A56")
        .attr("opacity", 0.6)
        .attr("stroke", "#197A56")
        .attr("stroke-width", 1);

      sizeLegend.append("text")
        .attr("x", i * 90 + 20)
        .attr("y", 55)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("fill", "#64748b")
        .text(item.label);
    });

    // Color legend
    const colorLegend = legendGroup.append("g")
      .attr("class", "color-legend")
      .attr("transform", "translate(350, 0)");

    colorLegend.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("fill", "#374151")
      .text("Numero Startup:");

    const colorGradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "color-gradient-world")
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
      .attr("width", 100)
      .attr("height", 15)
      .attr("fill", "url(#color-gradient-world)")
      .attr("stroke", "#e2e8f0");

    colorLegend.append("text")
      .attr("x", 0)
      .attr("y", 45)
      .attr("font-size", "10px")
      .attr("fill", "#64748b")
      .text("1");

    colorLegend.append("text")
      .attr("x", 100)
      .attr("y", 45)
      .attr("text-anchor", "end")
      .attr("font-size", "10px")
      .attr("fill", "#64748b")
      .text(maxStartups.toString());

    return () => {
      d3.selectAll(".world-map-tooltip").remove();
    };
  }, [countryData]);

  return <svg ref={svgRef} className="drop-shadow-sm bg-white rounded-lg"></svg>;
};

export default WorldMapWithBackground;