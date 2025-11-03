import { useState, useEffect } from "react";
import { updateQuestion } from "../api";

/**
 * Form for editing an existing question.
 * 
 * @param props
 * @param props.question - The question object being edited.
 * @param props.onSave - Callback to send the updated question back to parent.
 * @param props.onCancel - Callback to close the edit form without saving.
 * @returns - The rendered edit-question form.
 */
function QuestionEditForm({ question, onSave, onCancel }) {
  const [text, setText] = useState(question.question);
  const [difficulty, setDifficulty] = useState(question.difficulty);
  const [errorMessage, setErrorMessage] = useState("");

  
  /**
   * Whenever the 'question' prop changes (e.g. user switches to edit another one),
   * update the form fields to match the new question.
   */
  useEffect(() => {
    setText(question.question);
    setDifficulty(question.difficulty);
  }, [question]);

  /**
   * Handle form submission.
   * 
   * @param event - The form submission event
   */
  async function handleSubmit(event) {
    event.preventDefault();

    // Check if required fields are filled
    if (!text.trim() || !difficulty.trim()) {
      setErrorMessage("Please fill in all required fields before saving.");
      return;
    }

    try {
      // Send update request to API
      await updateQuestion(question.id, { question: text, difficulty });
      
      // Pass updated info back to parent
      onSave(question.id, text, difficulty);
      
      // Clear error message on success
      setErrorMessage("");
    } catch (err) {
      console.error("Error updating question:", err);
      setErrorMessage("Failed to update question. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
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

      <textarea
        className="form-control mb-2"
        value={text}
        onChange={(event) => setText(event.target.value)}
        required
      />
      <select
        className="form-select mb-2"
        value={difficulty}
        onChange={(event) => setDifficulty(event.target.value)}
        required
      >
        <option value="Easy">Easy</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>
      <div>
        <button type="submit" className="btn btn-sm btn-primary me-2">Save</button>
        <button type="button" className="btn btn-sm btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default QuestionEditForm;
