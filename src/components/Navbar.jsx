import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const items = [
  {
    label: <Link to="/straddle-simulator">Straddle Simulator</Link>,
    key: "straddle-simulator",
  },
  {
    label: <Link to="/straddle-chart">Straddle Chart</Link>,
    key: "straddle-chart",
  },
  {
    label: <Link to="/strangle-chart">Strangle Chart</Link>,
    key: "strangle-chart",
  },
  {
    label: <Link to="/journal">Journal</Link>,
    key: "journal",
  },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <Menu
      style={{ justifyContent: "flex-end" }}
      defaultSelectedKeys={[location.pathname.slice(1)]}
      mode="horizontal"
      items={items}
    />
  );
}
