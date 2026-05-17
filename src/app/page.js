"use client";

import React from "react";
import Papa from "papaparse";

export default function QuizPlatform() {
  const defaultQuiz = {
    title: "Adding and Subtracting Positive and Negative Fractions",
    passingPercentage: 70,
    questions: [
      {
        id: 1,
        question: "What is the value of -2 5/6 + 3 2/3 ?",
        options: ["6 1/2", "2 1/3", "-6 1/2", "5/6"],
        correctAnswer: "5/6",
        explanation:
          "Convert mixed fractions into improper fractions and find a common denominator.",
      },
      {
        id: 2,
        question: "What is the value of -7 3/5 - 8 1/8 ?",
        options: ["16 29/40", "-15 29/40", "2 29/40", "-6 1/2"],
        correctAnswer: "-15 29/40",
        explanation:
          "Combine whole numbers and fractions carefully when subtracting mixed numbers.",
      },
      {
        id: 3,
        question: "What is the value of 13/25 + 2/5 ?",
        options: ["3/25", "23/25", "-23/25", "-3/25"],
        correctAnswer: "23/25",
        explanation: "Convert 2/5 into 10/25 before adding.",
      },
    ],
  };

  const teacherDashboard = {
    totalStudents: 128,
    averageScore: 74,
    strugglingTopic: "Negative Fractions",
    quizzesCompleted: 542,
  };

  const [uploadedQuiz, setUploadedQuiz] = React.useState(null);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState("");
  const [showResult, setShowResult] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [difficultyLevel, setDifficultyLevel] = React.useState("Beginner");
  const [correctStreak, setCorrectStreak] = React.useState(0);
  const [quizFinished, setQuizFinished] = React.useState(false);
  const [aiExplanation, setAIExplanation] = React.useState("");
  const [loadingAI, setLoadingAI] = React.useState(false);
  const [achievements, setAchievements] = React.useState([]);

  const [studentProfile] = React.useState({
    name: "Mary",
    level: "Beginner",
    streak: 5,
    quizzesCompleted: 12,
    totalXP: 240,
  });

  const activeQuiz = uploadedQuiz || defaultQuiz;
  const question = activeQuiz.questions[currentQuestion];

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    if (selectedAnswer === question.correctAnswer) {
      const updatedScore = score + 1;
      const updatedStreak = correctStreak + 1;

      setScore(updatedScore);
      setCorrectStreak(updatedStreak);

      if (updatedScore >= 3 && !achievements.includes("Quick Learner")) {
        setAchievements((prev) => [...prev, "Quick Learner"]);
      }

      if (updatedStreak >= 5 && !achievements.includes("Math Master")) {
        setAchievements((prev) => [...prev, "Math Master"]);
      }

      if (updatedStreak >= 3) {
        setDifficultyLevel("Advanced");
      } else if (updatedStreak >= 2) {
        setDifficultyLevel("Intermediate");
      }
    } else {
      setCorrectStreak(0);
      setDifficultyLevel("Beginner");
    }

    setShowResult(true);
  };

  const handleNext = () => {
    setAIExplanation("");
    setSelectedAnswer("");
    setShowResult(false);

    if (currentQuestion + 1 < activeQuiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const generateAIExplanation = async () => {
    setLoadingAI(true);

    setTimeout(() => {
      setAIExplanation(
        "AI Tutor Explanation: Convert fractions to a common denominator first, then combine numerators carefully before simplifying the final answer."
      );

      setLoadingAI(false);
    }, 1000);
  };

  const handleCSVUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const formattedQuestions = results.data.map((row, index) => ({
          id: index + 1,
          question: row.question,
          options: [
            row.option1,
            row.option2,
            row.option3,
            row.option4,
          ],
          correctAnswer: row.correctAnswer,
          explanation: row.explanation,
        }));

        setUploadedQuiz({
          title: file.name.replace(".csv", ""),
          passingPercentage: 70,
          questions: formattedQuestions,
        });

        setCurrentQuestion(0);
        setScore(0);
        setQuizFinished(false);
      },
    });
  };

  const percentage = Math.round(
    (score / activeQuiz.questions.length) * 100
  );

  if (quizFinished) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold mb-6">Quiz Complete</h1>

          <p className="text-2xl mb-4">
            Your Score: {score} / {activeQuiz.questions.length}
          </p>

          <p className="text-xl mb-6">Percentage: {percentage}%</p>

          {percentage >= activeQuiz.passingPercentage ? (
            <div className="bg-green-100 text-green-700 p-4 rounded-2xl text-lg font-semibold">
              Congratulations! You Passed.
            </div>
          ) : (
            <div className="bg-red-100 text-red-700 p-4 rounded-2xl text-lg font-semibold">
              Keep Practicing and Try Again.
            </div>
          )}

          <button
            onClick={() => {
              setCurrentQuestion(0);
              setSelectedAnswer("");
              setShowResult(false);
              setScore(0);
              setQuizFinished(false);
            }}
            className="mt-8 px-6 py-3 bg-black text-white rounded-2xl text-lg"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-6 max-w-5xl w-full">
        <div className="bg-yellow-100 rounded-2xl p-5 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-yellow-700 mb-1">
                Adaptive Learning Difficulty
              </p>
              <h3 className="text-3xl font-bold text-yellow-900">
                {difficultyLevel}
              </h3>
            </div>

            <div>
              <p className="text-sm text-yellow-700 mb-1">
                Correct Answer Streak
              </p>
              <h3 className="text-3xl font-bold text-yellow-900">
                {correctStreak}
              </h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-100 rounded-2xl p-5">
            <p className="text-sm text-blue-700 mb-2">Total Students</p>
            <h3 className="text-3xl font-bold text-blue-900">
              {teacherDashboard.totalStudents}
            </h3>
          </div>

          <div className="bg-green-100 rounded-2xl p-5">
            <p className="text-sm text-green-700 mb-2">Average Score</p>
            <h3 className="text-3xl font-bold text-green-900">
              {teacherDashboard.averageScore}%
            </h3>
          </div>

          <div className="bg-red-100 rounded-2xl p-5">
            <p className="text-sm text-red-700 mb-2">Most Difficult Topic</p>
            <h3 className="text-xl font-bold text-red-900">
              {teacherDashboard.strugglingTopic}
            </h3>
          </div>

          <div className="bg-purple-100 rounded-2xl p-5">
            <p className="text-sm text-purple-700 mb-2">Quizzes Completed</p>
            <h3 className="text-3xl font-bold text-purple-900">
              {teacherDashboard.quizzesCompleted}
            </h3>
          </div>
        </div>

        {achievements.length > 0 && (
          <div className="bg-orange-100 rounded-3xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-orange-900 mb-4">
              Achievements Unlocked
            </h2>

            <div className="flex flex-wrap gap-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement}
                  className="bg-orange-500 text-white px-4 py-2 rounded-full font-semibold"
                >
                  🏆 {achievement}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-black to-gray-700 text-white rounded-3xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Welcome, {studentProfile.name}
              </h2>
              <p className="text-gray-200 text-lg">
                Level: {studentProfile.level}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-sm text-gray-300">Quiz Streak</p>
                <h3 className="text-2xl font-bold">
                  {studentProfile.streak}
                </h3>
              </div>

              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-sm text-gray-300">Completed</p>
                <h3 className="text-2xl font-bold">
                  {studentProfile.quizzesCompleted}
                </h3>
              </div>

              <div className="bg-white/10 rounded-2xl p-4 col-span-2">
                <p className="text-sm text-gray-300">Experience Points</p>
                <h3 className="text-3xl font-bold">
                  {studentProfile.totalXP} XP
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-3">{activeQuiz.title}</h1>

            <label className="inline-block bg-black text-white px-4 py-2 rounded-xl cursor-pointer text-sm">
              Upload Spreadsheet CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="bg-black text-white px-4 py-2 rounded-xl">
            Question {currentQuestion + 1} / {activeQuiz.questions.length}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold leading-relaxed">
            {question.question}
          </h2>
        </div>

        <div className="space-y-4 mb-8">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => setSelectedAnswer(option)}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                selectedAnswer === option
                  ? "border-black bg-gray-100"
                  : "border-gray-300 bg-white"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {!showResult ? (
          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white py-4 rounded-2xl text-lg font-semibold"
          >
            Submit Answer
          </button>
        ) : (
          <div className="space-y-6">
            {selectedAnswer === question.correctAnswer ? (
              <div className="bg-green-100 text-green-700 p-5 rounded-2xl">
                <h3 className="text-xl font-bold mb-2">Correct!</h3>
                <p>{question.explanation}</p>
              </div>
            ) : (
              <div className="bg-red-100 text-red-700 p-5 rounded-2xl">
                <h3 className="text-xl font-bold mb-2">Incorrect</h3>
                <p className="mb-2">
                  Correct Answer: {question.correctAnswer}
                </p>
                <p>{question.explanation}</p>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={generateAIExplanation}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl text-lg font-semibold"
              >
                {loadingAI
                  ? "AI Tutor Thinking..."
                  : "Explain With AI"}
              </button>

              {aiExplanation && (
                <div className="bg-blue-100 text-blue-900 p-5 rounded-2xl whitespace-pre-line">
                  <h3 className="text-xl font-bold mb-3">AI Tutor</h3>
                  <p>{aiExplanation}</p>
                </div>
              )}

              <button
                onClick={handleNext}
                className="w-full bg-black text-white py-4 rounded-2xl text-lg font-semibold"
              >
                {currentQuestion + 1 === activeQuiz.questions.length
                  ? "Finish Quiz"
                  : "Next Question"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
