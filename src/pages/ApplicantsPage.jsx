import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getApplicants, deleteApplicant, getInterview } from "../api";
import NotFound from "./NotFound";

import ArrowLeftIcon from "../assets/arrow-left-square.svg";
import ApplicantForm from "./ApplicantForm";
import ApplicantEditForm from "./ApplicantEditForm";
import ApplicantCard from "./ApplicantCard";

/**
 * Shows and manages applicants for a specific interview. Lets you add, edit, and delete applicants.
 */
function ApplicantsPage() {
  const { id: interviewId } = useParams();

  // States 
  const [applicantList, setApplicantList] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingApplicant, setEditingApplicant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [doesInterviewExist, setDoesInterviewExist] = useState(true);
  const [copiedMessage, setCopiedMessage] = useState("");

  // Load applicants from API when page first loads or when interviewId changes
  useEffect(() => {
    async function loadApplicants() {
      try {
        // First check if interview exists
        const interviewData = await getInterview(interviewId);
        if (!interviewData || interviewData.length === 0) {
          setDoesInterviewExist(false);
          setIsLoading(false);
          return;
        }

        // If interview exists, fetch applicants
        const applicantsFromApi = await getApplicants(interviewId);
        setApplicantList(applicantsFromApi);
      } catch (error) {
        console.error("Error fetching applicants:", error);
        setDoesInterviewExist(false);
      } finally {
        setIsLoading(false);
      }
    }

    loadApplicants();
  }, [interviewId]);

  /**
   * Delete applicant from backend + update state
   * @param {*} applicantId - the applicants id
   */
  async function handleDelete(applicantId) {
    await deleteApplicant(applicantId);
    setApplicantList(applicantList.filter((a) => a.id !== applicantId));
  }

  /**
   * Add new applicant from form into state
   * @param {*} newApplicant - the new applicant to add
   */
  function handleAddApplicant(newApplicant) {
    setApplicantList([...applicantList, newApplicant]);
    setIsFormVisible(false);
  }

  /**
   * Save updates for applicant in state
   * @param {*} updatedApplicant - The new updated information
   */
  function handleSaveApplicant(updatedApplicant) {
    const updatedList = applicantList.map((applicant) =>
      applicant.id === updatedApplicant.id ? updatedApplicant : a
    );
    setApplicantList(updatedList);
    setEditingApplicant(null);
    setIsFormVisible(false);
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading applicants...</span>
        </div>
      </div>
    );
  }

  if (!doesInterviewExist) {
    return <NotFound />;
  }

  return (
    <div className="container-narrow">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Applicants Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingApplicant(null);
            setIsFormVisible(!isFormVisible);
          }}
        >
          {editingApplicant ? "Edit Applicant" : "+ Add Applicant"}
        </button>
      </div>

      <Link to="/" className="btn btn-link mb-2 d-inline-flex align-items-center">
        <img src={ArrowLeftIcon} alt="Back" width="16" height="16" className="me-1" />
        Back to Interviews
      </Link>

      {isFormVisible && !editingApplicant && (
        <ApplicantForm
          interviewId={interviewId}
          onAddApplicant={handleAddApplicant}
          onCancel={() => setIsFormVisible(false)}
        />
      )}

      {isFormVisible && editingApplicant && (
        <ApplicantEditForm
          applicant={editingApplicant}
          onSave={handleSaveApplicant}
          onCancel={() => {
            setEditingApplicant(null);
            setIsFormVisible(false);
          }}
        />
      )}

      {copiedMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {copiedMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setCopiedMessage("")}
          ></button>
        </div>
      )}

      <div className="row g-4">
        {applicantList.length === 0 ? (
          <p className="text-muted text-center">No applicants yet.</p>
        ) : (
          applicantList.map((applicant) => (
            <ApplicantCard
              key={applicant.id}
              applicant={applicant}
              onEdit={(a) => {
                setEditingApplicant(a);
                setIsFormVisible(true);
              }}
              onDelete={handleDelete}
              onCopyLink={(msg) => setCopiedMessage(msg)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ApplicantsPage;
