import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  id: number;
  year: number;
  name: string;
  category: string;
  value: number;
  connections?: number[];
  x?: number;
  y?: number;
}

const RadialChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Dati di esempio che simulano i premi Nobel
  const data: DataPoint[] = [
    { id: 1, year: 1901, name: "Wilhelm Röntgen", category: "X-rays", value: 85 },
    { id: 2, year: 1902, name: "Hendrik Lorentz", category: "Magnetism", value: 70 },
    { id: 3, year: 1903, name: "Henri Becquerel", category: "Radioactivity", value: 90 },
    { id: 4, year: 1904, name: "Lord Rayleigh", category: "Gas density", value: 65 },
    { id: 5, year: 1905, name: "Philipp Lenard", category: "Cathode rays", value: 75 },
    { id: 6, year: 1906, name: "J.J. Thomson", category: "Electron", value: 95 },
    { id: 7, year: 1907, name: "Albert Michelson", category: "Light speed", value: 80 },
    { id: 8, year: 1908, name: "Gabriel Lippmann", category: "Photography", value: 60 },
    { id: 9, year: 1909, name: "Guglielmo Marconi", category: "Wireless", value: 88 },
    { id: 10, year: 1910, name: "Johannes van der Waals", category: "Gas laws", value: 72 },
    { id: 11, year: 1911, name: "Wilhelm Wien", category: "Heat radiation", value: 78 },
    { id: 12, year: 1912, name: "Nils Dalén", category: "Gas regulators", value: 55 },
    { id: 13, year: 1913, name: "Heike Kamerlingh Onnes", category: "Low temperature", value: 82 },
    { id: 14, year: 1914, name: "Max von Laue", category: "X-ray diffraction", value: 86 },
    { id: 15, year: 1915, name: "William Bragg", category: "Crystal structure", value: 84 },
    { id: 16, year: 1917, name: "Charles Barkla", category: "X-ray scattering", value: 76 },
    { id: 17, year: 1918, name: "Max Planck", category: "Quantum theory", value: 100 },
    { id: 18, year: 1919, name: "Johannes Stark", category: "Spectroscopy", value: 74 },
    { id: 19, year: 1920, name: "Charles Guillaume", category: "Nickel alloys", value: 58 },
    { id: 20, year: 1921, name: "Albert Einstein", category: "Photoelectric effect", value: 100 },
    { id: 21, year: 1922, name: "Niels Bohr", category: "Atomic structure", value: 98 },
    { id: 22, year: 1923, name: "Robert Millikan", category: "Electron charge", value: 87 },
    { id: 23, year: 1924, name: "Manne Siegbahn", category: "X-ray spectroscopy", value: 81 },
    { id: 24, year: 1925, name: "James Franck", category: "Electron impact", value: 83 },
    { id: 25, year: 1926, name: "Jean Perrin", category: "Atomic reality", value: 79 },
    { id: 26, year: 1927, name: "Arthur Compton", category: "Compton effect", value: 91 },
    { id: 27, year: 1928, name: "Owen Richardson", category: "Thermionic effect", value: 71 },
    { id: 28, year: 1929, name: "Louis de Broglie", category: "Wave nature", value: 89 },
    { id: 29, year: 1930, name: "Chandrasekhara Raman", category: "Light scattering", value: 85 },
    { id: 30, year: 2021, name: "Syukuro Manabe", category: "Climate modeling", value: 95, connections: [31, 32] },
    { id: 31, year: 2021, name: "Klaus Hasselmann", category: "Climate modeling", value: 95, connections: [30, 32] },
    { id: 32, year: 2021, name: "Giorgio Parisi", category: "Complex systems", value: 92, connections: [30, 31] },
  ];

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
    const gridGroup = mainGroup.append("g").attr("class", "grid").style("opacity", 0.3);
    
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

    // Posizionamento radiale dei punti
    const angleStep = (2 * Math.PI) / data.length;
    
    data.forEach((d, i) => {
      const angle = i * angleStep;
      const distance = radius * 0.85; // Leggermente all'interno del cerchio esterno
      d.x = centerX + Math.cos(angle - Math.PI/2) * distance;
      d.y = centerY + Math.sin(angle - Math.PI/2) * distance;
    });

    // Scala per i colori basata sul valore
    const colorScale = d3.scaleSequential(d3.interpolateViridis)
      .domain(d3.extent(data, d => d.value) as [number, number]);

    // Scala per la dimensione delle bolle
    const sizeScale = d3.scaleSqrt()
      .domain(d3.extent(data, d => d.value) as [number, number])
      .range([8, 40]);

    // Disegnare le connessioni
    data.forEach(d => {
      if (d.connections) {
        d.connections.forEach(connId => {
          const target = data.find(node => node.id === connId);
          if (target) {
            connectionsGroup.append("line")
              .attr("x1", d.x!)
              .attr("y1", d.y!)
              .attr("x2", target.x!)
              .attr("y2", target.y!)
              .attr("stroke", "#6366f1")
              .attr("stroke-width", 2)
              .attr("opacity", 0.6);
          }
        });
      }
    });

    // Disegnare linee dal centro ai nodi
    data.forEach(d => {
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
      .data(data)
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
    const tooltip = d3.select("body").append("div")
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
        
        {/* Legenda */}
        <div className="mt-8 flex justify-center space-x-12 text-sm text-slate-600">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
            <span>High Impact (80-100)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-green-500"></div>
            <span>Medium Impact (60-79)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-yellow-500"></div>
            <span>Standard Impact (40-59)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadialChart;
