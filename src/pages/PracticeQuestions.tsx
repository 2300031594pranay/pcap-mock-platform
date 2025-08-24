"use client";

import { useEffect, useState } from "react";
import QuestionCard from "../components/QuestionCard";
import PracticeSidebar from "../components/PractiseSidebar";
import questionsData from "../data/questions.json";
import "./PracticeQuestions.css";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswers: number[];
  explanation: string;
  topic: string;
}

export default function PracticeQuestions() {
  const [questions] = useState<Question[]>(questionsData.slice(0, 86));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(
    new Set()
  );
  const [selectedAnswersMap, setSelectedAnswersMap] = useState<{
    [key: number]: number[];
  }>({});

  // Load saved progress
  useEffect(() => {
    const savedIndex = localStorage.getItem("practice_current_question_index");
    const savedAnswered = localStorage.getItem("practice_answered_questions");
    const savedSelected = localStorage.getItem("practice_selected_answers");

    if (savedIndex) setCurrentQuestionIndex(parseInt(savedIndex, 10));
    if (savedAnswered) {
      try {
        const answeredArray = JSON.parse(savedAnswered);
        setAnsweredQuestions(new Set(answeredArray));
      } catch {
        setAnsweredQuestions(new Set());
      }
    }
    if (savedSelected) {
      try {
        setSelectedAnswersMap(JSON.parse(savedSelected));
      } catch {
        setSelectedAnswersMap({});
      }
    }
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem(
      "practice_current_question_index",
      currentQuestionIndex.toString()
    );
  }, [currentQuestionIndex]);

  useEffect(() => {
    localStorage.setItem(
      "practice_answered_questions",
      JSON.stringify(Array.from(answeredQuestions))
    );
  }, [answeredQuestions]);

  useEffect(() => {
    localStorage.setItem(
      "practice_selected_answers",
      JSON.stringify(selectedAnswersMap)
    );
  }, [selectedAnswersMap]);

  const handleAnswerSubmit = (questionId: number, selectedOptions: number[]) => {
    setSelectedAnswersMap((prev) => ({
      ...prev,
      [questionId]: selectedOptions,
    }));
    setAnsweredQuestions((prev) => {
      const updated = new Set(prev);
      updated.add(questionId);
      return updated;
    });
  };

  const goToQuestion = (index: number) => setCurrentQuestionIndex(index);
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1)
      setCurrentQuestionIndex((prev) => prev + 1);
  };
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((prev) => prev - 1);
  };

  const progress = (answeredQuestions.size / questions.length) * 100;

  return (
    <div className="practice-container">
      {/* Sidebar fixed left */}
      <div className="sidebar">
        <PracticeSidebar
          totalQuestions={questions.length}
          currentQuestionIndex={currentQuestionIndex}
          answeredQuestions={answeredQuestions}
          submittedQuestions={answeredQuestions}
          onQuestionSelect={goToQuestion}
        />
      </div>

      {/* Main content */}
      <div className="questions">
        <h1 className="page-title">Practice Questions</h1>
        <p className="page-desc">
          Work through these PCAP practice questions at your own pace. Each
          question includes detailed explanations to help you learn.
        </p>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="progress-text">
            {answeredQuestions.size} / {questions.length} Completed
          </p>
        </div>

        {/* Question */}
        <div className="question-section">
          <QuestionCard
            question={questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onAnswerSubmit={(questionId, selectedOptions) =>
              handleAnswerSubmit(questionId, selectedOptions)
            }
            userAnswer={
              selectedAnswersMap[questions[currentQuestionIndex].id]
                ? {
                    questionId: questions[currentQuestionIndex].id,
                    selectedAnswers:
                      selectedAnswersMap[
                        questions[currentQuestionIndex].id
                      ],
                    isCorrect:
                      questions[currentQuestionIndex].correctAnswers.length ===
                        selectedAnswersMap[
                          questions[currentQuestionIndex].id
                        ].length &&
                      selectedAnswersMap[
                        questions[currentQuestionIndex].id
                      ].every((ans: number) =>
                        questions[currentQuestionIndex].correctAnswers.includes(
                          ans
                        )
                      ),
                  }
                : undefined
            }
            showExplanation={true}
          />

          {/* Navigation */}
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
  );
}
