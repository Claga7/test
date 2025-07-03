import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import { CountryData, getCountryCode } from '../utils/mapUtils';

interface WorldMapProps {
  countryData: CountryData[];
}

const WorldMap: React.FC<WorldMapProps> = ({ countryData }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !countryData.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 1000;
    const height = 600;
    svg.attr("width", width).attr("height", height);

    // Create projection
    const projection = d3.geoNaturalEarth1()
      .scale(180)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Create country data map for quick lookup
    const dataMap = new Map();
    countryData.forEach(d => {
      const countryCode = getCountryCode(d.country);
      dataMap.set(countryCode, d);
    });

    // Scales
    const maxFunding = d3.max(countryData, d => d.totalFunding) || 1;
    const maxStartups = d3.max(countryData, d => d.startupCount) || 1;
    
    const sizeScale = d3.scaleLinear()
      .domain([0, maxFunding])
      .range([1, 2.5]);

    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, maxStartups]);

    // Load and render world map
    d3.json("https://unpkg.com/world-atlas@3/countries-110m.json").then((world: any) => {
      const countries = feature(world, world.objects.countries) as any;

      const mainGroup = svg.append("g");

      // Draw countries
      mainGroup.selectAll(".country")
        .data(countries.features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("fill", (d: any) => {
          const countryName = d.properties.NAME;
          const data = dataMap.get(countryName);
          return data ? colorScale(data.startupCount) : "#f8f9fa";
        })
        .attr("stroke", "#e2e8f0")
        .attr("stroke-width", 0.5)
        .attr("transform", (d: any) => {
          const countryName = d.properties.NAME;
          const data = dataMap.get(countryName);
          if (data) {
            const scale = sizeScale(data.totalFunding);
            const centroid = path.centroid(d);
            return `translate(${centroid[0] * (1 - scale)}, ${centroid[1] * (1 - scale)}) scale(${scale})`;
          }
          return "scale(1)";
        })
        .style("cursor", "pointer");

      // Tooltip
      const tooltip = d3.select("body").append("div")
        .attr("class", "map-tooltip")
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

      // Add interactivity
      mainGroup.selectAll(".country")
        .on("mouseover", function(event, d: any) {
          const countryName = d.properties.NAME;
          const data = dataMap.get(countryName);
          
          d3.select(this).attr("stroke-width", 2).attr("stroke", "#1e40af");
          
          if (data) {
            tooltip
              .style("visibility", "visible")
              .html(`
                <strong>${data.country}</strong><br/>
                Startup: ${data.startupCount}<br/>
                Funding totale: $${data.totalFunding.toFixed(1)}M<br/>
                Funding medio: $${data.averageFunding.toFixed(1)}M
              `);
          } else {
            tooltip
              .style("visibility", "visible")
              .html(`<strong>${countryName}</strong><br/>Nessun dato disponibile`);
          }
        })
        .on("mousemove", function(event) {
          tooltip
            .style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
          d3.select(this).attr("stroke-width", 0.5).attr("stroke", "#e2e8f0");
          tooltip.style("visibility", "hidden");
        });

      // Add title and legend
      const titleGroup = svg.append("g").attr("class", "title");
      
      titleGroup.append("text")
        .attr("x", width / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("font-weight", "bold")
        .attr("fill", "#1e40af")
        .text("Mappa Mondiale Fintech Startups");

      titleGroup.append("text")
        .attr("x", width / 2)
        .attr("y", 50)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#64748b")
        .text("Dimensioni = Funding Totale | Intensità Colore = Numero Startup");

      // Legend
      const legendGroup = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(50, 450)");

      // Size legend
      const sizeLegend = legendGroup.append("g").attr("class", "size-legend");
      sizeLegend.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("fill", "#374151")
        .text("Funding (dimensioni):");

      const sizeValues = [
        { value: maxFunding * 0.2, label: `$${(maxFunding * 0.2).toFixed(0)}M` },
        { value: maxFunding * 0.6, label: `$${(maxFunding * 0.6).toFixed(0)}M` },
        { value: maxFunding, label: `$${maxFunding.toFixed(0)}M` }
      ];

      sizeValues.forEach((item, i) => {
        const scale = sizeScale(item.value);
        sizeLegend.append("circle")
          .attr("cx", i * 80 + 20)
          .attr("cy", 25)
          .attr("r", 8 * scale)
          .attr("fill", "#93c5fd")
          .attr("stroke", "#1e40af")
          .attr("stroke-width", 1);

        sizeLegend.append("text")
          .attr("x", i * 80 + 20)
          .attr("y", 45)
          .attr("text-anchor", "middle")
          .attr("font-size", "10px")
          .attr("fill", "#64748b")
          .text(item.label);
      });

      // Color legend
      const colorLegend = legendGroup.append("g")
        .attr("class", "color-legend")
        .attr("transform", "translate(300, 0)");

      colorLegend.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("fill", "#374151")
        .text("Startup (colore):");

      const colorGradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "color-gradient")
        .attr("x1", "0%")
        .attr("x2", "100%");

      colorGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", colorScale(0));

      colorGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", colorScale(maxStartups));

      colorLegend.append("rect")
        .attr("x", 0)
        .attr("y", 10)
        .attr("width", 100)
        .attr("height", 15)
        .attr("fill", "url(#color-gradient)")
        .attr("stroke", "#e2e8f0");

      colorLegend.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("font-size", "10px")
        .attr("fill", "#64748b")
        .text("1");

      colorLegend.append("text")
        .attr("x", 100)
        .attr("y", 40)
        .attr("text-anchor", "end")
        .attr("font-size", "10px")
        .attr("fill", "#64748b")
        .text(maxStartups.toString());
    });

    return () => {
      d3.selectAll(".map-tooltip").remove();
    };
  }, [countryData]);

  return <svg ref={svgRef} className="drop-shadow-sm bg-white rounded-lg"></svg>;
};

export default WorldMap;