import { axiosInstance } from "./axiosInstance";
import { urls } from "./request-urls";

export const getExpiries = () =>
  axiosInstance.get(urls.expiries, {
    withCredentials: true,
  });

export const getOptionChain = ({ timeStamp, stock, expiry }) =>
  axiosInstance.get(urls.optionChain({ timeStamp, stock, expiry }));
