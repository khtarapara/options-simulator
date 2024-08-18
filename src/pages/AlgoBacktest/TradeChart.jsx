import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Line } from "react-chartjs-2";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartDataLabels,
  Title,
  Tooltip
);

const timeFromEpoch = (epoch) => moment.unix(epoch).format("HH:mm");

export const TradeChart = ({ entryTimestamp, legs }) => {
  if (legs.length !== 2) {
    throw Error("trade should have only 2 legs.");
  }

  const options = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: false,
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
    []
  );

  const data = useMemo(
    () => ({
      labels: [
        timeFromEpoch(entryTimestamp),
        timeFromEpoch(legs[0].exitTimeStamp),
        timeFromEpoch(legs[1].exitTimeStamp),
      ],
      datasets: [
        {
          data: [legs[0].avgPrice, legs[0].exitPrice, legs[1].exitPrice],
          borderColor: "#ff6361",
          backgroundColor: "#ff6361",
        },
      ],
    }),
    [entryTimestamp, legs]
  );

  return <Line options={options} data={data} />;
};
