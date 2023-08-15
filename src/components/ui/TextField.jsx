import React from "react";
import { TextField as TextFieldMUI } from "@mui/material";

const defaultStyle = {
  backgroundColor: "white",
  borderRadius: "5px",
};
const TextField = ({ style, ...rest }) => {
  return <TextFieldMUI style={style ?? defaultStyle} {...rest} />;
};

export default TextField;
