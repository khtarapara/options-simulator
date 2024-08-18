import { BrowserRouter, Routes, Route } from "react-router-dom";

import React from "react";
import Straddle from "./pages/StraddleSimulator";
import Root from "./Root";
import StraddleChart from "./pages/StraddleChart";
import StrangleChart from "./pages/StrangleChart";
import Journal from "./pages/Journal";
import BackTest from "./pages/BackTest";
import { AlgoBacktest } from "./pages/AlgoBacktest";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route path="/" element={<Straddle />} />
          <Route path="/straddle-simulator" element={<Straddle />} />
          <Route path="/straddle-chart" element={<StraddleChart />} />
          <Route path="/strangle-chart" element={<StrangleChart />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/backtest" element={<BackTest />} />
          <Route path="/algo-backtest" element={<AlgoBacktest />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
