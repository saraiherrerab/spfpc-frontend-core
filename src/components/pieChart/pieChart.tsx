// PieChart.tsx
import React from "react";
import "./styles.css";

interface PieChartProps {
  value1: number;
  value2: number;
  color1?: string;
  color2?: string;
}

const PieChart: React.FC<PieChartProps> = ({
  value1,
  value2,
  color1 = "#00AEB5",
  color2 = "#45DFE6",
}) => {
  const total = value1 + value2;
  const angle1 = (value1 / total) * 360;

  return (
    <div className="responsive-pie-chart">
      <div
        className="responsive-pie"
        style={{
          background: `conic-gradient(${color1} 0deg ${angle1}deg, ${color2} ${angle1}deg 360deg)`,
        }}
      >
        <span className="responsive-pie-label">
          {Math.round((value1 / total) * 100)}%
        </span>
      </div>
    </div>
  );
};

export default PieChart;
