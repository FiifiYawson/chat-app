import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from "./pages/Login.jsx"
import Main from './pages/Main.jsx'
import Onboarding from "./pages/Onboarding"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/*" element={<Main />} />
      </Routes>
    </Router>
  );
}

export default App;