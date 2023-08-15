import React, { useCallback, useEffect, useMemo } from "react";
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
import { Spin, Alert } from "antd";
import { useForm } from "../../hooks/useForm";
import dayjs from "dayjs";
import {
  FilterContainer,
  FilterItem,
} from "../../components/StyledComponents/Filters";
import { StrikePriceSearch } from "../../components/StrikePriceSearch";
import { ExpirySearch } from "../../components/ExpirySearch";
import { StockSearch } from "../../components/StockSearch";
import { TimeFrameSelect } from "../../components/TimeFrameSelect";
import { useChart } from "../../hooks/useChart";
import { round, strToNumberRound } from "../../utils/utils";
import { getOptionChain } from "../../services/api-services";
import { DateTimePicker } from "../../components/ui/DatePicker";
import Tabs from "../../components/ui/Tabs";
import { SpinContainer } from "./StyledComponents";

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

const initForm = {
  strikePrice: null,
  expiry: null,
  index: null,
  timeFrame: 5,
  date: dayjs().startOf("day"),
};

const getLTP = async (timeStamp, options) => {
  if (options.expiry && options.index && options.strikePrice) {
    try {
      const res = await getOptionChain({
        timeStamp,
        stock: options.index.value,
        expiry: options.expiry.value,
      });
      let strikeData = null;
      if (options.strikePrice) {
        strikeData = res.data.optionchaindata.find(
          (item) => item.Strikes === options.strikePrice.value
        );
      }
      const callLTP = strToNumberRound(strikeData?.CallLTP, 2);
      const putLTP = strToNumberRound(strikeData?.PutLTP, 2);

      return {
        straddle: round(callLTP + putLTP, 2),
        future: strToNumberRound(res?.data?.futuresPrice, 2),
        spot: strToNumberRound(res?.data?.spotPrice, 2),
      };
    } catch {
      return {
        straddle: 0,
        future: 0,
        spot: 0,
      };
    }
  }
  return null;
};

export default function StraddleChart() {
  const { form, updateForm } = useForm(initForm);

  const { startTimeStamp, labels, data, loading, handleChartForward } =
    useChart({
      getLTP,
      options: form,
    });

  const options = useMemo(
    () => ({
      responsive: true,
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
    []
  );

  const dataStraddle = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Straddle",
          data: data.map((item) => item.straddle),
          borderColor: "#003f5c",
          backgroundColor: "#003f5c",
        },
      ],
    }),
    [data, labels]
  );

  const dataSpot = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Spot",
          data: data.map((item) => item.spot),
          borderColor: "#bc5090",
          backgroundColor: "#bc5090",
        },
        {
          label: "Future",
          data: data.map((item) => item.future),
          borderColor: "#ffa600",
          backgroundColor: "#ffa600",
        },
      ],
    }),
    [data, labels]
  );

  useEffect(() => {
    if (
      form.strikePrice &&
      form.expiry &&
      form.index &&
      form.timeFrame &&
      form.date
    ) {
      handleChartForward(370);
    }
  }, [form, handleChartForward]);

  const tabContent = useCallback(
    (key) => {
      if (loading) {
        return (
          <SpinContainer>
            <Spin size="large" />
          </SpinContainer>
        );
      }

      if (data.length) {
        const keyToData = {
          straddle: dataStraddle,
          spot: dataSpot,
        };
        return <Line options={options} data={keyToData[key]} />;
      }

      return (
        <Alert
          type="info"
          message="Please Strike, Expiry, and Index."
          showIcon
        />
      );
    },
    [data.length, dataSpot, dataStraddle, loading, options]
  );

  const tabItems = useMemo(
    () => [
      {
        key: "straddle",
        label: "Straddle",
        children: tabContent("straddle"),
      },
      {
        key: "spot",
        label: "Spot/Future",
        children: tabContent("spot"),
      },
    ],
    [tabContent]
  );

  return (
    <>
      <h1>Straddle Chart</h1>
      <FilterContainer>
        <FilterItem>
          <label id="strikePrice">Strike</label>
          <StrikePriceSearch
            timeStamp={startTimeStamp}
            expiry={form.expiry?.value ?? ""}
            stock={form.index?.value ?? ""}
            value={form.strikePrice}
            onChange={(_, newValue) => updateForm("strikePrice", newValue)}
            fullWidth
          />
        </FilterItem>
        <FilterItem>
          <label>Expiry</label>
          <ExpirySearch
            value={form.expiry}
            onChange={(_, newValue) => updateForm("expiry", newValue)}
          />
        </FilterItem>
        <FilterItem>
          <label>Index</label>
          <StockSearch
            value={form.index}
            onChange={(_, newValue) => updateForm("index", newValue)}
          />
        </FilterItem>
        <FilterItem>
          <label>Time Frame</label>
          <TimeFrameSelect
            value={form.timeFrame}
            onChange={(timeFrame) => updateForm("timeFrame", timeFrame)}
          />
        </FilterItem>
        <FilterItem>
          <label>Date</label>
          <DateTimePicker
            value={form.date}
            onChange={(time) => updateForm("date", time)}
          />
        </FilterItem>
      </FilterContainer>

      <Tabs defaultActiveKey="straddle" items={tabItems} />
    </>
  );
}
