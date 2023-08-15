import React from "react";
import { Select } from "antd";

export default function SelectInput(props) {
  return (
    <Select
      filterOption={(input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      }
      optionFilterProp="children"
      style={{ width: "100%" }}
      {...props}
    />
  );
}
