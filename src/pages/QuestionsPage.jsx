import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getQuestions, deleteQuestion, getInterview } from "../api";
import NotFound from "./NotFound";

import ArrowLeftIcon from "../assets/arrow-left-square.svg";
import QuestionForm from "./QuestionForm";
import QuestionCard from "./QuestionCard";

/**
 * Manages the list of questions for one interview.
 * - Loads all questions from the API.
 * - Lets the user add new questions, edit existing ones, or delete them.
 * - Shows a spinner while loading, or a NotFound page if the interview doesn’t exist.
 * 
 * @reutns A page taht lists and manages interview questions
 */
function QuestionsPage() {
   // get interviewId from the URL
  const { id: interviewId } = useParams();

  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [questionBeingEdited, setQuestionBeingEdited] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [interviewExists, setInterviewExists] = useState(true);

  /**
   * useEffect runs once when the page loads.
   * - First checks if the interview exists.
   * - If it does, fetches all questions for that interview.
   */
  useEffect(() => {
    async function loadQuestions() {
      try {
        // First make sure the interview exists
        const interviewData = await getInterview(interviewId);

        // Show loading page if false
        if (!interviewData || interviewData.length === 0) {
          setInterviewExists(false);
          setIsLoading(false);
          return;
        }

        // If it exists, load its questions
        const questionsFromApi = await getQuestions(interviewId);
        setQuestions(questionsFromApi);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setInterviewExists(false);
      } finally {
        setIsLoading(false);
      }
    }

    loadQuestions();
  }, [interviewId]);

  /**
   * Add a new question to the list (after user saves via QuestionForm).
   * @param newQuestion - The newly created question object.
   */
  function addQuestion(newQuestion) {
    setQuestions([...questions, newQuestion]);
    setShowForm(false); // close the form
  }

  /**
   * Delete a question by its ID.
   * @param questionId - The ID of the question to delete.
   */
  async function deleteQuestionById(questionId) {
    await deleteQuestion(questionId);
    setQuestions(questions.filter((q) => q.id !== questionId));
  }

  /**
   * Save changes to a question (update text and difficulty).
   * @param questionId - The ID of the question to update.
   * @param updatedText - The updated question text.
   * @param updatedDifficulty - The updated difficulty level.
   */
  function saveQuestion(questionId, updatedText, updatedDifficulty) {
    const updatedList = questions.map((q) =>
      q.id === questionId
        ? { ...q, question: updatedText, difficulty: updatedDifficulty }
        : q
    );
    setQuestions(updatedList);
    setQuestionBeingEdited(null);
  }

  // Show spinner while loading
  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading questions...</span>
        </div>
      </div>
    );
  }

  // If interview doesn’t exist, show NotFound page
  if (!interviewExists) {
    return <NotFound />;
  }

  return (
    <div className="container-narrow">
      {/* Page header */}
      <div className="d-flex justify-content-between align-items-center">
        <h2>Questions</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Add Question"}
        </button>
      </div>

      {/* Back link */}
      <Link
        to="/"
        className="btn btn-link mb-2 d-inline-flex align-items-center"
      >
        <img
          src={ArrowLeftIcon}
          alt="Back"
          width="16"
          height="16"
          className="me-1"
        />
        Back to Interviews
      </Link>

      {/* Add form */}
      {showForm && (
        <QuestionForm
          interviewId={interviewId}
          onAddQuestion={addQuestion}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Questions grid */}
      <div className="row g-4">
        {questions.length === 0 ? (
          <p className="text-muted text-center">No questions added yet.</p>
        ) : (
          questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              editingQuestionId={questionBeingEdited}
              setEditingQuestionId={setQuestionBeingEdited}
              onSave={saveQuestion}
              onDelete={deleteQuestionById}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default QuestionsPage;
