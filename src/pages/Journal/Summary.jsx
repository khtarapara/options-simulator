import React from "react";
import { useSelector } from "react-redux";
import { round } from "../../utils/utils";
import { SummaryCard, SummaryContainer } from "./StyledComponents";

export const Summary = () => {
  const journal = useSelector((state) => state.journal);

  const totalTrades = journal.length;
  const totalPL = round(
    journal.reduce((accumulator, trade) => accumulator + trade.pL, 0)
  );
  const averagePL = round(totalPL / totalTrades) || 0;

  const profitableTrades = journal.filter((trade) => trade.pL > 0);
  const numProfitableTrades = profitableTrades.length;
  const probProfit = round((numProfitableTrades * 100) / totalTrades) || 0;
  const maxProfit = round(
    profitableTrades.reduce(
      (accumulator, trade) => Math.max(accumulator, trade.pL),
      0
    )
  );
  const totalProfit = round(
    profitableTrades.reduce((accumulator, trade) => accumulator + trade.pL, 0)
  );
  const avgProfit = round(totalProfit / numProfitableTrades) || 0;

  const losingTrades = journal.filter((trade) => trade.pL <= 0);
  const numLosingTrades = losingTrades.length;
  const maxLoss = round(
    losingTrades.reduce(
      (accumulator, trade) => Math.min(accumulator, trade.pL),
      0
    )
  );
  const totalLoss = round(
    losingTrades.reduce((accumulator, trade) => accumulator + trade.pL, 0)
  );
  const avgLoss = round(totalLoss / numLosingTrades) || 0;
  return (
    <SummaryContainer>
      <SummaryCard>
        <label>Total Trades</label>
        <span>{journal.length}</span>
      </SummaryCard>

      <SummaryCard variant={totalPL > 0 ? "green" : "red"}>
        <label>Total P/L</label>
        <span>{totalPL}</span>
      </SummaryCard>

      <SummaryCard variant={averagePL > 0 ? "green" : "red"}>
        <label>Average P/L</label>
        <span>{averagePL}</span>
      </SummaryCard>

      <SummaryCard variant="green">
        <label>Maximum Profit</label>
        <span>{maxProfit}</span>
      </SummaryCard>

      <SummaryCard variant="green">
        <label># of Profitable Trades</label>
        <span>{numProfitableTrades}</span>
      </SummaryCard>

      <SummaryCard variant="green">
        <label>Avg. Profit in Profitable Trade</label>
        <span>{avgProfit}</span>
      </SummaryCard>

      <SummaryCard>
        <label>Prob. of Profit</label>
        <span>{probProfit}%</span>
      </SummaryCard>

      <SummaryCard variant="red">
        <label>Maximum Loss</label>
        <span>{maxLoss}</span>
      </SummaryCard>

      <SummaryCard variant="red">
        <label># of Losing Trades</label>
        <span>{numLosingTrades}</span>
      </SummaryCard>

      <SummaryCard variant="red">
        <label>Avg. Lose in Losing Trade</label>
        <span>{avgLoss}</span>
      </SummaryCard>
    </SummaryContainer>
  );
};
