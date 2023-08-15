import React from "react";
import dayjs from "dayjs";
import {
  DataControllerContainer,
  StyledDataControllerButton,
} from "./StyledComponents";

export default function Controls({
  disableAll,
  loading,
  timeFrame,
  currentTimeStamp,
  startTimeStamp,
  endTimeStamp,
  handleChartForward,
}) {
  return (
    <DataControllerContainer>
      <StyledDataControllerButton
        disabled={
          disableAll ||
          loading ||
          currentTimeStamp - 120 * 60 < startTimeStamp ||
          timeFrame > 120
        }
        onClick={() => handleChartForward(-120)}
      >
        2 HOUR &lt;&lt;&lt;
      </StyledDataControllerButton>

      <StyledDataControllerButton
        disabled={
          disableAll ||
          loading ||
          currentTimeStamp - 60 * 60 < startTimeStamp ||
          timeFrame > 60
        }
        onClick={() => handleChartForward(-60)}
      >
        1 HOUR &lt;&lt;&lt;
      </StyledDataControllerButton>

      <StyledDataControllerButton
        disabled={
          disableAll ||
          loading ||
          currentTimeStamp - 30 * 60 < startTimeStamp ||
          timeFrame > 30
        }
        onClick={() => handleChartForward(-30)}
      >
        30 MIN &lt;&lt;&lt;
      </StyledDataControllerButton>

      <StyledDataControllerButton
        disabled={
          disableAll ||
          loading ||
          currentTimeStamp - 15 * 60 < startTimeStamp ||
          timeFrame > 15
        }
        onClick={() => handleChartForward(-15)}
      >
        15 MIN &lt;&lt;
      </StyledDataControllerButton>

      <StyledDataControllerButton
        disabled={
          disableAll ||
          loading ||
          currentTimeStamp - 5 * 60 < startTimeStamp ||
          timeFrame > 5
        }
        onClick={() => handleChartForward(-5)}
      >
        5 MIN &lt;
      </StyledDataControllerButton>

      <b>{dayjs(currentTimeStamp * 1000).format("DD-MMM-YYYY HH:mm")}</b>

      <StyledDataControllerButton
        disabled={
          disableAll ||
          loading ||
          currentTimeStamp + 5 * 60 > endTimeStamp ||
          timeFrame > 5
        }
        onClick={() => handleChartForward(5)}
      >
        5 MIN &gt;
      </StyledDataControllerButton>

      <StyledDataControllerButton
        disabled={
          disableAll ||
          loading ||
          currentTimeStamp + 15 * 60 > endTimeStamp ||
          timeFrame > 15
        }
        onClick={() => handleChartForward(15)}
      >
        15 MIN &gt;&gt;
      </StyledDataControllerButton>

      <StyledDataControllerButton
        disabled={
          disableAll ||
          loading ||
          currentTimeStamp + 30 * 60 > endTimeStamp ||
          timeFrame > 30
        }
        onClick={() => handleChartForward(30)}
      >
        30 MIN &gt;&gt;&gt;
      </StyledDataControllerButton>

      <StyledDataControllerButton
        disabled={
          disableAll ||
          loading ||
          currentTimeStamp + 60 * 60 > endTimeStamp ||
          timeFrame > 60
        }
        onClick={() => handleChartForward(60)}
      >
        1 HOUR &gt;&gt;&gt;
      </StyledDataControllerButton>

      <StyledDataControllerButton
        disabled={
          disableAll ||
          loading ||
          currentTimeStamp + 120 * 60 > endTimeStamp ||
          timeFrame > 120
        }
        onClick={() => handleChartForward(120)}
      >
        2 HOUR &gt;&gt;&gt;
      </StyledDataControllerButton>
    </DataControllerContainer>
  );
}
