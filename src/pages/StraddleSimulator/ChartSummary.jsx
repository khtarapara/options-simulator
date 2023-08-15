import React from "react";
import { SummaryBox, SummaryItem } from "./StyledComponents";
import { round } from "../../utils/utils";

export default function ChartSummary({ summary }) {
  return (
    <SummaryBox>
      <SummaryItem>
        <label>Spot Price</label>
        <span>:{summary.spot}</span>
      </SummaryItem>
      <SummaryItem>
        <label>High</label> <span>:{summary.high}</span>
      </SummaryItem>
      <SummaryItem>
        <label>Low</label> <span>:{summary.low > 0 ? summary.low : 0}</span>
      </SummaryItem>
      <SummaryItem>
        <label>Change</label>{" "}
        <span>
          :{round(((summary.high - summary.low) * 100) / summary.low, 2) || 0} %
        </span>
      </SummaryItem>
      <SummaryItem>
        <label>Future Price</label> <span>:{summary.future}</span>
      </SummaryItem>
      <SummaryItem>
        <label>Lot Size</label> <span>:{summary.lotSize}</span>
      </SummaryItem>
      <SummaryItem>
        <label>IV</label> <span>:{summary.iv}</span>
      </SummaryItem>
      <SummaryItem>
        <label>Straddle</label> <span>:{summary.straddle}</span>
      </SummaryItem>
      <SummaryItem>
        <label>Call</label> <span>:{summary.call}</span>
      </SummaryItem>
      <SummaryItem>
        <label>Put</label> <span>:{summary.put}</span>
      </SummaryItem>
    </SummaryBox>
  );
}
