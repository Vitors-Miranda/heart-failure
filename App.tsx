import React from "react";

// Use require to avoid TypeScript treating the imported file as JSX when
// the '--jsx' compiler option is not set.
const Dashboard = require("./src/screens/Dashboard").default;

export default function App() {
  return React.createElement(Dashboard);
}