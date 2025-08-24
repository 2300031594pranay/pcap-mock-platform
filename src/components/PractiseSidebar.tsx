import React, { useState } from "react";
import "./PractiseSidebar.css";

interface PracticeSidebarProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  answeredQuestions: Set<number>;   // ✅ answered but not submitted
  submittedQuestions: Set<number>;  // ✅ new: fully submitted
  onQuestionSelect: (index: number) => void;
}

const QUESTIONS_PER_PAGE = 50;

const PracticeSidebar: React.FC<PracticeSidebarProps> = ({
  totalQuestions,
  currentQuestionIndex,
  answeredQuestions,
  submittedQuestions,
  onQuestionSelect,
}) => {
  const [sidebarPage, setSidebarPage] = useState(0);
  const progressPercentage = (submittedQuestions.size / totalQuestions) * 100;

  const start = sidebarPage * QUESTIONS_PER_PAGE;
  const end = start + QUESTIONS_PER_PAGE;
  const visibleQuestions = Array.from({ length: totalQuestions }, (_, i) => i).slice(start, end);

  return (
    <div className="practice-sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <h2>PCAP Practice</h2>
        <div className="progress-container">
          <div className="progress-label">
            <span>Progress</span>
            <span>
              {submittedQuestions.size}/{totalQuestions}
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="progress-text">{Math.round(progressPercentage)}% Complete</p>
        </div>
      </div>

      {/* Question Navigation */}
      <div className="sidebar-content">
        <h3>Questions</h3>
        <div className="question-list">
          {visibleQuestions.map((index) => {
            const questionNumber = index + 1;
            const isCurrent = index === currentQuestionIndex;
            const isSubmitted = submittedQuestions.has(questionNumber);
            const isAnswered = answeredQuestions.has(questionNumber) && !isSubmitted;

            return (
              <button
                key={index}
                className={`question-btn 
                  ${isCurrent ? "current" : ""} 
                  ${isSubmitted ? "submitted" : ""} 
                  ${isAnswered ? "answered" : ""}`}
                onClick={() => onQuestionSelect(index)}
                title={`Question ${questionNumber}
                  ${isSubmitted ? " (Submitted)" : isAnswered ? " (Answered)" : ""}`}
              >
                {questionNumber}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pagination */}
      <div className="pagination-controls">
        <button
          onClick={() => setSidebarPage((p) => Math.max(p - 1, 0))}
          disabled={sidebarPage === 0}
        >
          Prev
        </button>
        <span>
          Page {sidebarPage + 1} / {Math.ceil(totalQuestions / QUESTIONS_PER_PAGE)}
        </span>
        <button
          onClick={() =>
            setSidebarPage((p) => (end < totalQuestions ? p + 1 : p))
          }
          disabled={end >= totalQuestions}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PracticeSidebar;
