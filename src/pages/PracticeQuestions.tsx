"use client"

import { useEffect, useState } from "react"
import QuestionCard from "../components/QuestionCard"
import PracticeSidebar from "../components/PractiseSidebar" // ✅ Sidebar
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
  const [questions] = useState<Question[]>(questionsData.slice(0, 66))
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())

  // Load saved progress from localStorage
  useEffect(() => {
    const savedIndex = localStorage.getItem("practice_current_question_index")
    const savedAnswers = localStorage.getItem("practice_answered_questions")

    if (savedIndex) {
      setCurrentQuestionIndex(parseInt(savedIndex, 10))
    }

    if (savedAnswers) {
      const parsed = JSON.parse(savedAnswers)
      setAnsweredQuestions(new Set(parsed))
    }
  }, [])

  // Save current index
  useEffect(() => {
    localStorage.setItem("practice_current_question_index", currentQuestionIndex.toString())
  }, [currentQuestionIndex])

  // Save answered questions
  useEffect(() => {
    localStorage.setItem("practice_answered_questions", JSON.stringify(Array.from(answeredQuestions)))
  }, [answeredQuestions])

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
    <div className="practice-layout">
      {/* Sidebar */}
      <PracticeSidebar
        totalQuestions={questions.length}
        currentQuestionIndex={currentQuestionIndex}
        answeredQuestions={answeredQuestions}
        submittedQuestions={new Set()} // Provide an empty Set or your submitted questions state here
        onQuestionSelect={goToQuestion}
      />

      {/* Main content */}
      <div className="practice-main">
        <div className="practice-content">
          <h1>Practice Questions</h1>
          <p className="practice-description">
            Work through these PCAP practice questions at your own pace. Each question includes detailed explanations to help you learn.
          </p>

          <div className="question-section">
            <QuestionCard
              question={questions[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              onAnswered={handleQuestionAnswered}
              showExplanation={true}
            />

            <div className="navigation-buttons">
              <button
                className="btn btn-secondary"
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
              >
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
    </div>
  )
}
