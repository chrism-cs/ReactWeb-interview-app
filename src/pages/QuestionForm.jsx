import { useState } from "react";
import { createQuestion } from "../api";

/**
 * A form component for adding a new question to an interview.
 * 
 * @param props
 * @param props.interviewId - The ID of the interview this question belongs to.
 * @param props.onAddQuestion - Callback to send the new question back to parent state.
 * @param props.onCancel - Callback to close the form without saving.
 * @returns - The rendered add-question form.
 */
function QuestionForm({ interviewId, onAddQuestion, onCancel }) {
  const [questionText, setQuestionText] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Handle form submission.
   * @param event - The form submit event
   */
  async function handleSubmit(event) {
    event.preventDefault();

    // Check required fields
    if (!questionText.trim() || !difficulty.trim()) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    try {
      // Build question object for the API
      const newQuestion = {
        question: questionText,
        difficulty,
      };

      // API returns an array, so we take the first item
      const [createdQuestion] = await createQuestion(interviewId, newQuestion);

      // Pass the created question back up to the parent
      onAddQuestion(createdQuestion);

      setQuestionText("");
      setDifficulty("Easy");
      setErrorMessage("");
    } catch (err) {
      console.error("Error creating question:", err);
      setErrorMessage("Failed to create question. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-3 mb-4">
      <h5>Add Question</h5>

      {errorMessage && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {errorMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setErrorMessage("")}
          ></button>
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Question</label>
        <textarea
          className="form-control"
          value={questionText}
          onChange={(event) => setQuestionText(event.target.value)}
          placeholder="Enter your question here"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Difficulty</label>
        <select
          className="form-select"
          value={difficulty}
          onChange={(event) => setDifficulty(event.target.value)}
        >
          <option value="Easy">Easy</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary me-2 mb-3">Save Question</button>
      <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>Cancel</button>
    </form>
  );
}

export default QuestionForm;
