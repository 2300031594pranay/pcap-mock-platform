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
  onAnswerSubmit?: (
    questionId: number,
    selectedAnswers: number[],
    isCorrect: boolean
  ) => void
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

  // ✅ Reset state whenever question changes or external saved answer is provided
  useEffect(() => {
    if (userAnswer) {
      setSelectedAnswers(userAnswer.selectedAnswers)
      setHasAnswered(true)
      // Always show result if we have a stored answer
      setShowResult(true)
    } else {
      setSelectedAnswers([])
      setHasAnswered(false)
      setShowResult(false)
    }
  }, [question.id, userAnswer])

  // ✅ Option select handler
  const handleOptionSelect = (optionIndex: number) => {
    // Block changing answers AFTER submission
    if (hasAnswered) return

    if (question.correctAnswers.length === 1) {
      // Single choice
      setSelectedAnswers([optionIndex])
    } else {
      // Multi choice
      setSelectedAnswers((prev) =>
        prev.includes(optionIndex)
          ? prev.filter((i) => i !== optionIndex)
          : [...prev, optionIndex]
      )
    }
  }

  // ✅ Correctness check
  const isAnswerCorrect = () => {
    return (
      selectedAnswers.length === question.correctAnswers.length &&
      selectedAnswers.every((ans) => question.correctAnswers.includes(ans))
    )
  }

  // ✅ Submit handler
  const handleSubmit = () => {
    if (selectedAnswers.length === 0) return

    setHasAnswered(true)
    const correct = isAnswerCorrect()

    // Notify parent
    onAnswered?.(question.id)
    onAnswerSubmit?.(question.id, selectedAnswers, correct)

    setShowResult(true) // Always show result after submission
  }

  // ✅ Dynamic option CSS
  const getOptionClass = (index: number) => {
    if (!hasAnswered || !showResult) {
      return selectedAnswers.includes(index) ? "selected" : ""
    }

    if (question.correctAnswers.includes(index)) {
      return "correct"
    }
    if (selectedAnswers.includes(index) && !question.correctAnswers.includes(index)) {
      return "incorrect"
    }
    return ""
  }

  return (
    <div className="question-card">
      {/* Header */}
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

      {/* Question text */}
      <div className="question-text">
        <pre>{question.question}</pre>
      </div>

      {/* Options */}
      <div className="options">
        {question.options.map((option, idx) => (
          <div
            key={idx}
            className={`option ${getOptionClass(idx)}`}
            onClick={() => handleOptionSelect(idx)}
          >
            <div className="option-marker">
              {question.correctAnswers.length === 1 ? (
                <div className="radio-marker" />
              ) : (
                <div className="checkbox-marker">
                  {selectedAnswers.includes(idx) && "✓"}
                </div>
              )}
            </div>
            <div className="option-text">
              <span className="option-label">{String.fromCharCode(65 + idx)}.</span>
              <pre>{option}</pre>
            </div>
          </div>
        ))}
      </div>

      {/* Submit button */}
      {!hasAnswered && (
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={selectedAnswers.length === 0}
        >
          Submit Answer
        </button>
      )}

      {/* Results + Explanation */}
      {hasAnswered && showResult && (
        <div className="result-section">
          <div
            className={`result-indicator ${
              isAnswerCorrect() ? "correct" : "incorrect"
            }`}
          >
            {isAnswerCorrect() ? "✓ Correct!" : "✗ Incorrect"}
          </div>
          {showExplanation && (
            <div className="explanation">
              <h4>Explanation:</h4>
              <p>{question.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
