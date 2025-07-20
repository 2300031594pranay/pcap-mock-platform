"use client"

import { useState, useEffect } from "react"
import QuestionCard from "../components/QuestionCard"
import ResultPage from "../components/ResultPage"
import questionsData from "../data/mockquestion.json"
import "./MockTest.css"

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

export default function MockTest() {
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [timeLeft, setTimeLeft] = useState(65 * 60) // 65 minutes in seconds
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (testStarted && !testCompleted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTestCompleted(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [testStarted, testCompleted, timeLeft])

  const startTest = () => {
    // Randomly select 40 questions
    const shuffled = [...questionsData].sort(() => 0.5 - Math.random())
    setQuestions(shuffled.slice(0, 40))
    setTestStarted(true)
    setTimeLeft(65 * 60)
    setUserAnswers([])
    setAnsweredQuestions(new Set())
    setCurrentQuestionIndex(0)
    setTestCompleted(false)
  }

  const handleAnswerSubmit = (questionId: number, selectedAnswers: number[]) => {
    const question = questions.find((q) => q.id === questionId)
    if (!question) return

    const isCorrect =
      selectedAnswers.length === question.correctAnswers.length &&
      selectedAnswers.every((answer) => question.correctAnswers.includes(answer))

    const newAnswer: UserAnswer = {
      questionId,
      selectedAnswers,
      isCorrect,
    }

    setUserAnswers((prev) => {
      const filtered = prev.filter((answer) => answer.questionId !== questionId)
      return [...filtered, newAnswer]
    })

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

  const submitTest = () => {
    setTestCompleted(true)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const restartTest = () => {
    setTestStarted(false)
    setTestCompleted(false)
    setQuestions([])
    setCurrentQuestionIndex(0)
    setUserAnswers([])
    setTimeLeft(65 * 60)
    setAnsweredQuestions(new Set())
  }

  if (testCompleted) {
    return <ResultPage questions={questions} userAnswers={userAnswers} onRestart={restartTest} />
  }

  if (!testStarted) {
    return (
      <div className="mock-test-start">
        <div className="start-container">
          <h1>PCAP Mock Test</h1>
          <div className="test-info">
            <h2>Test Instructions</h2>
            <ul>
              <li>40 multiple-choice questions</li>
              <li>65 minutes time limit</li>
              <li>Some questions may have multiple correct answers</li>
              <li>You can navigate between questions freely</li>
              <li>Test will auto-submit when time expires</li>
              <li>Aim for 70% or higher to pass</li>
            </ul>
            <button className="btn btn-primary start-btn" onClick={startTest}>
              Start Mock Test
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mock-test">
      <div className="test-container">
        <div className="test-header">
          <div className="test-progress">
            <h2>Mock Test</h2>
            <p>
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
            <p>
              Answered: {answeredQuestions.size}/{questions.length}
            </p>
          </div>
          <div className="timer">
            <div className={`time-display ${timeLeft < 300 ? "warning" : ""}`}>{formatTime(timeLeft)}</div>
            <p>Time Remaining</p>
          </div>
        </div>

        <div className="question-navigation">
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
            onAnswerSubmit={handleAnswerSubmit}
            showExplanation={false}
            userAnswer={userAnswers.find((a) => a.questionId === questions[currentQuestionIndex].id)}
          />

          <div className="test-navigation">
            <button className="btn btn-secondary" onClick={prevQuestion} disabled={currentQuestionIndex === 0}>
              Previous
            </button>

            <button className="btn btn-danger submit-btn" onClick={submitTest}>
              Finish Test
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
