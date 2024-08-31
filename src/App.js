import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register"; // Register 컴포넌트 import

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
