import PencilIcon from "../assets/pencil.svg";
import TrashIcon from "../assets/trash.svg";
import QuestionEditForm from "./QuestionEditForm";

/**
 * Renders a single question card.
 * Switches between view mode and edit mode.
 * 
 * @param props.question - The question object to display (id, text, difficulty).
 * @param props.editingQuestionId - The id of the question currently being edited.
 * @param props.setEditingQuestionId - Callback to switch which question is in edit mode.
 * @param props.onSave - Called when the question is successfully edited.
 * @param props.onDelete - Called when the question should be deleted.
 * @returns - A card showing a single question.
 */
function QuestionCard({
  question,
  editingQuestionId,
  setEditingQuestionId,
  onSave,
  onDelete,
}) {
  /**
   * Returns a Bootstrap badge class depending on difficulty level.
   * 
   * @param difficulty - The difficulty level of the question
   * @returns - A Bootstrap class name for styling the badge
   */
  function getDifficultyBadge(difficulty) {
    if (difficulty === "Easy") return "badge bg-success";
    if (difficulty === "Intermediate") return "badge bg-warning text-dark";
    if (difficulty === "Advanced") return "badge bg-danger";
    return "badge bg-secondary";
  }

  // If the card's question is the one being edited, show teh edit form
  if (editingQuestionId === question.id) {
    return (
      <div className="col-md-4">
        <div className="card h-100 shadow-sm">
          <div className="card-body d-flex flex-column">
            <QuestionEditForm
              question={question}
              onSave={onSave}
              onCancel={() => setEditingQuestionId(null)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-md-4">
      <div className="card h-100 shadow-sm">
        <div className="card-body d-flex flex-column">
          {/* Question text */}
          <h5 className="card-title">{question.question}</h5>

          {/* Difficulty badge */}
          <p>
            <span className={getDifficultyBadge(question.difficulty)}>
              {question.difficulty}
            </span>
          </p>

          {/* Action buttons */}
          <div className="mt-auto">
            <button
              className="btn btn-sm btn-outline-primary me-2"
              onClick={() => setEditingQuestionId(question.id)}
            >
              <img
                src={PencilIcon}
                alt="Edit"
                width="14"
                height="14"
                className="me-1"
              />
              Edit
            </button>
            
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => onDelete(question.id)}
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

export default QuestionCard;
