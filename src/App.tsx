"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import PracticeQuestions from "./pages/PracticeQuestions"
import MockTest from "./pages/MockTest"
import "./App.css"

export default function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/practice" element={<PracticeQuestions />} />
            <Route path="/mock-test" element={<MockTest />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}
