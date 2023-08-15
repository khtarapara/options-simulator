import React, { useCallback, useEffect, useReducer, useState } from "react";
import dayjs from "dayjs";
import { cloneDeep } from "loadsh";
import { ExpirySearch } from "../../components/ExpirySearch";
import { StockSearch } from "../../components/StockSearch";
import { TimeFrameSelect } from "../../components/TimeFrameSelect";
import { DateTimePicker } from "../../components/ui/DatePicker";
import { StrikePriceSearch } from "../../components/StrikePriceSearch";
import StraddleChart from "./StraddleChart";
import { getOptionChain } from "../../services/api-services";
import { ChartContainer } from "./StyledComponents";
import ProfitLossTable from "./ProfitLossTable";
import { round, strToNumberRound } from "../../utils/utils";
import Controls from "./Controls";
import ChartSummary from "./ChartSummary";
import { useChart } from "../../hooks/useChart";
import {
  FilterContainer,
  FilterItem,
} from "../../components/StyledComponents/Filters";
import { useForm } from "../../hooks/useForm";

const tradeActions = {
  ADD: "ADD",
  TOGGLE_TYPE: "TOGGLE_TYPE",
  TOGGLE: "TOGGLE",
  UPDATE_PL: "UPDATE_PL",
  UPDATE_NOTE: "UPDATE_NOTE",
  DELETE: "DELETE",
};

const tradeReducer = (state, { type, payload }) => {
  const newTrades = cloneDeep(state.trades);
  switch (type) {
    case tradeActions.ADD:
      return { nextId: state.nextId + 1, trades: [...state.trades, payload] };

    case tradeActions.UPDATE_PL:
      const updatedTrades = state.trades.map((trade) => {
        const ltp = payload[trade.instrument.toLowerCase()];
        const multiplier = trade.isBuy ? 1 : -1;
        const pL = trade.isOpen
          ? round((ltp - trade.entryPrice) * payload.lotSize * multiplier, 2)
          : trade.pL;
        return {
          ...trade,
          ltp,
          pL,
        };
      });
      return { ...state, trades: updatedTrades };

    case tradeActions.TOGGLE:
      const { index, exitTime, summary } = payload;
      let tradeToUpdate = newTrades[index];
      if (tradeToUpdate.isOpen) {
        tradeToUpdate = {
          ...tradeToUpdate,
          exitPrice: tradeToUpdate.ltp,
          isOpen: false,
          exitSpot: summary.spot,
          exitTime,
        };
      } else {
        const ltp = summary[tradeToUpdate.instrument.toLowerCase()];
        const multiplier = tradeToUpdate.isBuy ? 1 : -1;
        tradeToUpdate = {
          ...tradeToUpdate,
          ltp,
          exitPrice: 0,
          pL: round(
            (ltp - tradeToUpdate.entryPrice) * summary.lotSize * multiplier,
            2
          ),
          exitTime: "",
          exitSpot: 0,
          isOpen: true,
        };
      }

      newTrades[index] = tradeToUpdate;
      return { ...state, trades: newTrades };

    case tradeActions.DELETE:
      return {
        ...state,
        trades: state.trades.filter((_, index) => index !== payload),
      };

    case tradeActions.TOGGLE_TYPE:
      const tradeToToggle = newTrades[payload];
      tradeToToggle.isBuy = !tradeToToggle.isBuy;
      tradeToToggle.pL = tradeToToggle.pL * -1;
      newTrades[payload] = tradeToToggle;
      return { ...state, trades: newTrades };

    case tradeActions.UPDATE_NOTE:
      const { id, notes } = payload;
      const oldTradeIndex = state.trades.findIndex((trade) => trade.id === id);
      if (oldTradeIndex !== -1) {
        const updatedTrade = newTrades[oldTradeIndex];
        updatedTrade.notes = notes;
        newTrades[oldTradeIndex] = updatedTrade;
      }
      return { ...state, trades: newTrades };

    default:
      return state;
  }
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
        call: callLTP,
        put: putLTP,
        future: strToNumberRound(res?.data?.futuresPrice, 2),
        spot: strToNumberRound(res?.data?.spotPrice, 2),
        lotSize: strToNumberRound(res?.data?.lotsize, 2),
        iv: strToNumberRound(res?.data?.iv, 2),
      };
    } catch {
      return {
        straddle: 0,
        call: 0,
        put: 0,
        future: 0,
        spot: 0,
        lotSize: 0,
        iv: 0,
      };
    }
  }
  return null;
};

