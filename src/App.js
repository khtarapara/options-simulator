import React from "react";
import { ConfigProvider } from "antd";
import { theme } from "./theme";
import Router from "./Router";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import store from "./store";
import "react-toastify/dist/ReactToastify.css";
import { StyledApp } from "./AppStyles";

export default function App() {
  return (
    <StyledApp>
      <ConfigProvider theme={theme}>
        <Provider store={store}>
          <Router />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </Provider>
      </ConfigProvider>
    </StyledApp>
  );
}
