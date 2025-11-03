import { useEffect, useState } from "react";
import {
  getInterviews,
  deleteInterview,
  getQuestions,
  getApplicants,
} from "../api";
import InterviewForm from "./InterviewForm";
import InterviewCard from "./InterviewCard";

/**
 * Loads all interviews from the API
 * @returns - The InterviewPage component
 */
function InterviewPage() {
  // State to hold the list of interviews
  const [interviews, setInterviews] = useState([]);
  // State to track if interviews are still loading
  const [isLoading, setIsLoading] = useState(true);
  // State to toggle visibility of the "Add Interview" form
  const [showAddForm, setShowAddForm] = useState(false);

  // Runs once only at start
  useEffect(() => {
    /**
     * Load all interviews from the API and set them into state
     */
    async function loadInterviews() {
      // Set to true before fetching
      setIsLoading(true);

      // Call get interviews to fetch all interviews from backend
      try {
        const interviewsFromApi = await getInterviews();

        // For each interview, also fetch its questions and applicants
        const interviewsWithCounts = await Promise.all(
          interviewsFromApi.map(async (interview) => {
            // Fetch the questions and applicants for that specific interview
            const questions = await getQuestions(interview.id);
            const applicants = await getApplicants(interview.id);

            // Count how many applicants finished the interview
            const completedCount = applicants.filter(
              (applicant) => applicant.interview_status === "Completed"
            ).length;
            
            // Return the new interview objects.
            return {
              ...interview,
              questionsCount: questions.length,
              applicantsCount: applicants.length,
              applicantsCompleted: completedCount,
              applicantsPending: applicants.length - completedCount,
            };
          })
        );

        // Save the new interview list with the extra data into interviews state.
        setInterviews(interviewsWithCounts);
      } catch (error) {
        // Log any errors from API requests
        console.error("Error loading interviews:", error);
      } finally {
        // Stop loading spinner
        setIsLoading(false);
      }
    }
    
    // Run the above function as soon as the component mounts
    loadInterviews();
  }, []);

  /**
   * Add a new interview 
   * @param {*} newInterview - The new interview to add
   */
  function addInterview(newInterview) {
    setInterviews([...interviews, newInterview]);
    setShowAddForm(false);
  }

  /**
   * Delete an interview 
   * @param {*} interviewId interviewId The ID of the interview to delete
   */
  function removeInterview(interviewId) {
    deleteInterview(interviewId);
    
    // Remove the deleted interview from the list we show on screen
    const updatedList = interviews.filter(
      // Keep this interview, only if it is not equal to the id we want
      (interview) => interview.id !== interviewId
    );
    setInterviews(updatedList);
  }

  // Show spinner if the loading value is true
  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading interviews...</span>
        </div>
      </div>
    );
  }

  // Main page content
  return (
    <div className="container-narrow">
      {/* Page title + add button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Interviews</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Cancel" : "+ Add Interview"}
        </button>
      </div>

      {/* Add interview form */}
      {showAddForm && (
        <div className="mb-4">
          <InterviewForm onAddInterview={addInterview} />
        </div>
      )}

      {/* Show interview cards or fallback message 
      only show if the length isn't equal to 0
      */}
      <div className="row g-4">
        {interviews.length === 0 ? (
          <p className="text-muted text-center">No interviews yet.</p>
        ) : (
          interviews.map((interview) => (
            <InterviewCard
              key={interview.id}
              interview={interview}
              onDelete={removeInterview}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default InterviewPage;
