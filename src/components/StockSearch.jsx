import React from "react";
import SelectInput from "./ui/SelectInput";

const options = [
  { label: "NIFTY", value: "NIFTY" },
  { label: "BANKNIFTY", value: "BANKNIFTY" },
];

export const StockSearch = ({ value, onChange }) => {
  return (
    <SelectInput
      showSearch
      options={options}
      onChange={onChange}
      value={value}
    />
  );
};
