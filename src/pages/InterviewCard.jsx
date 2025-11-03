import { Link } from "react-router-dom";
import PencilIcon from "../assets/pencil.svg";
import TrashIcon from "../assets/trash.svg";

/**
 * A small, pure component that renders a single interview card.
 * 
 * @param props
 * @param props.interview - The interview data to display.
 * @param props.onDelete - Tells the parent to delete the selected itnerview.
 * @returns - The interview card
 */
function InterviewCard({ interview, onDelete }) {
  /**
   * Returns a Bootstrap badge class depending on the interview status.
   * @param {*} status - The status of the interview 
   * @returns - The bootstrap badge
   */
  function getStatusBadge(status) {
    if (status === "Draft") return "badge bg-warning text-dark";
    if (status === "Published") return "badge bg-success";
    if (status === "Archived") return "badge bg-secondary";
    return "badge bg-light text-dark";
  }

  return (
    <div className="col-md-4">
      <div className="card h-100 shadow-sm">
        <div className="card-body d-flex flex-column">
          {/* Title + Role */}
          <h5 className="card-title">{interview.title}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{interview.job_role}</h6>

          {/* Description (optional) */}
          {interview.description && (
            <>
              <strong>Description:</strong>
              <p
                className="card-text text-truncate"
                title={interview.description}
              >
                {interview.description}
              </p>
            </>
          )}

          {/* Status */}
          <p className="mb-1">
            <strong>Status: </strong>
            <span className={getStatusBadge(interview.status)}>
              {interview.status}
            </span>
          </p>

          {/* Questions count */}
          <p className="mb-1">
            <Link
              to={`/interview/${interview.id}/questions`}
              className="text-decoration-none"
            >
              {interview.questionsCount ?? 0} Questions
            </Link>
          </p>

          {/* Applicants count */}
          <p className="mb-3">
            <Link
              to={`/interview/${interview.id}/applicants`}
              className="text-decoration-none"
            >
              {interview.applicantsCount ?? 0} Applicants
            </Link>
            <br />
            <small className="text-muted">
              {interview.applicantsCompleted ?? 0} completed /{" "}
              {interview.applicantsPending ?? 0} pending
            </small>
          </p>

          {/* Action buttons */}
          <div className="mt-auto d-flex">
            {/* Edit button */}
            <Link
              to={`/edit/${interview.id}`}
              className="btn btn-sm btn-outline-primary me-2"
            >
              <img
                src={PencilIcon}
                alt="Edit"
                width="14"
                height="14"
                className="me-1"
              />
              Edit
            </Link>

            {/* Delete button */}
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => onDelete(interview.id)}
            >
              <img
                src={TrashIcon}
                alt="Delete"
                width="14"
                height="14"
                className="me-1"
              />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewCard;
