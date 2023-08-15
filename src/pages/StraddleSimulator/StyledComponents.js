import styled from "styled-components";

export const DataControllerContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #ffffff;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  column-gap: 10px;
  padding: 20px;
`;

export const StyledDataControllerButton = styled.button`
  background-color: ${(props) => (props.disabled ? "#F3F3F6" : "#c1c5d2")};
  color: ${(props) => (props.disabled ? "#0000009F" : "#000000")};
  border: 1px solid #000000;
  border-radius: 5px;
  padding: 5px 20px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.3s ease;
  box-shadow: ${(props) =>
    props.disabled ? "none" : "0 3px 5px rgba(0, 0, 0, 0.1)"};

  :hover {
    background-color: ${(props) => (props.disabled ? "#F3F3F6" : "#a9adb9")};
    box-shadow: ${(props) =>
      props.disabled ? "none" : "0 6px 8px rgba(0, 0, 0, 0.2)"};
  }
`;

export const ChartContainer = styled.div`
  display: grid;
  column-gap: 20px;
  grid-template-columns: 200px auto;
  margin-bottom: 20px;
`;

export const SummaryBox = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
`;

export const SummaryItem = styled.div`
  width: 100%;
  color: #3e605b;
  font-family: "Arial", sans-serif;
  display: flex;

  label {
    color: #08174b;
    text-align: left;
    width: 60%;
  }

  span {
    width: 40%;
    text-align: left;
  }
`;

export const TradeTypeButton = styled.button`
  background: transparent;
  cursor: pointer;
  border-radius: 3px;
  color: ${(props) => (props.isBuy ? "#66A782" : "#CD6F6F")};
  border: 1px solid ${(props) => (props.isBuy ? "#66A782" : "#CD6F6F")};
`;

export const TradeStatusButton = styled.button`
  border-radius: 50%;
  height: 20px;
  width: 20px;
  cursor: pointer;
  border: none;
  background-color: ${(props) => (props.isOpen ? "#168039" : "#FF0000")};
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);

  :hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  }
`;

export const DeleteTradeButton = styled.button`
  background: transparent;
  color: #cd6f6f;
  cursor: pointer;
  border: none;
  font-size: large;
`;

export const NotesContainer = styled.div`
  display: flex;
  column-gap: 10px;
`;
