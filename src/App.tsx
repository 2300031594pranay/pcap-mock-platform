"use client"

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import PracticeQuestions from "./pages/PracticeQuestions"
import MockTest from "./pages/MockTest"
import "./App.css"

function AppContent() {
  const location = useLocation()

  return (
    <div className="app">
      {/* Show Navbar everywhere except Mock Test page */}
      {location.pathname !== "/mock-test" && <Navbar />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/practice" element={<PracticeQuestions />} />
          <Route path="/mock-test" element={<MockTest />} />
          
        </Routes>
      </main>

      {/* Show Footer only on Home Page */}
      {location.pathname === "/" && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}
