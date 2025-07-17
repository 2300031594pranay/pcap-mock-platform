"use client"

import { Link, useLocation } from "react-router-dom"
import "./Navbar.css"

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          PCAP Practice
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link
              to="/"
              className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/practice"
              className={`nav-link ${
                location.pathname === "/practice" ? "active" : ""
              }`}
            >
              Practice Questions
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/mock-test"
              className={`nav-link ${
                location.pathname === "/mock-test" ? "active" : ""
              }`}
            >
              Mock Test
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
