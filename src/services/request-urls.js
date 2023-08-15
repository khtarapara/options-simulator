export const urls = {
  expiries: "/optionsimulator/simulatorexpiries",
  optionChain: ({ timeStamp, stock, expiry }) =>
    `/optionsimulator/optionchain/${timeStamp}&${stock}&${expiry}`,
};
