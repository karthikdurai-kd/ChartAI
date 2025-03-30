import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { ChartData } from "../utils/chartType";

interface ScatterPlotProps {
  data: ChartData[];
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({ data }) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 1000,
      height = 500,
      margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const xScale = d3
      .scalePoint()
      .domain(data.map((d) => String(d.label)))
      .range([0, chartWidth]);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => Number(d.value)) ?? 0])
      .range([chartHeight, 0]);

    const chartGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    chartGroup
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(String(d.label)) ?? 0)
      .attr("cy", (d) => yScale(Number(d.value)) ?? 0)
      .attr("r", 5)
      .attr("fill", "steelblue");

    chartGroup.append("g").call(d3.axisLeft(yScale));
    chartGroup
      .append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale));
  }, [data]);

  return <svg ref={ref} width={1000} height={500}></svg>;
};

export default ScatterPlot;
