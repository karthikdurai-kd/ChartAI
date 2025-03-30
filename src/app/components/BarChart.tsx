import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { ChartData } from "../utils/chartType";

interface BarChartProps {
  data: ChartData[];
  labelColumn: string;
  valueColumn: string;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  labelColumn,
  valueColumn,
}) => {
  console.log("BarChart data:", data);
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 1000;
    const height = 500;
    svg.attr("width", width).attr("height", height);

    const margin = { top: 20, right: 30, bottom: 150, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Scale for the x-axis
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => String(d[labelColumn]))) // Convert to string
      .range([0, chartWidth])
      .padding(0.2);

    // Scale for the y-axis
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => Number(d[valueColumn])) ?? 0])
      .range([chartHeight, 0]);

    // Group for the chart
    const chartGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    chartGroup
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(String(d[labelColumn])) || 0)
      .attr("y", (d) => yScale(Number(d[valueColumn])) || 0)
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => chartHeight - yScale(Number(d[valueColumn])))
      .attr("fill", "steelblue")
      .attr("class", "bar")
      .style("transition", "all 0.3s ease");

    // Add hover effect on bars
    chartGroup
      .selectAll("rect")
      .on("mouseover", function () {
        d3.select(this).transition().duration(300).attr("fill", "orange");
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(300).attr("fill", "steelblue");
      });

    chartGroup
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-45)") // Rotate labels
      .style("font-size", "14px")
      .style("font-family", "Arial, sans-serif")
      .style("fill", "#333");

    chartGroup
      .append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("font-size", "14px")
      .style("font-family", "Arial, sans-serif")
      .style("fill", "#333");

    // Add axis labels
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", margin.left / 40)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text(`${valueColumn}`);

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom / 2)
      .style("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text(`${labelColumn}`);

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "rgba(0, 0, 0, 0.7)")
      .style("color", "white")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("display", "none");

    chartGroup
      .selectAll("rect")
      .on("mouseover", (event, d) => {
        tooltip
          .style("display", "block")
          .html(
            `${labelColumn}: ${String(
              (d as ChartData)[labelColumn]
            )}<br/>${valueColumn}: ${String((d as ChartData)[valueColumn])}`
          )
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        tooltip.style("display", "none");
      });
  }, [data, labelColumn, valueColumn]);

  return <svg ref={ref}></svg>;
};

export default BarChart;
