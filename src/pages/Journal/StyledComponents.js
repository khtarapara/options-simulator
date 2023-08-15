import { css } from "styled-components";
import styled from "styled-components";

export const SummaryContainer = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 20px;

  margin: 20px;
  flex-wrap: wrap;
`;

export const SummaryCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  width: 190px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  background-color: ${(props) =>
    props.variant === "green"
      ? "#E4F8EC"
      : props.variant === "red"
      ? "#FFEBEB"
      : "#F5F5F5"};
  color: ${(props) =>
    props.variant === "green"
      ? "#168039"
      : props.variant === "red"
      ? "#FF0000"
      : "#000000"};
  border-radius: 10px;
  border: 1px solid
    ${(props) =>
      props.variant === "green"
        ? "#168039"
        : props.variant === "red"
        ? "#FF0000"
        : "#000000"};
  row-gap: 20px;

  font-weight: bold;

  :hover {
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.5);
  }

  label {
    text-align: center;
    color: #000000;
  }
`;

export const ExportButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  column-gap: 10px;
  margin: 20px;
`;

export const tableCSS = {
  row: (row) =>
    css`
      background-color: ${row.pL >= 0
        ? "#E4F8EC !important"
        : "#FFEBEB !important"};

      :hover {
        background-color: ${row.pL >= 0
          ? "#B8E1CD !important"
          : "#F4CCCC !important"};
      }
    `,
  data: ({ row, column }) =>
    column.id === "pL"
      ? css`
          font-weight: bold;
          color: ${row.pL >= 0 ? "#168039" : "#FF0000"};
        `
      : css``,
};
