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
  showExplanation?: boolean // true = Practice mode, false = Mock test mode
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

  // ✅ Reset state whenever question changes or external saved answer is provided
  useEffect(() => {
    if (userAnswer) {
      setSelectedAnswers(userAnswer.selectedAnswers)
      setHasAnswered(true)
    } else {
      setSelectedAnswers([])
      setHasAnswered(false)
    }
  }, [question.id, userAnswer])

  // ✅ Option select handler
  const handleOptionSelect = (optionIndex: number) => {
    // Block changing answers AFTER submission (only in practice/review mode)
    if (hasAnswered && showExplanation) return

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

    // 👉 In practice mode: check correctness immediately
    // 👉 In mock test mode: always send `false` (result calculated later)
    const correct = showExplanation ? isAnswerCorrect() : false

    // Notify parent
    onAnswered?.(question.id)
    onAnswerSubmit?.(question.id, selectedAnswers, correct)
  }

  // ✅ Dynamic option CSS
  const getOptionClass = (index: number) => {
  if (!showExplanation) {
    // Mock/exam mode → only highlight chosen option
    return selectedAnswers.includes(index) ? "selected" : ""
  }

  // Practice mode → correctness only after submit
  if (hasAnswered) {
    if (question.correctAnswers.includes(index)) {
      return "correct"
    }
    if (selectedAnswers.includes(index) && !question.correctAnswers.includes(index)) {
      return "incorrect"
    }
  }

  return selectedAnswers.includes(index) ? "selected" : ""
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

      {/* Submit button (only in exam mode, before answer is locked) */}
      {!hasAnswered && (
  <button className="submit-btn" onClick={handleSubmit}>
    Submit
  </button>
)}



      {/* Results + Explanation (only in practice/review mode) */}
      {hasAnswered && showExplanation && (
        <div className="result-section">
          <div
            className={`result-indicator ${
              isAnswerCorrect() ? "correct" : "incorrect"
            }`}
          >
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
