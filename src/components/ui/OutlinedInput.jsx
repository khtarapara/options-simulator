import React from "react";
import { OutlinedInput as OutlinedInputMUI } from "@mui/material";

const defaultStyle = {
  border: "1px solid black",
  backgroundColor: "white",
};
const OutlinedInput = ({ style, ...rest }) => {
  return <OutlinedInputMUI style={style ?? defaultStyle} {...rest} />;
};

export default OutlinedInput;
