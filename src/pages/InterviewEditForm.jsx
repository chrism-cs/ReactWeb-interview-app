import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getInterview, updateInterview } from "../api";

/**
 * A form for editing an existing interview.
 */
function InterviewEditForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form fields
  const [title, setTitle] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Draft");

  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Load the interview data once when the page loads.
   */
  useEffect(() => {
    async function fetchInterview() {
      try {
        const data = await getInterview(id);

        // The API gives back an array, so just take the first item
        if (data && data.length > 0) {
          const interview = data[0];

          // Fill form with existing data
          setTitle(interview.title);
          setJobRole(interview.job_role);
          // Description can be null
          setDescription(interview.description || "");
          setStatus(interview.status);
        } else {
          setErrorMessage("Interview not found.");
        }
      } catch (error) {
        console.error(error);
        setErrorMessage("Failed to load interview data.");
      }
    }

    fetchInterview();
  }, [id]);

  /**
   * Handles saving changes when user submits the form.
   * 
   * @param event - The form submission event passed in autmatically by react
   */
  async function handleSubmit(event) {
    // Prevent from automatically reloading 
    event.preventDefault();

    try {
      await updateInterview(id, {
        title: title,
        job_role: jobRole,
        description: description,
        status: status,
        username: "s4883507", // replace with your student id
      });

      // Go back home after saving
      navigate("/");
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to update interview. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
      <h2>Edit Interview</h2>

      {/* Error message */}
      {errorMessage !== "" && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {errorMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setErrorMessage("")}
          ></button>
        </div>
      )}

      {/* Title */}
      <div className="mb-3">
        <label className="form-label">Title *</label>
        <input
          className="form-control"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </div>

      {/* Job Role */}
      <div className="mb-3">
        <label className="form-label">Job Role *</label>
        <input
          className="form-control"
          value={jobRole}
          onChange={(event) => setJobRole(event.target.value)}
          required
        />
      </div>

      {/* Description */}
      <div className="mb-3">
        <label className="form-label">Description (optional)</label>
        <textarea
          className="form-control"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      {/* Status */}
      <div className="mb-3">
        <label className="form-label">Status *</label>
        <select
          className="form-select"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          required
        >
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
          <option value="Archived">Archived</option>
        </select>
      </div>

      {/* Buttons */}
      <button type="submit" className="btn btn-primary mb-3 me-2">
        Done
      </button>
      <button
        type="button"
        className="btn btn-secondary me-2"
        onClick={() => navigate("/")}
      >
        Cancel
      </button>
    </form>
  );
}

export default InterviewEditForm;
