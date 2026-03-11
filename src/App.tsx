/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { Toaster } from "./components/Toaster";

export default function App() {
  return (
    <Router>
      <Toaster />
      <AppRoutes />
    </Router>
  );
}
