import React, { useMemo } from "react";
import { Table } from "antd";
import { fakeData } from "./fakeData";
import moment from "moment";
import { TradeChart } from "./TradeChart";

export const PLTable = () => {
  const yearColumns = useMemo(
    () => [
      {
        title: "Year",
        dataIndex: "year",
        key: "year",
      },
      {
        title: "P/L",
        dataIndex: "pl",
        key: "pl",
      },
    ],
    []
  );

  const monthColumns = useMemo(
    () => [
      {
        title: "Month",
        dataIndex: "month",
        key: "month",
      },
      {
        title: "P/L",
        dataIndex: "pl",
        key: "pl",
      },
    ],
    []
  );

  const tradesColumn = useMemo(
    () => [
      {
        title: "Date",
        dataIndex: "entryTimestamp",
        key: "entryTimestamp",
        render: (_, { entryTimestamp }) =>
          moment.unix(entryTimestamp).format("DD"),
      },
      {
        title: "P/L",
        dataIndex: "pl",
        key: "pl",
      },
    ],
    []
  );

  const tradesExpandable = useMemo(
    () => ({
      rowExpandable: (record) =>
        record.entryTimestamp !== 0 && record.legs.length > 0,
      expandedRowRender: ({ entryTimestamp, legs }) => (
        <TradeChart entryTimestamp={entryTimestamp} legs={legs} />
      ),
    }),
    []
  );

  const monthExpandable = useMemo(
    () => ({
      rowExpandable: ({ trades }) => trades.length > 0,
      expandedRowRender: ({ trades }) => {
        return (
          <Table
            columns={tradesColumn}
            dataSource={trades}
            expandable={tradesExpandable}
            pagination={false}
            showHeader={false}
          />
        );
      },
    }),
    [tradesColumn, tradesExpandable]
  );

  const yearExpandable = useMemo(
    () => ({
      rowExpandable: ({ months }) => months.length > 0,
      expandedRowRender: ({ months }) => {
        return (
          <Table
            columns={monthColumns}
            dataSource={months}
            expandable={monthExpandable}
            pagination={false}
            showHeader={false}
          />
        );
      },
    }),
    [monthColumns, monthExpandable]
  );

  return (
    <Table
      columns={yearColumns}
      dataSource={fakeData.data.trades}
      expandable={yearExpandable}
      pagination={false}
    />
  );
};
