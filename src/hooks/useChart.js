import dayjs from "dayjs";
import { useCallback, useEffect, useRef, useState } from "react";

export const useChart = ({
  getLTP,
  options = {
    timeFrame: 5,
    date: dayjs(dayjs().format("DD-MM-YYYY"), "DD-MM-YYYY").unix(),
  },
}) => {
  const [startTimeStamp, setStartTimeStamp] = useState(0);
  const [endTimeStamp, setEndTimeStamp] = useState(0);
  const [currentTimeStamp, setCurrentTimeStamp] = useState(0);
  const fetchTimeStampRef = useRef(0);

  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChartForward = useCallback((forwardBy) => {
    setCurrentTimeStamp((prev) => prev + forwardBy * 60);
  }, []);

  useEffect(() => {
    const forwardData = async () => {
      try {
        setLoading(true);
        const step = options.timeFrame * 60;
        const timeStampArray = Array.from(
          { length: (currentTimeStamp - fetchTimeStampRef.current) / step },
          (_, index) => fetchTimeStampRef.current + index * step
        );

        const newData = await Promise.all(
          timeStampArray.map((timeStamp) => getLTP(timeStamp, options))
        );

        setData((prev) => [...prev, ...newData]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const backwardData = () => {
      const step = options.timeFrame * 60;
      const numOfItemsToDelete =
        (fetchTimeStampRef.current - currentTimeStamp) / step;
      setData((prev) => {
        const newData = prev.slice(0, prev.length - numOfItemsToDelete);
        return newData;
      });
    };

    if (
      currentTimeStamp > fetchTimeStampRef.current &&
      currentTimeStamp !== 0 &&
      fetchTimeStampRef.current !== 0
    ) {
      forwardData();
    }

    if (
      currentTimeStamp < fetchTimeStampRef.current &&
      currentTimeStamp !== 0 &&
      fetchTimeStampRef.current !== 0
    ) {
      backwardData();
    }
    fetchTimeStampRef.current = currentTimeStamp;
  }, [currentTimeStamp, options, getLTP]);

  useEffect(() => {
    (async () => {
      if (options.timeFrame > 0) {
        const marketStartTimeStamp = options.date
          .add(9, "hour")
          .add(20, "minute")
          .unix();
        const marketEndTimeStamp = options.date
          .add(15, "hour")
          .add(30, "minute")
          .unix();
        setStartTimeStamp(marketStartTimeStamp);
        setEndTimeStamp(marketEndTimeStamp);
        setCurrentTimeStamp(marketStartTimeStamp);
        fetchTimeStampRef.current = marketStartTimeStamp;
        const startingLTP = await getLTP(marketStartTimeStamp, options);
        if (startingLTP) {
          setData([startingLTP]);
        } else {
          setData([]);
        }
      }
    })();
  }, [getLTP, options]);
  // we want to reset the timestamps on change of strike price.

  // creates labels for chart when time frame or the date is changed.
  useEffect(() => {
    if (startTimeStamp !== 0 && endTimeStamp !== 0) {
      const step = options.timeFrame * 60;
      const timeStampArray = Array.from(
        { length: (endTimeStamp - startTimeStamp) / step + 1 },
        (_, index) => startTimeStamp + index * step
      );

      const newLabels = timeStampArray.map((timeStamp) =>
        dayjs(timeStamp * 1000).format("HH:mm")
      );

      setLabels(newLabels);
    }
  }, [endTimeStamp, options.timeFrame, startTimeStamp]);

  return {
    startTimeStamp,
    endTimeStamp,
    currentTimeStamp,
    labels,
    data,
    loading,
    handleChartForward,
  };
};
