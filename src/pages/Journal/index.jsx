import React, { useCallback, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "../../components/Table";
import { BuySellIcon } from "../../components/BuySell";
import { ExportButtonContainer, tableCSS } from "./StyledComponents";
import dayjs from "dayjs";
import { useDownloadExcel } from "react-export-table-to-excel";
import {
  DeleteOutlined,
  DownloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Summary } from "./Summary";
import { readExcel, round } from "../../utils/utils";
import { journalActions } from "../../store/journalSlice";
import { Button } from "../../components/ui/Button";

export default function Journal() {
  const tableRef = useRef(null);
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Journal",
    sheet: "Journal",
  });

  const journal = useSelector((state) => state.journal);

  const columns = useMemo(
    () => [
      {
        id: "index",
        accessor: "index",
        header: "Index",
      },
      {
        id: "instrument",
        accessor: "instrument",
        header: "Instrument",
      },
      {
        id: "expiry",
        accessor: "expiry",
        header: "Expiry",
      },
      {
        id: "date",
        accessor: "date",
        header: "Date",
        cell: (row) => dayjs(row.date * 1000).format("DD-MMM-YYYY"),
      },
      {
        id: "type",
        accessor: "type",
        header: "Type",
        cell: (row) => <BuySellIcon isBuy={row.isBuy} />,
      },
      {
        id: "entrySpot",
        accessor: "entrySpot",
        header: "Entry Spot",
      },
      {
        id: "exitSpot",
        accessor: "exitSpot",
        header: "Exit Spot",
      },
      {
        id: "change",
        accessor: "change",
        header: "Change",
        cell: (row) => `${row.change}%`,
      },
      {
        id: "pL",
        accessor: "pL",
        header: "P/L",
      },
      {
        id: "notes",
        accessor: "notes",
        header: "Notes",
      },
    ],
    []
  );

  const handleClick = useCallback(() => fileInputRef.current.click(), []);

  const handleFileUpload = useCallback(
    async (event) => {
      try {
        const file = event.target.files[0];
        const fileData = await readExcel(file);
        const parsedData = fileData.map((row) => {
          let incomingDateFormat = "DD-MMM-YYYY";
          let incomingExpiryFormat = "DDMMMYYYY";
          if (
            file.type === "application/vnd.ms-excel" ||
            file.type === "text/csv"
          ) {
            incomingDateFormat = "M/D/YY";
            incomingExpiryFormat = "M/D/YY";
          }

          const index = row["Index"] || "";
          const instrument = row["Instrument"] || "";
          const expiry =
            dayjs(row["Expiry"], incomingExpiryFormat).format("DDMMMYYYY") ||
            "";
          const date = dayjs(row["Date"], incomingDateFormat).unix() || 0;
          const isBuy = row["Type"] === "S" || row["Type"] === "s";
          const entrySpot = round(Number(row["Entry Spot"])) || 0;
          const exitSpot = round(Number(row["Exit Spot"])) || 0;
          const change = round(((exitSpot - entrySpot) * 100) / entrySpot) || 0;
          const pL = round(Number(row["P/L"]));
          const notes = row["Notes"] || "";
          return {
            index,
            instrument,
            expiry,
            date,
            isBuy,
            entrySpot,
            exitSpot,
            change,
            pL,
            notes,
          };
        });
        dispatch(journalActions.import(parsedData));
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch]
  );

  const handleClear = useCallback(() => {
    dispatch(journalActions.clear());
  }, [dispatch]);

  return (
    <>
      <h1>Journal</h1>
      <Summary />
      <ExportButtonContainer>
        <Button
          onClick={handleClear}
          type="primary"
          shape="circle"
          size="large"
          icon={<DeleteOutlined />}
        />
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<UploadOutlined />}
          onClick={handleClick}
        />
        <input
          ref={fileInputRef}
          onChange={handleFileUpload}
          type="file"
          style={{ display: "none" }}
        />
        <Button
          type="primary"
          onClick={onDownload}
          shape="circle"
          icon={<DownloadOutlined />}
          size="large"
        />
      </ExportButtonContainer>
      <Table
        ref={tableRef}
        disableFooter
        columns={columns}
        data={journal}
        css={tableCSS}
      />
    </>
  );
}
