import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { ChartData } from "../utils/chartType";

interface PieChartProps {
  data: ChartData[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const ref = useRef<SVGSVGElement | null>(null);
  console.log("PieChart data is:", data);
  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 500,
      height = 500,
      radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie<ChartData>().value((d) => Number(d.value));
    const arc = d3
      .arc<d3.PieArcDatum<ChartData>>()
      .innerRadius(0)
      .outerRadius(radius);

    const chartGroup = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const arcs = chartGroup
      .selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i.toString()));

    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .text((d) => `${d.data.label}: ${d.data.value}`);
  }, [data]);

  return <svg ref={ref}></svg>;
};

export default PieChart;
