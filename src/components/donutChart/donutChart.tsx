// components/DonutChart.tsx
import React from "react";
import "./styles.css";

interface DonutChartProps {
  percentage1: number;
  percentage2: number;
  color1?: string;
  color2?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({
  percentage1,
  percentage2,
  color1 = "#00AEB5",
  color2 = "#45DFE6",
}) => {
  const total = percentage1 + percentage2;
  const deg1 = (percentage1 / total) * 360;

  return (
    <div className="donut-wrapper">
      <div
        className="donut"
        style={{
          background: `conic-gradient(${color1} 0deg ${deg1}deg, ${color2} ${deg1}deg 360deg)`,
        }}
      />
      <div className="donut-center">
        <span>{percentage1}%</span>
      </div>
    </div>
  );
};

export default DonutChart;
