import dayjs from "dayjs";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { Table } from "../../components/Table";
import { getOptionChain } from "../../services/api-services";
import { strToNumberRound } from "../../utils/utils";
import { BuySellButton } from "../../components/BuySell";

const DataControllerContainer = styled.div`
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

const StyledDataControllerButton = styled.button`
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

const StyledContainer = styled.div`
  display: flex;
  justify-content: space-between;
  column-gap: 10px;
`;

const StyledChartContainer = styled.div`
  width: 75%;
  text-align: center;
  font-size: xx-large;
`;

const StyledShowMore = styled.button`
  text-align: center;
  width: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #3b3939;
`;

const StyledTradeSpan = styled.span`
  display: flex;
  justify-content: space-between;
  column-gap: 5px;
`;

const tableCSS = {
  table: css`
    width: 40%;
  `,
  data: ({ row, column }) => {
    console.log({ row, column });
    if (column.id === "callLtp" || column.id === "callTrade") {
      return css`
        background-color: ${row.strike <= row.spot
          ? "#faf7e6 !important"
          : "#FFFFFF !important"};
      `;
    }

    if (column.id === "putLtp" || column.id === "putTrade") {
      return css`
        background-color: ${row.strike >= row.spot
          ? "#faf7e6 !important"
          : "#FFFFFF !important"};
      `;
    }

    return css``;
  },
};

