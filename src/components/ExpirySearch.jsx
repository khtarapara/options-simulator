import React, { useEffect, useState } from "react";
import SelectInput from "./ui/SelectInput";
import { getExpiries } from "../services";

export const ExpirySearch = ({ value, onChange }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getExpiries();
        setOptions(
          res.data.map((expiry) => ({
            label: expiry,
            value: expiry,
          }))
        );
      } catch (err) {
        console.error(err);
        setOptions([]);
      }
    })();
  }, []);

  return (
    <SelectInput
      showSearch
      options={options}
      onChange={onChange}
      value={value}
    />
  );
};
