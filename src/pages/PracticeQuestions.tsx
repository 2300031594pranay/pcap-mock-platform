"use client"

import { useState } from "react"
import QuestionCard from "../components/QuestionCard"
import questionsData from "../data/questions.json"
import "./PracticeQuestions.css"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswers: number[]
  explanation: string
  topic: string
}

export default function PracticeQuestions() {
  const [questions] = useState<Question[]>(questionsData.slice(0, 41))
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())

  const handleQuestionAnswered = (questionId: number) => {
    setAnsweredQuestions((prev) => new Set([...prev, questionId]))
  }

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  return (
    <div className="practice-questions">
      <div className="practice-container">
        <h1>Practice Questions</h1>
        <p className="practice-description">
          Work through these PCAP practice questions at your own pace. Each question includes detailed explanations to
          help you learn.
        </p>

        <div className="question-navigation">
          <h3>
            Questions ({answeredQuestions.size}/{questions.length} completed)
          </h3>
          <div className="question-grid">
            {questions.map((_, index) => (
              <button
                key={index}
                className={`question-nav-btn ${
                  index === currentQuestionIndex ? "active" : ""
                } ${answeredQuestions.has(questions[index].id) ? "completed" : ""}`}
                onClick={() => goToQuestion(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="question-section">
          <QuestionCard
            question={questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onAnswered={handleQuestionAnswered}
            showExplanation={true}
          />

          <div className="navigation-buttons">
            <button className="btn btn-secondary" onClick={prevQuestion} disabled={currentQuestionIndex === 0}>
              Previous
            </button>
            <button
              className="btn btn-primary"
              onClick={nextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