export default function BackTest() {
  const [clippedOptionChain, setClippedOptionChain] = useState([]);
  const [optionChain, setOptionChain] = useState([]);
  const [upperExtraData, setUpperExtraData] = useState([]);
  const [showUpperStrikes, setShowUpperStrikes] = useState(false);
  const [lowerExtraData, setLowerExtraData] = useState([]);
  const [showLowerStrikes, setShowLowerStrikes] = useState(false);
  const [positions, setPositions] = useState([]);

  const openNewBuyPosition = useCallback((newPosition) => {
    setPositions((prev) => {
      const existingPositionIndex = prev.findIndex(
        (item) => item.key === newPosition.key
      );

      if (existingPositionIndex !== -1) {
      }
    });
  }, []);

  const columns = useMemo(
    () => [
      {
        id: "callTrade",
        accessor: "callTrade",
        header: "",
        cell: (row) => (
          <StyledTradeSpan>
            <BuySellButton isBuy />
            <BuySellButton />
          </StyledTradeSpan>
        ),
      },
      {
        id: "callLtp",
        accessor: "callLtp",
        header: "CALL LTP",
        cell: (row) =>
          row.callLtp ? `${row.callLtp} (${row.callDelta})` : "-",
      },
      {
        id: "strike",
        accessor: "strike",
        header: "Strike",
      },
      {
        id: "putLtp",
        accessor: "putLtp",
        header: "PUT LTP",
        cell: (row) => (row.putLtp ? `${row.putLtp} (${row.putDelta})` : "-"),
      },
      {
        id: "putTrade",
        accessor: "putTrade",
        header: "",
        cell: (row) => (
          <StyledTradeSpan>
            <BuySellButton isBuy />
            <BuySellButton />
          </StyledTradeSpan>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    (async () => {
      const res = await getOptionChain({
        timeStamp: 1708314360,
        stock: "NIFTY",
        expiry: "29FEB2024",
      });

      console.log(res.data);

      const tableData = res.data.optionchaindata.map((item) => ({
        callLtp: strToNumberRound(item.CallLTP, 2),
        callDelta: strToNumberRound(item.CallDelta, 2),
        strike: item.Strikes,
        spot: res.data.spotPrice,
        putLtp: strToNumberRound(item.PutLTP, 2),
        putDelta: strToNumberRound(item.PutDelta, 2),
      }));
      console.log({ tableData });

      setOptionChain(
        tableData.filter((item) => Math.abs(item.strike - item.spot) <= 1000)
      );
      setClippedOptionChain(
        tableData.filter((item) => Math.abs(item.strike - item.spot) <= 1000)
      );
      setUpperExtraData(
        tableData.filter((item) => item.strike - item.spot < -1000)
      );
      setLowerExtraData(
        tableData.filter((item) => item.strike - item.spot > 1000)
      );
    })();
  }, []);

  const upperShowMore = useMemo(() => {
    return !showUpperStrikes ? (
      <StyledShowMore
        onClick={() => {
          setOptionChain((prev) => upperExtraData.concat(prev));
          setShowUpperStrikes(true);
        }}
      >
        Show More ^
      </StyledShowMore>
    ) : (
      <StyledShowMore
        onClick={() => {
          setOptionChain(
            showLowerStrikes
              ? clippedOptionChain.concat(lowerExtraData)
              : clippedOptionChain
          );
          setShowUpperStrikes(false);
        }}
      >
        Show Less V
      </StyledShowMore>
    );
  }, [
    showUpperStrikes,
    upperExtraData,
    showLowerStrikes,
    clippedOptionChain,
    lowerExtraData,
  ]);

  const lowerShowMore = useMemo(() => {
    return !showLowerStrikes ? (
      <StyledShowMore
        onClick={() => {
          setOptionChain((prev) => prev.concat(lowerExtraData));
          setShowLowerStrikes(true);
        }}
      >
        Show More v
      </StyledShowMore>
    ) : (
      <StyledShowMore
        onClick={() => {
          setOptionChain(
            showUpperStrikes
              ? upperExtraData.concat(clippedOptionChain)
              : clippedOptionChain
          );
          setShowLowerStrikes(false);
        }}
      >
        Show Less ^
      </StyledShowMore>
    );
  }, [
    clippedOptionChain,
    lowerExtraData,
    showLowerStrikes,
    showUpperStrikes,
    upperExtraData,
  ]);

  return (
    <>
      <div>
        <DataControllerContainer>
          <StyledDataControllerButton
          // disabled={
          //   disableAll ||
          //   loading ||
          //   currentTimeStamp - 120 * 60 < startTimeStamp ||
          //   timeFrame > 120
          // }
          // onClick={() => handleChartForward(-120)}
          >
            2 HOUR &lt;&lt;&lt;
          </StyledDataControllerButton>

          <StyledDataControllerButton
          // disabled={
          //   disableAll ||
          //   loading ||
          //   currentTimeStamp - 60 * 60 < startTimeStamp ||
          //   timeFrame > 60
          // }
          // onClick={() => handleChartForward(-60)}
          >
            1 HOUR &lt;&lt;&lt;
          </StyledDataControllerButton>

          <StyledDataControllerButton
          // disabled={
          //   disableAll ||
          //   loading ||
          //   currentTimeStamp - 30 * 60 < startTimeStamp ||
          //   timeFrame > 30
          // }
          // onClick={() => handleChartForward(-30)}
          >
            30 MIN &lt;&lt;&lt;
          </StyledDataControllerButton>

          <StyledDataControllerButton
          // disabled={
          //   disableAll ||
          //   loading ||
          //   currentTimeStamp - 15 * 60 < startTimeStamp ||
          //   timeFrame > 15
          // }
          // onClick={() => handleChartForward(-15)}
          >
            15 MIN &lt;&lt;
          </StyledDataControllerButton>

          <StyledDataControllerButton
          // disabled={
          //   disableAll ||
          //   loading ||
          //   currentTimeStamp - 5 * 60 < startTimeStamp ||
          //   timeFrame > 5
          // }
          // onClick={() => handleChartForward(-5)}
          >
            5 MIN &lt;
          </StyledDataControllerButton>

          {/* <b>{dayjs(currentTimeStamp * 1000).format("DD-MMM-YYYY HH:mm")}</b> */}
          <b>{dayjs(1709875971 * 1000).format("DD-MMM-YYYY HH:mm")}</b>

          <StyledDataControllerButton
          // disabled={
          //   disableAll ||
          //   loading ||
          //   currentTimeStamp + 5 * 60 > endTimeStamp ||
          //   timeFrame > 5
          // }
          // onClick={() => handleChartForward(5)}
          >
            5 MIN &gt;
          </StyledDataControllerButton>

          <StyledDataControllerButton
          // disabled={
          //   disableAll ||
          //   loading ||
          //   currentTimeStamp + 15 * 60 > endTimeStamp ||
          //   timeFrame > 15
          // }
          // onClick={() => handleChartForward(15)}
          >
            15 MIN &gt;&gt;
          </StyledDataControllerButton>

          <StyledDataControllerButton
          // disabled={
          //   disableAll ||
          //   loading ||
          //   currentTimeStamp + 30 * 60 > endTimeStamp ||
          //   timeFrame > 30
          // }
          // onClick={() => handleChartForward(30)}
          >
            30 MIN &gt;&gt;&gt;
          </StyledDataControllerButton>

          <StyledDataControllerButton
          // disabled={
          //   disableAll ||
          //   loading ||
          //   currentTimeStamp + 60 * 60 > endTimeStamp ||
          //   timeFrame > 60
          // }
          // onClick={() => handleChartForward(60)}
          >
            1 HOUR &gt;&gt;&gt;
          </StyledDataControllerButton>

          <StyledDataControllerButton
          // disabled={
          //   disableAll ||
          //   loading ||
          //   currentTimeStamp + 120 * 60 > endTimeStamp ||
          //   timeFrame > 120
          // }
          // onClick={() => handleChartForward(120)}
          >
            2 HOUR &gt;&gt;&gt;
          </StyledDataControllerButton>
        </DataControllerContainer>

        <StyledContainer>
          <Table
            disableFooter
            columns={columns}
            data={optionChain}
            css={tableCSS}
            upperShowMore={upperShowMore}
            lowerShowMore={lowerShowMore}
          />
          <StyledChartContainer>Chart</StyledChartContainer>
        </StyledContainer>
      </div>
    </>
  );
}
