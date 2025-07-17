"use client"

import { useState, useEffect } from "react"
import "./QuestionCard.css"

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

interface QuestionCardProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  onAnswered?: (questionId: number) => void
  onAnswerSubmit?: (questionId: number, selectedAnswers: number[]) => void
  showExplanation?: boolean
  userAnswer?: UserAnswer
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswered,
  onAnswerSubmit,
  showExplanation = false,
  userAnswer,
}: QuestionCardProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [hasAnswered, setHasAnswered] = useState(false)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    if (userAnswer) {
      setSelectedAnswers(userAnswer.selectedAnswers)
      setHasAnswered(true)
      setShowResult(showExplanation)
    } else {
      setSelectedAnswers([])
      setHasAnswered(false)
      setShowResult(false)
    }
  }, [question.id, userAnswer, showExplanation])

  const handleOptionSelect = (optionIndex: number) => {
    if (hasAnswered && !showExplanation) return

    if (question.correctAnswers.length === 1) {
      // Single correct answer
      setSelectedAnswers([optionIndex])
    } else {
      // Multiple correct answers
      setSelectedAnswers((prev) =>
        prev.includes(optionIndex) ? prev.filter((index) => index !== optionIndex) : [...prev, optionIndex],
      )
    }
  }

  const handleSubmit = () => {
    if (selectedAnswers.length === 0) return

    setHasAnswered(true)

    if (showExplanation) {
      setShowResult(true)
      onAnswered?.(question.id)
    } else {
      onAnswerSubmit?.(question.id, selectedAnswers)
    }
  }

  const isCorrectAnswer = (optionIndex: number) => {
    return question.correctAnswers.includes(optionIndex)
  }

  const getOptionClass = (optionIndex: number) => {
    if (!hasAnswered || !showResult) {
      return selectedAnswers.includes(optionIndex) ? "selected" : ""
    }

    const classes = []

    if (selectedAnswers.includes(optionIndex)) {
      classes.push("selected")
    }

    if (isCorrectAnswer(optionIndex)) {
      classes.push("correct")
    } else if (selectedAnswers.includes(optionIndex)) {
      classes.push("incorrect")
    }

    return classes.join(" ")
  }

  const isAnswerCorrect = () => {
    return (
      selectedAnswers.length === question.correctAnswers.length &&
      selectedAnswers.every((answer) => question.correctAnswers.includes(answer))
    )
  }

  return (
    <div className="question-card">
      <div className="question-header">
        <div className="question-info">
          <span className="question-number">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="question-topic">{question.topic}</span>
        </div>
        <div className="question-type">
          {question.correctAnswers.length === 1 ? "Single Answer" : "Multiple Answers"}
        </div>
      </div>

      <div className="question-text">
        <pre>{question.question}</pre>
      </div>

      <div className="options">
        {question.options.map((option, index) => (
          <div key={index} className={`option ${getOptionClass(index)}`} onClick={() => handleOptionSelect(index)}>
            <div className="option-marker">
              {question.correctAnswers.length === 1 ? (
                <div className="radio-marker" />
              ) : (
                <div className="checkbox-marker">{selectedAnswers.includes(index) && "✓"}</div>
              )}
            </div>
            <div className="option-text">
              <span className="option-label">{String.fromCharCode(65 + index)}.</span>
              <pre>{option}</pre>
            </div>
          </div>
        ))}
      </div>

      {!hasAnswered && (
        <button className="submit-btn" onClick={handleSubmit} disabled={selectedAnswers.length === 0}>
          Submit Answer
        </button>
      )}

      {hasAnswered && showResult && (
        <div className="result-section">
          <div className={`result-indicator ${isAnswerCorrect() ? "correct" : "incorrect"}`}>
            {isAnswerCorrect() ? "✓ Correct!" : "✗ Incorrect"}
          </div>
          <div className="explanation">
            <h4>Explanation:</h4>
            <p>{question.explanation}</p>
          </div>
        </div>
      )}
    </div>
  )
}
