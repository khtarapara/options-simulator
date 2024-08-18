import React, { useMemo } from "react";
import { Table } from "../../components/Table";
import { css } from "styled-components";
import { BuySellButton } from "../../components/BuySell";
import { TradeStatusButton } from "../StraddleSimulator/StyledComponents";

const tableCSS = {
  row: (row) =>
    !row.isOpen
      ? css`
          background-color: ${row.pL >= 0
            ? "#B8E1CD !important"
            : "#F4CCCC !important"};
        `
      : css``,

  data: ({ row, column }) =>
    column.id === "pL"
      ? css`
          font-weight: bold;
          color: ${row.pL >= 0 ? "#168039" : "#FF0000"};
        `
      : css``,

  footer: ({ column, footer }) =>
    column.id === "pL"
      ? css`
          font-weight: bold;
          color: ${footer >= 0 ? "#168039" : "#FF0000"};
        `
      : css``,
};

export default function ProfitLossTable({
  data,
  onToggleTradeType,
  onTradeToggle,
}) {
  const columns = useMemo(
    () => [
      {
        id: "strike",
        accessor: "strike",
        header: "Strike",
      },
      {
        id: "expiry",
        accessor: "expiry",
        header: "Expiry",
      },
      {
        id: "quantity",
        accessor: "quantity",
        header: "Quantity",
        cell: (row) => {
          return (
            <BuySellButton
              isBuy={row.isBuy}
              onClick={() => onToggleTradeType(row.index)}
            />
          );
        },
      },
      {
        id: "entryPrice",
        accessor: "entryPrice",
        header: "Entry Price",
      },
      {
        id: "ltp",
        accessor: "ltp",
        header: "LTP",
      },
      {
        id: "exitPrice",
        accessor: "exitPrice",
        header: "Exit Price",
      },
      {
        id: "pl",
        accessor: "pl",
        header: "P/L",
        cell: (row) => (row.exitPrice ? row.exitPrice : ""),
      },
      {
        id: "status",
        accessor: "status",
        header: "Status",
        cell: (row) => (
          <TradeStatusButton
            isOpen={row.isOpen}
            onClick={() => onTradeToggle(row.index)}
          />
        ),
      },
    ],
    [onToggleTradeType, onTradeToggle]
  );

  return <Table columns={columns} data={data} css={tableCSS} />;
}
