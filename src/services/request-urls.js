export const urls = {
  expiries: "/opstra/api/optionsimulator/simulatorexpiries",
  optionChain: ({ timeStamp, stock, expiry }) =>
    `/opstra/api/optionsimulator/optionchain/${timeStamp}&${stock}&${expiry}`,
};
