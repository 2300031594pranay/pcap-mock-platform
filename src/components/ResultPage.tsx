"use client"

import "./ResultPage.css"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswers: number[]
  explanation: string
  topic: string
}

interface UserAnswer {
  questionId: number
  selectedAnswers: number[]
  isCorrect: boolean
}

interface ResultPageProps {
  questions: Question[]
  userAnswers: UserAnswer[]
  onRestart: () => void
}

export default function ResultPage({ questions, userAnswers, onRestart }: ResultPageProps) {
  const totalQuestions = questions.length
  const answeredQuestions = userAnswers.length
  const correctAnswers = userAnswers.filter((answer) => answer.isCorrect).length
  const score = Math.round((correctAnswers / totalQuestions) * 100)
  const passed = score >= 70

  const getAnswerStatus = (questionId: number) => {
    const userAnswer = userAnswers.find((answer) => answer.questionId === questionId)
    if (!userAnswer) return "unanswered"
    return userAnswer.isCorrect ? "correct" : "incorrect"
  }

  const getUserAnswerText = (question: Question) => {
    const userAnswer = userAnswers.find((answer) => answer.questionId === question.id)
    if (!userAnswer) return "Not answered"

    return userAnswer.selectedAnswers
      .map((index) => `${String.fromCharCode(65 + index)}. ${question.options[index]}`)
      .join(", ")
  }

  const getCorrectAnswerText = (question: Question) => {
    return question.correctAnswers
      .map((index) => `${String.fromCharCode(65 + index)}. ${question.options[index]}`)
      .join(", ")
  }

  return (
    <div className="result-page">
      <div className="result-container">
        <div className="result-header">
          <h1>Mock Test Results</h1>
          <div className={`score-display ${passed ? "passed" : "failed"}`}>
            <div className="score-circle">
              <span className="score-number">{score}%</span>
              <span className="score-label">{passed ? "PASSED" : "FAILED"}</span>
            </div>
          </div>
        </div>

        <div className="result-summary">
          <div className="summary-grid">
            <div className="summary-item">
              <div className="summary-number">{totalQuestions}</div>
              <div className="summary-label">Total Questions</div>
            </div>
            <div className="summary-item">
              <div className="summary-number">{answeredQuestions}</div>
              <div className="summary-label">Answered</div>
            </div>
            <div className="summary-item correct">
              <div className="summary-number">{correctAnswers}</div>
              <div className="summary-label">Correct</div>
            </div>
            <div className="summary-item incorrect">
              <div className="summary-number">{answeredQuestions - correctAnswers}</div>
              <div className="summary-label">Incorrect</div>
            </div>
          </div>
        </div>

        <div className="result-actions">
          <button className="btn btn-primary" onClick={onRestart}>
            Take Another Test
          </button>
        </div>

        <div className="detailed-results">
          <h2>Detailed Results</h2>
          <div className="questions-review">
            {questions.map((question, index) => {
              const status = getAnswerStatus(question.id)
              return (
                <div key={question.id} className={`question-review ${status}`}>
                  <div className="question-review-header">
                    <div className="question-info">
                      <span className="question-number">Question {index + 1}</span>
                      <span className="question-topic">{question.topic}</span>
                    </div>
                    <div className={`status-indicator ${status}`}>
                      {status === "correct" && "✓"}
                      {status === "incorrect" && "✗"}
                      {status === "unanswered" && "—"}
                    </div>
                  </div>

                  <div className="question-content">
                    <div className="question-text">
                      <pre>{question.question}</pre>
                    </div>

                    <div className="answer-comparison">
                      <div className="answer-section">
                        <h4>Your Answer:</h4>
                        <p className={status === "correct" ? "correct-text" : "incorrect-text"}>
                          {getUserAnswerText(question)}
                        </p>
                      </div>

                      <div className="answer-section">
                        <h4>Correct Answer:</h4>
                        <p className="correct-text">{getCorrectAnswerText(question)}</p>
                      </div>
                    </div>

                    <div className="explanation">
                      <h4>Explanation:</h4>
                      <p>{question.explanation}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