const initForm = {
  strikePrice: null,
  expiry: null,
  index: null,
  timeFrame: 5,
  date: dayjs().startOf("day"),
};

export default function Straddle() {
  const { form, updateForm } = useForm(initForm);

  const {
    startTimeStamp,
    endTimeStamp,
    currentTimeStamp,
    labels,
    data,
    loading,
    handleChartForward,
  } = useChart({ getLTP, options: form });

  const [summary, setSummary] = useState({
    spot: 0,
    high: 0,
    low: 0,
    future: 0,
    lotSize: 0,
    iv: 0,
    straddle: 0,
    call: 0,
    put: 0,
  });

  const [{ nextId, trades }, dispatch] = useReducer(tradeReducer, {
    nextId: 1,
    trades: [],
  });

  const addTrade = useCallback(
    (instrument, entryPrice, label, spot) => {
      const newTrade = {
        id: nextId,
        instrument,
        entryPrice,
        entrySpot: spot,
        entryTime: label,
        ltp: summary[instrument.toLowerCase()],
        exitPrice: 0,
        pL: round(
          (summary[instrument.toLowerCase()] - entryPrice) * summary.lotSize,
          2
        ),
        exitSpot: 0,
        exitTime: "",
        isOpen: true,
        isBuy: true,
      };
      dispatch({ type: tradeActions.ADD, payload: newTrade });
    },
    [nextId, summary]
  );

  const toggleTradeStatus = useCallback(
    (index) => {
      dispatch({
        type: tradeActions.TOGGLE,
        payload: {
          index,
          exitTime: dayjs(currentTimeStamp * 1000).format("HH:mm"),
          summary,
        },
      });
    },
    [currentTimeStamp, summary]
  );

  const toggleTradeType = useCallback((index) => {
    dispatch({ type: tradeActions.TOGGLE_TYPE, payload: index });
  }, []);

  const handleNoteChange = useCallback((id, notes) => {
    dispatch({ type: tradeActions.UPDATE_NOTE, payload: { id, notes } });
  }, []);

  const deleteTrade = useCallback((index) => {
    dispatch({ type: tradeActions.DELETE, payload: index });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const lastData = data[data.length - 1];
      setSummary((prev) => {
        return {
          ...lastData,
          high: Math.max(lastData.spot, prev.high),
          low: prev.low ? Math.min(lastData.spot, prev.low) : lastData.spot,
        };
      });

      dispatch({ type: tradeActions.UPDATE_PL, payload: lastData });
    }
  }, [data]);

  return (
    <>
      <h1>Straddle Simulator</h1>
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

      <Controls
        disableAll={!form.strikePrice}
        loading={loading}
        timeFrame={form.timeFrame}
        currentTimeStamp={currentTimeStamp}
        startTimeStamp={startTimeStamp}
        endTimeStamp={endTimeStamp}
        handleChartForward={handleChartForward}
      />

      <ChartContainer>
        <ChartSummary summary={summary} />
        <StraddleChart labels={labels} data={data} onTradeStart={addTrade} />
      </ChartContainer>
      {trades.length > 0 && (
        <ProfitLossTable
          data={trades}
          onToggleTradeType={toggleTradeType}
          onTradeToggle={toggleTradeStatus}
          onNoteChange={handleNoteChange}
          onDeleteTrade={deleteTrade}
          index={form.index.value}
          expiry={form.expiry.value}
          date={form.date.unix()}
        />
      )}
    </>
  );
}
