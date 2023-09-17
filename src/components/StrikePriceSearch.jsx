import React, { useEffect, useState } from "react";
import SelectInput from "./ui/SelectInput";
import { getOptionChain } from "../services/api-services";

export const StrikePriceSearch = ({
  value,
  onChange,
  timeStamp = 0,
  stock,
  expiry,
}) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        if (stock && expiry && timeStamp) {
          const res = await getOptionChain({ timeStamp, stock, expiry });
          const strikes = res.data.optionchaindata.map((item) => ({
            label: String(item.Strikes),
            value: item.Strikes,
          }));
          setOptions(strikes);
        }
      } catch (err) {
        console.error(err);
        setOptions([]);
      }
    })();
  }, [expiry, stock, timeStamp]);

  return (
    <SelectInput
      showSearch
      options={options}
      onChange={onChange}
      value={value}
    />
  );
};
