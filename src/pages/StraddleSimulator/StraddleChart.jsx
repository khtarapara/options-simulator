import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Tabs from "../../components/ui/Tabs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartDataLabels,
  Title,
  Tooltip,
  Legend
);

const StraddleChart = ({ labels, data: dataProp, onTradeStart }) => {
  const options = useMemo(
    () => ({
      responsive: true,
      onClick: (_, element, chart) => {
        if (element.length > 0) {
          const datasetIndex = element[0].datasetIndex;
          const dataIndex = element[0].index;
          const spot = dataProp.length && dataProp[dataIndex].spot;
          const dataset = chart.config._config.data.datasets[datasetIndex];
          const label = chart.config._config.data.labels[dataIndex];
          onTradeStart(dataset.label, dataset.data[dataIndex], label, spot);
        }
      },
      plugins: {
        legend: true,
        datalabels: {
          display: "auto",
          color: "black",
          align: "top",
          formatter: Math.round,
          font: {
            size: 10,
          },
        },
      },
    }),
    [dataProp, onTradeStart]
  );

  const dataStraddle = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Straddle",
          data: dataProp.map((item) => item.straddle),
          borderColor: "#003f5c",
          backgroundColor: "#003f5c",
        },
      ],
    }),
    [dataProp, labels]
  );

  const dataCallPut = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Call",
          data: dataProp.map((item) => item.call),
          borderColor: "#00bfa0",
          backgroundColor: "#00bfa0",
        },
        {
          label: "Put",
          data: dataProp.map((item) => item.put),
          borderColor: "#ff6361",
          backgroundColor: "#ff6361",
        },
      ],
    }),
    [dataProp, labels]
  );

  const dataSpot = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Spot",
          data: dataProp.map((item) => item.spot),
          borderColor: "#bc5090",
          backgroundColor: "#bc5090",
        },
        {
          label: "Future",
          data: dataProp.map((item) => item.future),
          borderColor: "#ffa600",
          backgroundColor: "#ffa600",
        },
      ],
    }),
    [dataProp, labels]
  );

  const tabItems = useMemo(
    () => [
      {
        key: "straddle",
        label: "Straddle",
        children: <Line options={options} data={dataStraddle} />,
      },
      {
        key: "callPut",
        label: "Call/Put",
        children: <Line options={options} data={dataCallPut} />,
      },
      {
        key: "spot",
        label: "Spot/Future",
        children: <Line options={options} data={dataSpot} />,
      },
    ],
    [dataCallPut, dataSpot, dataStraddle, options]
  );

  return (
    <>
      <Tabs defaultActiveKey="straddle" items={tabItems} />
    </>
  );
};

export default StraddleChart;
