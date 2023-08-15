import styled from "styled-components";

const Button = styled.button`
  background: transparent;
  cursor: pointer;
  border-radius: 3px;
  color: ${(props) => (props.isBuy ? "#66A782" : "#CD6F6F")};
  border: 1px solid ${(props) => (props.isBuy ? "#66A782" : "#CD6F6F")};
`;

const Span = styled.span`
  background: transparent;
  border-radius: 3px;
  padding: 2px 5px;
  color: ${(props) => (props.isBuy ? "#66A782" : "#CD6F6F")};
  border: 1px solid ${(props) => (props.isBuy ? "#66A782" : "#CD6F6F")};
`;

export const BuySellButton = ({ isBuy, ...rest }) => {
  return (
    <Button isBuy={isBuy} {...rest}>
      {isBuy ? "B" : "S"}
    </Button>
  );
};

export const BuySellIcon = ({ isBuy, ...rest }) => {
  return (
    <Span isBuy={isBuy} {...rest}>
      {isBuy ? "B" : "S"}
    </Span>
  );
};
