import { useState, useEffect } from "react";
import { updateApplicant } from "../api";

/**
 * A form that lets the user edit an existing applicant’s information.
 * 
 * @param props
 * @param props.applicant - The applicant object we want to edit.
 * @param props.onSave - Callback for when the applicant is successfully updated.
 * @param props.onCancel - Callback for when the user cancels editing.
 * @returns - The edit form UI.
 */
function ApplicantEditForm({ applicant, onSave, onCancel }) {
  // Keep track of the input fields
  const [title, setTitle] = useState(applicant.title);
  const [firstname, setFirstname] = useState(applicant.firstname);
  const [surname, setSurname] = useState(applicant.surname);
  const [phone, setPhone] = useState(applicant.phone_number);
  const [email, setEmail] = useState(applicant.email_address);
  const [status, setStatus] = useState(applicant.interview_status);
  
  const [errorMessage, setErrorMessage] = useState("");
  
  /**
   * Runs whenever the applicant prop changes
   */
  useEffect(() => {
    setTitle(applicant.title);
    setFirstname(applicant.firstname);
    setSurname(applicant.surname);
    setPhone(applicant.phone_number);
    setEmail(applicant.email_address);
    setStatus(applicant.interview_status);
  }, [applicant]);

  /**
   * Handles form submission
   * @param event - The form submission event  
   */
  async function handleSubmit(event) {
    event.preventDefault();

    // Make sure all required fields are filled
    if (!title || !firstname || !surname || !phone || !email) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    try {
      // Build object for API request
      const applicantData = {
        title,
        firstname,
        surname,
        phone_number: phone,
        email_address: email,
        interview_status: status,
      };

      // API returns an array, so take the first item
      const [updatedApplicant] = await updateApplicant(applicant.id, applicantData);

      // Send updated applicant back to parent
      onSave(updatedApplicant);

      setErrorMessage("");
    } catch (err) {
      console.error("Error updating applicant:", err);
      setErrorMessage("Failed to update applicant. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-3 mb-4">
      <h5>Edit Applicant</h5>

      {errorMessage && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {errorMessage}
          <button type="button" className="btn-close" onClick={() => setErrorMessage("")}></button>
        </div>
      )}

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

      <button type="submit" className="btn btn-primary me-2">Update</button>
      <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
    </form>
  );
}

export default ApplicantEditForm;
