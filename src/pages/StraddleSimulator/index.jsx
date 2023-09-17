import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import dayjs from "dayjs";
import { cloneDeep } from "loadsh";
import StraddleChart from "./StraddleChart";
import { getOptionChain } from "../../services/api-services";
import { ChartContainer } from "./StyledComponents";
import ProfitLossTable from "./ProfitLossTable";
import { round, strToNumberRound } from "../../utils/utils";
import Controls from "./Controls";
import ChartSummary from "./ChartSummary";
import { useChart } from "../../hooks/useChart";
import { useForm } from "../../hooks/useForm";
import StraddleForm from "../../components/StraddleForm";

const tradeActions = {
  ADD: "ADD",
  TOGGLE_TYPE: "TOGGLE_TYPE",
  TOGGLE: "TOGGLE",
  UPDATE_PL: "UPDATE_PL",
  UPDATE_NOTE: "UPDATE_NOTE",
  DELETE: "DELETE",
};

const tradeReducer = (state, { type, payload }) => {
  switch (type) {
    case tradeActions.ADD: {
      return { nextId: state.nextId + 1, trades: [...state.trades, payload] };
    }

    case tradeActions.UPDATE_PL: {
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
    }

    case tradeActions.TOGGLE: {
      const { index, exitTime, summary } = payload;
      const newTrades = cloneDeep(state.trades);

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
    }

    case tradeActions.DELETE: {
      return {
        ...state,
        trades: state.trades.filter((_, index) => index !== payload),
      };
    }

    case tradeActions.TOGGLE_TYPE: {
      const newTrades = cloneDeep(state.trades);
      const tradeToToggle = newTrades[payload];

      tradeToToggle.isBuy = !tradeToToggle.isBuy;
      tradeToToggle.pL = tradeToToggle.pL * -1;
      newTrades[payload] = tradeToToggle;
      return { ...state, trades: newTrades };
    }

    case tradeActions.UPDATE_NOTE: {
      const newTrades = cloneDeep(state.trades);
      const { id, notes } = payload;
      const tradeIndex = state.trades.findIndex((trade) => trade.id === id);
      if (tradeIndex !== -1) {
        const updatedTrade = newTrades[tradeIndex];
        updatedTrade.notes = notes;
        newTrades[tradeIndex] = updatedTrade;
      }
      return { ...state, trades: newTrades };
    }

    default: {
      return state;
    }
  }
};

const getLTP = async (timeStamp, options) => {
  if (options.expiry && options.index && options.strikePrice) {
    try {
      const res = await getOptionChain({
        timeStamp,
        stock: options.index,
        expiry: options.expiry,
      });
      let strikeData = null;
      if (options.strikePrice) {
        strikeData = res.data.optionchaindata.find(
          (item) => item.Strikes === options.strikePrice
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
  strikePrice: "",
  expiry: "",
  index: "",
  timeFrame: 5,
  date: dayjs().startOf("day"),
};

const initialSummary = {
  spot: 0,
  high: 0,
  low: 0,
  future: 0,
  lotSize: 0,
  iv: 0,
  straddle: 0,
  call: 0,
  put: 0,
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

  const [summary, setSummary] = useState(initialSummary);

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

  const ltp = useMemo(
    () => (data.slice(-1).length > 0 ? data.slice(-1)[0] : null),
    [data]
  );

  // Sync the summary with Data
  useEffect(() => {
    if (ltp) {
      setSummary((prev) => {
        return {
          ...ltp,
          high: Math.max(ltp.spot, prev.high),
          low: prev.low ? Math.min(ltp.spot, prev.low) : ltp.spot,
        };
      });
    }
  }, [ltp]);

  // Sync trades with Data
  useEffect(() => {
    if (ltp) {
      dispatch({ type: tradeActions.UPDATE_PL, payload: ltp });
    }
  }, [ltp]);

  return (
    <>
      <h1>Straddle Simulator</h1>

      <StraddleForm
        form={form}
        onUpdate={updateForm}
        timeStamp={startTimeStamp}
      />

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
          index={form.index}
          expiry={form.expiry}
          date={form.date.unix()}
        />
      )}
    </>
  );
}
