import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import React from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { useTheme } from "@mui/material";
import { getLast7Days } from "../../lib/features";

ChartJS.register(
  Tooltip,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  ArcElement,
  Legend
);

const labels = getLast7Days();

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },

  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};

const LineChart = ({ value = [] }) => {
  const theme = useTheme();
  const data = {
    labels,
    datasets: [
      {
        data: value,
        label: "Messages",
        fill: true,
        backgroundColor: `${theme.palette.primary.main}20`,
        borderColor: theme.palette.primary.main,
        tension: 0.35,
        pointRadius: 3,
      },
    ],
  };

  const options = { ...lineChartOptions, scales: {
    x: { ...lineChartOptions.scales.x, ticks: { color: theme.palette.text.secondary } },
    y: { ...lineChartOptions.scales.y, ticks: { color: theme.palette.text.secondary, precision: 0 } },
  } };
  return <Line data={data} options={options} />;
};

const doughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: "70%",
};

const DoughnutChart = ({ value = [], labels = [] }) => {
  const theme = useTheme();
  const data = {
    labels,
    datasets: [
      {
        data: value,
        backgroundColor: [theme.palette.primary.main, "#438bc2"],
        hoverBackgroundColor: [theme.palette.primary.main, "#60a5d5"],
        borderColor: theme.palette.background.paper,
        borderWidth: 3,
        offset: 0,
      },
    ],
  };
  return (
    <Doughnut
      style={{ zIndex: 10 }}
      data={data}
      options={doughnutChartOptions}
    />
  );
};

export { DoughnutChart, LineChart };
