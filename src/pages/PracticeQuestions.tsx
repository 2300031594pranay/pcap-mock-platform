"use client"

import { useEffect, useState } from "react"
import QuestionCard from "../components/QuestionCard"
import PracticeSidebar from "../components/PractiseSidebar"
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
  const [questions] = useState<Question[]>(questionsData.slice(0, 86))
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  // Store answered questions as set of IDs
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())

  // Store selected answers per question (supporting multi-choice)
  const [selectedAnswersMap, setSelectedAnswersMap] = useState<{ [key: number]: number[] }>({})

  // Load saved progress from localStorage
  useEffect(() => {
    const savedIndex = localStorage.getItem("practice_current_question_index")
    const savedAnswered = localStorage.getItem("practice_answered_questions")
    const savedSelected = localStorage.getItem("practice_selected_answers")

    console.log("Loading from localStorage:", {
      savedIndex,
      savedAnswered,
      savedSelected
    })

    if (savedIndex) setCurrentQuestionIndex(parseInt(savedIndex, 10))
    if (savedAnswered) {
      try {
        const answeredArray = JSON.parse(savedAnswered)
        setAnsweredQuestions(new Set(answeredArray))
      } catch (error) {
        console.error("Error parsing answered questions:", error)
        setAnsweredQuestions(new Set())
      }
    }
    if (savedSelected) {
      try {
        setSelectedAnswersMap(JSON.parse(savedSelected))
      } catch (error) {
        console.error("Error parsing selected answers:", error)
        setSelectedAnswersMap({})
      }
    }
  }, [])

  // Save current index
  useEffect(() => {
    localStorage.setItem("practice_current_question_index", currentQuestionIndex.toString())
    console.log("Saved current index:", currentQuestionIndex)
  }, [currentQuestionIndex])

  // Save answered questions
  useEffect(() => {
    const answeredArray = Array.from(answeredQuestions)
    localStorage.setItem("practice_answered_questions", JSON.stringify(answeredArray))
    console.log("Saved answered questions:", answeredArray)
  }, [answeredQuestions])

  // Save selected answers map
  useEffect(() => {
    localStorage.setItem("practice_selected_answers", JSON.stringify(selectedAnswersMap))
    console.log("Saved selected answers:", selectedAnswersMap)
  }, [selectedAnswersMap])

  // Handle answer submission from QuestionCard
  const handleAnswerSubmit = (questionId: number, selectedOptions: number[], isCorrect: boolean) => {
    // Save selected options
    setSelectedAnswersMap((prev) => ({ ...prev, [questionId]: selectedOptions }))

    // Mark question as answered
    setAnsweredQuestions((prev) => {
      const updated = new Set(prev)
      updated.add(questionId)
      return updated
    })
  }

  const goToQuestion = (index: number) => setCurrentQuestionIndex(index)
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex((prev) => prev + 1)
  }
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((prev) => prev - 1)
  }

  // Calculate progress
  const progress = (answeredQuestions.size / questions.length) * 100

  return (
    <div className="practice-layout">
      {/* Sidebar */}
      <PracticeSidebar
        totalQuestions={questions.length}
        currentQuestionIndex={currentQuestionIndex}
        answeredQuestions={answeredQuestions}
        submittedQuestions={answeredQuestions}
        onQuestionSelect={goToQuestion}
      />

      {/* Main content */}
      <div className="practice-main">
        <div className="practice-content">
          <h1>Practice Questions</h1>
          <p className="practice-description">
            Work through these PCAP practice questions at your own pace. Each question includes detailed explanations to help you learn.
          </p>

          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="progress-text">
              {answeredQuestions.size} / {questions.length} Completed
            </p>
          </div>

          <div className="question-section">
            <QuestionCard
              question={questions[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              onAnswerSubmit={handleAnswerSubmit}
              userAnswer={
                selectedAnswersMap[questions[currentQuestionIndex].id]
                  ? { 
                      questionId: questions[currentQuestionIndex].id, 
                      selectedAnswers: selectedAnswersMap[questions[currentQuestionIndex].id], 
                      isCorrect: questions[currentQuestionIndex].correctAnswers.length === selectedAnswersMap[questions[currentQuestionIndex].id].length &&
                                selectedAnswersMap[questions[currentQuestionIndex].id].every((ans: number) => 
                                  questions[currentQuestionIndex].correctAnswers.includes(ans)
                                )
                    }
                  : undefined
              }
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
