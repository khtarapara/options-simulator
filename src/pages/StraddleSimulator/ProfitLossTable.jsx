import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Table } from "../../components/Table";
import { Checkbox } from "antd";
import { DeleteTradeButton, TradeStatusButton } from "./StyledComponents";
import { css } from "styled-components";
import { CloseCircleOutlined } from "@ant-design/icons";
import { journalActions } from "../../store/journalSlice";
import { BuySellButton } from "../../components/BuySell";
import { round } from "../../utils/utils";
import { toast } from "react-toastify";
import { Notes } from "./Notes";
import { Button } from "../../components/ui/Button";

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
  onNoteChange,
  onDeleteTrade,
  index,
  expiry,
  date,
}) {
  const dispatch = useDispatch();

  const closedTrades = useMemo(
    () => data.filter((trade) => !trade.isOpen),
    [data]
  );
  const [tradesToSave, setTradesToSave] = useState([]);

  const indeterminate =
    tradesToSave.length > 0 && tradesToSave.length < closedTrades.length;

  const checkAll =
    tradesToSave.length === closedTrades.length && tradesToSave.length !== 0;

  const toggleSaveAll = useCallback(
    (event) => {
      setTradesToSave(event.target.checked ? closedTrades : []);
    },
    [closedTrades]
  );

  const addToSavedTrade = useCallback(
    (trade) => setTradesToSave((prev) => [...prev, trade]),
    []
  );

  const removeFromSavedTrade = useCallback(
    (id) => setTradesToSave((prev) => prev.filter((trade) => trade.id !== id)),
    []
  );

  const columns = useMemo(
    () => [
      {
        id: "instrument",
        accessor: "instrument",
        header: "Instrument",
      },
      {
        id: "tradeType",
        accessor: "tradeType",
        header: "Type",
        cell: (row) => {
          return (
            <BuySellButton
              isBuy={row.isBuy}
              onClick={() => onToggleTradeType(row.index)}
            >
              {row.isBuy ? "B" : "S"}
            </BuySellButton>
          );
        },
      },
      {
        id: "entryTime",
        accessor: "entryTime",
        header: "Entry Time",
      },
      {
        id: "entrySpot",
        accessor: "entrySpot",
        header: "Entry Spot",
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
        cell: (row) => (row.exitPrice ? row.exitPrice : ""),
      },
      {
        id: "exitTime",
        accessor: "exitTime",
        header: "Exit Time",
      },
      {
        id: "exitSpot",
        accessor: "exitSpot",
        header: "Exit Spot",
        cell: (row) => (row.exitSpot ? row.exitSpot : ""),
      },
      {
        id: "pL",
        accessor: "pL",
        header: "P/L",
        footer: () =>
          data.reduce((accumulator, trade) => accumulator + trade.pL, 0),
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
      {
        id: "notes",
        accessor: "notes",
        header: "Notes",
        cell: (row) => (
          <Notes
            value={row.notes}
            onSet={(newNote) => onNoteChange(row.id, newNote)}
          />
        ),
      },
      {
        id: "delete",
        accessor: "delete",
        header: "Delete",
        cell: (row) => (
          <DeleteTradeButton onClick={() => onDeleteTrade(row.index)}>
            <CloseCircleOutlined />
          </DeleteTradeButton>
        ),
      },
      {
        id: "save",
        accessor: "save",
        header: () => {
          return (
            <span>
              Save{" "}
              <Checkbox
                indeterminate={indeterminate}
                checked={checkAll}
                onChange={toggleSaveAll}
              />
            </span>
          );
        },
        cell: (row) => {
          return (
            <Checkbox
              checked={
                tradesToSave.findIndex((trade) => trade.id === row.id) > -1
              }
              disabled={row.isOpen}
              onChange={(event) =>
                event.target.checked
                  ? addToSavedTrade(row)
                  : removeFromSavedTrade(row.id)
              }
            />
          );
        },
        footer: (
          <Button
            type="primary"
            onClick={() => {
              const trades = tradesToSave.map(
                ({ instrument, isBuy, entrySpot, exitSpot, pL, notes }) => ({
                  index,
                  instrument,
                  expiry,
                  date,
                  isBuy,
                  entrySpot,
                  exitSpot,
                  change: round(((exitSpot - entrySpot) * 100) / entrySpot),
                  pL,
                  notes,
                })
              );

              dispatch(journalActions.addTrade(trades));
              toast.success("Saved trades to Journal.");
            }}
          >
            Save to Journal
          </Button>
        ),
      },
    ],
    [
      addToSavedTrade,
      checkAll,
      data,
      date,
      dispatch,
      expiry,
      indeterminate,
      index,
      onDeleteTrade,
      onNoteChange,
      onToggleTradeType,
      onTradeToggle,
      removeFromSavedTrade,
      toggleSaveAll,
      tradesToSave,
    ]
  );

  return <Table columns={columns} data={data} css={tableCSS} />;
}
