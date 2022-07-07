import React from 'react'
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from "./pages/Login.jsx"
import Main from './pages/Main.jsx'

function App(){
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path='/' element={<Main/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;