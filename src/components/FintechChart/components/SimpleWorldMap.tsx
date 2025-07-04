import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { CountryData, getCountryCode } from '../utils/mapUtils';

interface SimpleWorldMapProps {
  countryData: CountryData[];
}

const SimpleWorldMap: React.FC<SimpleWorldMapProps> = ({ countryData }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !countryData.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 1000;
    const height = 600;
    svg.attr("width", width).attr("height", height);

    // Create country data map for quick lookup
    const dataMap = new Map();
    countryData.forEach(d => {
      const countryCode = getCountryCode(d.country);
      dataMap.set(countryCode, d);
      dataMap.set(d.country, d); // Also map by original name
    });

    // Scales
    const maxFunding = d3.max(countryData, d => d.totalFunding) || 1;
    const maxStartups = d3.max(countryData, d => d.startupCount) || 1;
    
    const radiusScale = d3.scaleSqrt()
      .domain([0, maxFunding])
      .range([5, 50]);

    // BCG Color palette for map
    const colorScale = d3.scaleLinear<string>()
      .domain([0, maxStartups])
      .range(["#F1EEEA", "#21BF61"])
      .interpolate(d3.interpolateHcl);

    // Country positions (approximate)
    const countryPositions: Record<string, [number, number]> = {
      'Stati Uniti': [200, 200],
      'United States of America': [200, 200],
      'Regno Unito': [500, 150],
      'United Kingdom': [500, 150],
      'Cina': [750, 250],
      'China': [750, 250],
      'Brasile': [300, 400],
      'Brazil': [300, 400],
      'Svezia': [550, 100],
      'Sweden': [550, 100],
      'Germania': [520, 180],
      'Germany': [520, 180],
      'Francia': [480, 200],
      'France': [480, 200],
      'Italia': [520, 220],
      'Italy': [520, 220],
      'Spagna': [460, 240],
      'Spain': [460, 240],
      'Canada': [150, 120],
      'Australia': [800, 450],
      'Giappone': [850, 250],
      'Japan': [850, 250],
      'Corea del Sud': [820, 260],
      'South Korea': [820, 260],
      'India': [700, 300],
      'Singapore': [750, 350],
      'Svizzera': [510, 190],
      'Switzerland': [510, 190],
      'Norvegia': [540, 80],
      'Norway': [540, 80],
      'Danimarca': [530, 120],
      'Denmark': [530, 120],
      'Finlandia': [580, 90],
      'Finland': [580, 90],
      'Paesi Bassi': [510, 160],
      'Netherlands': [510, 160]
    };

    const mainGroup = svg.append("g");

    // Draw background
    mainGroup.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#f8fafc");

    // Draw country circles
    countryData.forEach(country => {
      const position = countryPositions[country.country] || 
                      countryPositions[getCountryCode(country.country)];
      
      if (position) {
        const [x, y] = position;
        const radius = radiusScale(country.totalFunding);
        const fillColor = colorScale(country.startupCount);

        const countryGroup = mainGroup.append("g")
          .attr("transform", `translate(${x}, ${y})`);

        const circle = countryGroup.append("circle")
          .attr("r", radius)
          .attr("fill", fillColor)
          .attr("stroke", "#21BF61")
          .attr("stroke-width", 2)
          .attr("opacity", 0.8)
          .style("cursor", "pointer");

        // Country label
        countryGroup.append("text")
          .attr("y", radius + 15)
          .attr("text-anchor", "middle")
          .attr("font-size", "10px")
          .attr("font-weight", "bold")
          .attr("fill", "#374151")
          .text(country.country);

        // Tooltip
        const tooltip = d3.select("body").append("div")
          .attr("class", "simple-map-tooltip")
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
            d3.select(this).attr("opacity", 1);
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
            d3.select(this).attr("opacity", 0.8);
            tooltip.style("visibility", "hidden");
          });
      }
    });

    // Add title
    const titleGroup = svg.append("g").attr("class", "title");
    
    titleGroup.append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .attr("fill", "#21BF61")
      .text("Mappa Mondiale Fintech Startups");

    titleGroup.append("text")
      .attr("x", width / 2)
      .attr("y", 50)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#64748b")
      .text("Dimensioni cerchi = Funding Totale | Intensità Colore = Numero Startup");

    // Legend
    const legendGroup = svg.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(50, 500)");

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
      const radius = radiusScale(item.value);
      sizeLegend.append("circle")
        .attr("cx", i * 100 + 20)
        .attr("cy", 25)
        .attr("r", radius)
        .attr("fill", "#21BF61")
        .attr("opacity", 0.6)
        .attr("stroke", "#21BF61")
        .attr("stroke-width", 1);

      sizeLegend.append("text")
        .attr("x", i * 100 + 20)
        .attr("y", 60)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("fill", "#64748b")
        .text(item.label);
    });

    return () => {
      d3.selectAll(".simple-map-tooltip").remove();
    };
  }, [countryData]);

  return <svg ref={svgRef} className="drop-shadow-sm bg-white rounded-lg"></svg>;
};

export default SimpleWorldMap;