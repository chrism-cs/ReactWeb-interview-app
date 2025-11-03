import { useState } from "react";
import { createInterview } from "../api";

/**
 * Renders a form for creating a new interview.
 * 
 * @param props
 * @param props.onAddInterview - Prop from interview Page. Passes a new interview back to the parent.
 * @returns - A form UI for creating interviews.
 */
function InterviewForm({ onAddInterview }) {
  const [title, setTitle] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Draft");
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Handles form submission.
   * @param event
   */
  async function handleSubmit(event) {
    event.preventDefault();

    // Check if required fields are filled (title, job role, status)
    if (!title.trim() || !jobRole.trim() || !status.trim()) {
      setErrorMessage("Please fill in Title and/or Job Role.");
      return;
    }

    try {
      const interviewData = {
        title,
        job_role: jobRole,
        description,
        status,
        username: "s4883507", 
      };

      // The API returns an array, so grab first item
      const response = await createInterview(interviewData);
      const createdInterview = response[0];

      // Pass created interview back to parent component
      onAddInterview(createdInterview);

      // Reset form + clear errors
      setTitle("");
      setJobRole("");
      setDescription("");
      setStatus("Draft");
      setErrorMessage("");
    } catch (err) {
      console.error("Error creating interview:", err);
      setErrorMessage("Failed to create interview. Please try again.");
    }
  }

  return (
    <div className="container-skinny">
      {/* Error message popup */}
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

      {/* The form itself */}
      <form onSubmit={handleSubmit} className="card text-bg-light mb-3">
        <div className="mb-3">
          <label className="form-label">Title *</label>
          <input
            className="form-control"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        {/* Job role */}
        <div className="mb-3">
          <label className="form-label">Job Role *</label>
          <input
            className="form-control"
            type="text"
            value={jobRole}
            onChange={(event) => setJobRole(event.target.value)}
          />
        </div>

        {/* Description (optional) */}
        <div className="mb-3">
          <label className="form-label">Description (optional)</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        {/* Status dropdown */}
        <div className="mb-3">
          <label className="form-label">Status *</label>
          <select
            className="form-select"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        {/* Submit button */}
        <button type="submit" className="btn btn-primary">
          Create Interview
        </button>
      </form>
    </div>
  );
}

export default InterviewForm;
