import { Link } from "react-router-dom";
import PencilIcon from "../assets/pencil.svg";
import TrashIcon from "../assets/trash.svg";
import ClipboardIcon from "../assets/clipboard.svg";
import EyeIcon from "../assets/eye.svg";
import PlayIcon from "../assets/play.svg";

/**
 * Pure presentational component for a single applicant.
 */
function ApplicantCard({ applicant, onEdit, onDelete, getStatusBadge, onCopyLink }) {
  async function handleCopyLink() {
    const link = `${window.location.origin}/take/${applicant.id}`;
    await navigator.clipboard.writeText(link);
    onCopyLink("Interview link copied to clipboard!");
  }

  /**
   * Returns a Bootstrap badge class depending on applicant status.
   * @param status - The applicant's interview status
   * @returns - Bootstrap badge class
   */
  function getStatusBadge(status) {
    if (status === "Completed") return "badge bg-success";
    if (status === "Not Started") return "badge bg-secondary";
    return "badge bg-light text-dark";
  }

  return (
    <div className="col-md-4">
      <div className="card h-100 shadow-sm">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">
            {applicant.title} {applicant.firstname} {applicant.surname}
          </h5>
          <h6 className="card-subtitle mb-2 text-muted">{applicant.email_address}</h6>

          <p className="mb-1"><strong>Phone:</strong> {applicant.phone_number}</p>
          <p className="mb-1"><strong>Interview:</strong> {applicant.interview?.title || "Unknown"}</p>
          <p className="mb-3">
            <span className={getStatusBadge(applicant.interview_status)}>
              {applicant.interview_status}
            </span>
          </p>

          <div className="mt-auto d-flex flex-wrap gap-2">
            <button
              className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center"
              onClick={handleCopyLink}
            >
              <img src={ClipboardIcon} alt="Copy" width="14" height="14" className="me-1" />
              Copy Link
            </button>

            <Link to={`/applicant/${applicant.id}/answers`} className="btn btn-sm btn-outline-success d-inline-flex align-items-center">
              <img src={EyeIcon} alt="View" width="14" height="14" className="me-1" />
              View Answers
            </Link>

            <Link to={`/take/${applicant.id}`} className="btn btn-sm btn-outline-primary d-inline-flex align-items-center">
              <img src={PlayIcon} alt="Take" width="14" height="14" className="me-1" />
              Take Interview
            </Link>

            <button className="btn btn-sm btn-outline-primary d-inline-flex align-items-center" onClick={() => onEdit(applicant)}>
              <img src={PencilIcon} alt="Edit" width="14" height="14" className="me-1" />
              Edit
            </button>

            <button className="btn btn-sm btn-outline-danger d-inline-flex align-items-center" onClick={() => onDelete(applicant.id)}>
              <img src={TrashIcon} alt="Delete" width="14" height="14" className="me-1" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicantCard;