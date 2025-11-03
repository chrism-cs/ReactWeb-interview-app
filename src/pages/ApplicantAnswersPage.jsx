import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getApplicantAnswers } from "../api";

/**
 * Shows all answers given by a single applicant,
 * with the option to generate an AI summary.
 */
function ApplicantAnswersPage() {
  const { applicantId } = useParams();
  const navigate = useNavigate();

  const [answerList, setAnswerList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  /**
   * Load answers once when the page opens.
   */
  useEffect(() => {
    async function loadAnswers() {
      try {
        const answersFromApi = await getApplicantAnswers(applicantId);
        setAnswerList(answersFromApi);
      } catch (err) {
        console.error("Error fetching answers:", err);
        alert("Sorry, we could not load the applicant's answers.");
      } finally {
        setIsLoading(false);
      }
    }

    loadAnswers();
  }, [applicantId]);

  /**
   * Call backend to summarize answers with AI.
   */
  async function handleSummarize() {
    try {
      setIsSummarizing(true);

      // Build one big text block with all questions + answers
      const textToSummarize = answerList
        .map((a) => `Q: ${a.question?.question}\nA: ${a.answer}`)
        .join("\n\n");

      // Call backend /summarize endpoint
      const response = await fetch("http://localhost:5000/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: textToSummarize }),
      });

      if (!response.ok) {
        throw new Error("Failed to summarize answers");
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      console.error("Summarization failed:", err);
      alert("Sorry, we could not summarize the answers.");
    } finally {
      setIsSummarizing(false);
    }
  }

  if (isLoading) return <p>Loading answers...</p>;

  return (
    <div className="container-narrow">
      {/* Back button */}
      <button onClick={() => navigate(-1)} className="btn btn-link mb-3">
        Back to Applicants
      </button>

      <h2 className="mb-3">Applicant Answers</h2>

      {/* Answers table */}
      {answerList.length > 0 ? (
        <table className="table table-bordered table-light">
          <thead>
            <tr>
              <th>Question</th>
              <th>Answer</th>
            </tr>
          </thead>
          <tbody>
            {answerList.map((ans) => (
              <tr key={ans.id}>
                <td>{ans.question?.question || `Question ${ans.question_id}`}</td>
                <td>{ans.answer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-muted">No answers recorded for this applicant.</p>
      )}

      {/* Summarize button */}
      {answerList.length > 0 && (
        <div>
          <button
            onClick={handleSummarize}
            disabled={isSummarizing}
            className="btn btn-primary my-3"
          >
            {isSummarizing ? "Summarizing..." : "Summarize Answers"}
          </button>
        </div>
      )}

      {/* Show summary */}
      {summary && (
        <div className="alert alert-info mt-3">
          <h5>Summary</h5>
          <ul>
            {summary
              .split("\n")
              .filter((line) => line.trim() !== "")
              .map((line, idx) => (
                <li key={idx}>{line.trim()}</li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ApplicantAnswersPage;
