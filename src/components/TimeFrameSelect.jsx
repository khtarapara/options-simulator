import React from "react";
import SelectInput from "./ui/SelectInput";

const options = [
  { label: "1m", value: 1 },
  { label: "5m", value: 5 },
  { label: "1h", value: 60 },
];

export const TimeFrameSelect = ({ value, onChange }) => {
  return <SelectInput options={options} onChange={onChange} value={value} />;
};
