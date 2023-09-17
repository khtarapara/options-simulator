import React from "react";
import { FilterContainer, FilterItem } from "./StyledComponents/Filters";
import { StrikePriceSearch } from "./StrikePriceSearch";
import { ExpirySearch } from "./ExpirySearch";
import { StockSearch } from "./StockSearch";
import { TimeFrameSelect } from "./TimeFrameSelect";
import { DateTimePicker } from "./ui/DatePicker";

export default function StraddleForm({ form, onUpdate, timeStamp }) {
  return (
    <FilterContainer>
      <FilterItem>
        <label>Strike</label>
        <StrikePriceSearch
          timeStamp={timeStamp}
          expiry={form.expiry}
          stock={form.index}
          value={form.strikePrice}
          onChange={(strike) => onUpdate("strikePrice", strike)}
        />
      </FilterItem>
      <FilterItem>
        <label>Expiry</label>
        <ExpirySearch
          value={form.expiry}
          onChange={(expiry) => onUpdate("expiry", expiry)}
        />
      </FilterItem>
      <FilterItem>
        <label>Index</label>
        <StockSearch
          value={form.index}
          onChange={(index) => onUpdate("index", index)}
        />
      </FilterItem>
      <FilterItem>
        <label>Time Frame</label>
        <TimeFrameSelect
          value={form.timeFrame}
          onChange={(timeFrame) => onUpdate("timeFrame", timeFrame)}
        />
      </FilterItem>
      <FilterItem>
        <label>Date</label>
        <DateTimePicker
          value={form.date}
          onChange={(time) => onUpdate("date", time)}
        />
      </FilterItem>
    </FilterContainer>
  );
}
