import { Button as ButtonBase } from "antd";

export const Button = (props) => {
  return (
    <ButtonBase style={{ boxShadow: "none" }} {...props}>
      {props.children}
    </ButtonBase>
  );
};
