import React, { useState } from "react";

interface PracticeSidebarProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  answeredQuestions: Set<number>;   // ✅ answered but not submitted
  submittedQuestions: Set<number>;  // ✅ fully submitted
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
    <>
      {/* ✅ CSS injected directly into component */}
      <style>{`
        .practice-sidebar {
          width: 250px;
          background: #2c3e50;
          color: #fff;
          padding: 20px;
          height: 100vh;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between; /* pagination at bottom */
        }

        .sidebar-header h2 {
          margin-bottom: 15px;
          font-size: 18px;
        }

        .progress-container {
          margin-bottom: 20px;
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }

        .progress-bar {
          background: #34495e;
          border-radius: 6px;
          height: 8px;
          margin-top: 6px;
          overflow: hidden;
        }

        .progress-fill {
          background: #1abc9c;
          height: 100%;
          transition: width 0.3s ease-in-out;
        }

        .progress-text {
          font-size: 12px;
          margin-top: 4px;
          color: #ddd;
        }

        .sidebar-content h3 {
          font-size: 16px;
          margin-bottom: 10px;
        }

        .question-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          overflow-y: auto;
          max-height: calc(100vh - 250px); /* ✅ keeps sidebar scrollable */
        }

        .question-btn {
          width: 40px;
          height: 40px;
          background: #34495e;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: 0.3s;
        }

        .question-btn:hover {
          background: #1abc9c;
        }

        .question-btn.current {
          background: #e67e22; /* orange for current */
        }

        .question-btn.answered {
          background: #f1c40f; /* yellow for answered but not submitted */
          color: #000;
        }

        .question-btn.submitted {
          background: #2ecc71; /* green for submitted */
          color: #fff;
        }

        .pagination-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 15px;
          border-top: 1px solid #3e4c5a;
        }

        .pagination-controls button {
          padding: 6px 14px;
          font-size: 14px;
          font-weight: bold;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: 0.2s ease-in-out;
        }

        .pagination-controls button:disabled {
          background: #7f8c8d;
          color: #ccc;
          cursor: not-allowed;
        }

        .pagination-controls button:not(:disabled) {
          background: #1abc9c;
          color: #fff;
        }

        .pagination-controls button:not(:disabled):hover {
          background: #16a085;
        }

        .pagination-controls span {
          font-size: 13px;
          color: #ddd;
        }

        /* ✅ Mobile responsive */
        @media (max-width: 768px) {
          .practice-sidebar {
            width: 100%;
            height: auto;
            max-height: 200px; /* collapsible height */
          }

          .question-list {
            max-height: 120px; /* limit inside mobile */
          }
        }
      `}</style>

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
            <p className="progress-text">
              {Math.round(progressPercentage)}% Complete
            </p>
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
              const isAnswered =
                answeredQuestions.has(questionNumber) && !isSubmitted;

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
            Page {sidebarPage + 1} /{" "}
            {Math.ceil(totalQuestions / QUESTIONS_PER_PAGE)}
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
    </>
  );
};

export default PracticeSidebar;
