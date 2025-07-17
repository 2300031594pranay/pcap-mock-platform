import "./HomePage.css"
import { Link } from "react-router-dom"

export default function HomePage() {
  return (
    <div className="homepage">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <h1>Prepare for the PCAP Exam</h1>
          <p>
            Practice real questions from previous years and get ready to ace
            the PCAP (Python Certified Associate Programmer) exam!
          </p>
          <Link to="/practice" className="btn primary">
            Start Practicing
          </Link>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section">
        <div className="container">
          <h2>What Makes Our Platform the Best Choice?</h2>
          <div className="features">
            <div className="feature-card">
              <h3>Real Exam Questions</h3>
              <p>Access a wide range of questions from previous PCAP exams.</p>
            </div>
            <div className="feature-card">
              <h3>Instant Feedback</h3>
              <p>Check answers and explanations instantly after practicing.</p>
            </div>
            <div className="feature-card">
              <h3>Track Progress</h3>
              <p>
                Monitor your score and improve based on your weak topics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EXAM INFO SECTION */}
      <section className="exam-info">
        <div className="container">
          <h2>About PCAP Certification</h2>
          <div className="info-grid">
            <div className="info-item">
              <h4>Topics Covered</h4>
              <ul>
                <li>Data Types and Variables</li>
                <li>Control Flow (if statements, loops)</li>
                <li>Functions and Modules</li>
                <li>Exception Handling</li>
                <li>Object-Oriented Programming</li>
                <li>File Operations</li>
              </ul>
            </div>
            <div className="info-item">
              <h4>Exam Format</h4>
              <ul>
                <li>40 multiple-choice questions</li>
                <li>65 minutes duration</li>
                <li>70% passing score</li>
                <li>Single and multiple correct answers</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
