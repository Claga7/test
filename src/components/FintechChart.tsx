
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Button } from "@/components/ui/button";

interface FintechStartup {
  id: number;
  name: string;
  country: string;
  foundingYear: number;
  funding: number; // in millions USD
  x?: number;
  y?: number;
}

const FintechChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [metricType, setMetricType] = useState<'count' | 'funding'>('count');

  // Dataset di esempio delle startup fintech
  const startups: FintechStartup[] = [
    { id: 1, name: "Revolut", country: "Regno Unito", foundingYear: 2015, funding: 916 },
    { id: 2, name: "Stripe", country: "Stati Uniti", foundingYear: 2010, funding: 2200 },
    { id: 3, name: "Klarna", country: "Svezia", foundingYear: 2005, funding: 1500 },
    { id: 4, name: "Nubank", country: "Brasile", foundingYear: 2013, funding: 1100 },
    { id: 5, name: "Ant Group", country: "Cina", foundingYear: 2014, funding: 22000 },
    { id: 6, name: "PayPal", country: "Stati Uniti", foundingYear: 1998, funding: 100 },
    { id: 7, name: "Adyen", country: "Paesi Bassi", foundingYear: 2006, funding: 266 },
    { id: 8, name: "SoFi", country: "Stati Uniti", foundingYear: 2011, funding: 4300 },
    { id: 9, name: "Robinhood", country: "Stati Uniti", foundingYear: 2013, funding: 5600 },
    { id: 10, name: "Square", country: "Stati Uniti", foundingYear: 2009, funding: 590 },
    { id: 11, name: "Paymi", country: "Francia", foundingYear: 2017, funding: 45 },
    { id: 12, name: "N26", country: "Germania", foundingYear: 2013, funding: 570 },
    { id: 13, name: "Monzo", country: "Regno Unito", foundingYear: 2015, funding: 500 },
    { id: 14, name: "Coinbase", country: "Stati Uniti", foundingYear: 2012, funding: 547 },
    { id: 15, name: "Wise", country: "Regno Unito", foundingYear: 2011, funding: 396 },
    { id: 16, name: "Razorpay", country: "India", foundingYear: 2014, funding: 366 },
    { id: 17, name: "Paytm", country: "India", foundingYear: 2010, funding: 3400 },
    { id: 18, name: "Mercado Pago", country: "Argentina", foundingYear: 2003, funding: 750 },
    { id: 19, name: "Grab Financial", country: "Singapore", foundingYear: 2016, funding: 850 },
    { id: 20, name: "Toss", country: "Corea del Sud", foundingYear: 2013, funding: 410 },
  ];

  // Raggruppiamo per paese e calcoliamo le metriche
  const getCountryData = () => {
    const countryGroups = d3.group(startups, d => d.country);
    const countryData: any[] = [];
    let id = 1;

    countryGroups.forEach((companies, country) => {
      const totalFunding = d3.sum(companies, d => d.funding);
      const avgYear = d3.mean(companies, d => d.foundingYear) || 2010;
      const count = companies.length;
      
      countryData.push({
        id: id++,
        country,
        avgFoundingYear: avgYear,
        totalFunding,
        startupCount: count,
        companies: companies.map(c => c.name).join(', '),
        value: metricType === 'count' ? count : totalFunding
      });
    });

    return countryData;
  };

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

    const countryData = getCountryData();

    // Creiamo i gruppi principali
    const mainGroup = svg.append("g");
    const connectionsGroup = mainGroup.append("g").attr("class", "connections");
    const nodesGroup = mainGroup.append("g").attr("class", "nodes");
    const centerGroup = mainGroup.append("g").attr("class", "center");

    // Griglia radiale di sfondo
    const gridGroup = mainGroup.append("g").attr("class", "grid").style("opacity", 0.3);
    
    // Cerchi concentrici con etichette anni
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
      
      // Etichette anni
      gridGroup.append("text")
        .attr("x", centerX + r + 5)
        .attr("y", centerY)
        .attr("font-size", "10px")
        .attr("fill", "#64748b")
        .text(yearLabels[i-1]);
    }

    // Linee radiali (una per ogni paese)
    const angleStep = (2 * Math.PI) / countryData.length;
    for (let i = 0; i < countryData.length; i++) {
      const angle = i * angleStep;
      gridGroup.append("line")
        .attr("x1", centerX)
        .attr("y1", centerY)
        .attr("x2", centerX + Math.cos(angle - Math.PI/2) * radius)
        .attr("y2", centerY + Math.sin(angle - Math.PI/2) * radius)
        .attr("stroke", "#e2e8f0")
        .attr("stroke-width", 0.5);
      
      // Etichette paesi
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
        .text(countryData[i].country);
    }

    // Posizionamento radiale dei punti
    countryData.forEach((d, i) => {
      const angle = i * angleStep;
      // Distanza basata sull'anno di fondazione (2025 al centro, 1995 all'esterno)
      const yearDistance = ((2025 - d.avgFoundingYear) / 30) * radius;
      const distance = Math.max(60, Math.min(radius * 0.9, yearDistance));
      
      d.x = centerX + Math.cos(angle - Math.PI/2) * distance;
      d.y = centerY + Math.sin(angle - Math.PI/2) * distance;
    });

    // Scala per i colori
    const colorScale = d3.scaleSequential(d3.interpolateTurbo)
      .domain(d3.extent(countryData, d => d.value) as [number, number]);

    // Scala per la dimensione delle bolle
    const sizeScale = d3.scaleSqrt()
      .domain(d3.extent(countryData, d => d.value) as [number, number])
      .range([15, 60]);

    // Disegnare linee dal centro ai nodi
    countryData.forEach(d => {
      connectionsGroup.append("line")
        .attr("x1", centerX)
        .attr("y1", centerY)
        .attr("x2", d.x!)
        .attr("y2", d.y!)
        .attr("stroke", "#94a3b8")
        .attr("stroke-width", 1)
        .attr("opacity", 0.4);
    });

    // Disegnare i nodi
    const nodes = nodesGroup.selectAll(".node")
      .data(countryData)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x}, ${d.y})`);

    nodes.append("circle")
      .attr("r", d => sizeScale(d.value))
      .attr("fill", d => colorScale(d.value))
      .attr("opacity", 0.7)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 3);

    // Centro del grafico
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
            <strong>${d.country}</strong><br/>
            Anno medio fondazione: ${Math.round(d.avgFoundingYear)}<br/>
            Numero startup: ${d.startupCount}<br/>
            Funding totale: $${d.totalFunding}M<br/>
            <small>Startup: ${d.companies}</small>
          `);
      })
      .on("mousemove", function(event) {
        tooltip
          .style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).select("circle").attr("opacity", 0.7);
        tooltip.style("visibility", "hidden");
      });

  }, [metricType]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-4 flex gap-4">
        <Button 
          onClick={() => setMetricType('count')}
          variant={metricType === 'count' ? 'default' : 'outline'}
        >
          Numero Startup
        </Button>
        <Button 
          onClick={() => setMetricType('funding')}
          variant={metricType === 'funding' ? 'default' : 'outline'}
        >
          Funding Totale
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-xl p-8">
        <svg ref={svgRef} className="drop-shadow-sm"></svg>
        
        {/* Legenda */}
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">
            Startup Fintech per Paese
          </h3>
          <div className="flex justify-center space-x-8 text-sm text-slate-600">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Centro = 2025</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Esterno = 2000</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-3 rounded-full bg-gradient-to-r from-purple-500 to-red-500"></div>
              <span>Dimensione = {metricType === 'count' ? 'N° Startup' : 'Funding ($M)'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FintechChart;
