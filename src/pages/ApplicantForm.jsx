import { useState } from "react";
import { createApplicant } from "../api";

/**
 * A form component for creating a new applicant.
 * 
 * @param props
 * @param props.interviewId - The ID of the interview this applicant belongs to.
 * @param props.onAddApplicant - Callback to send the new applicant back to the parent component.
 * @param props.onCancel - Callback to cancel and close the form.
 * @returns - The rendered applicant form.
 */
function ApplicantForm({ interviewId, onAddApplicant, onCancel }) {
  // input field states
  const [title, setTitle] = useState("");
  const [firstname, setFirstname] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("Not Started");
  
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Handles form submission.
   * 
   * @param {*} event - The form submission event
   */
  async function handleSubmit(event) {
    event.preventDefault();

    // Check if users have submitted all required fields
    if (!title || !firstname || !surname || !phone || !email) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    try {
      // Build applicant object for backend
      const applicantData = {
        title,
        firstname,
        surname,
        phone_number: phone,
        email_address: email,
        interview_status: status,
      };

      // API returns an array, so grab the first item
      const [createdApplicant] = await createApplicant(interviewId, applicantData);
      // Send new applicant back to parent
      onAddApplicant(createdApplicant);

      setTitle("");
      setFirstname("");
      setSurname("");
      setPhone("");
      setEmail("");
      setStatus("Not Started");
      setErrorMessage("");
    } catch (err) {
      console.error("Error creating applicant:", err);
      setErrorMessage("Failed to save applicant. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-3 mb-4">
      <h5>Add Applicant</h5>

      {errorMessage && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {errorMessage}
          <button type="button" className="btn-close" onClick={() => setErrorMessage("")}></button>
        </div>
      )}

      {/* Fields */}
      <div className="mb-3">
        <label className="form-label">Title *</label>
        <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label">First Name *</label>
        <input className="form-control" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label">Surname *</label>
        <input className="form-control" value={surname} onChange={(e) => setSurname(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label">Phone *</label>
        <input className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label">Email *</label>
        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label">Status *</label>
        <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Not Started">Not Started</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary me-2 mb-3">Save</button>
      <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>Cancel</button>
    </form>
  );
}

export default ApplicantForm;
