import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  getInterview,
  getQuestions,
  updateApplicant,
  getApplicant,
  createAnswer,
} from "../api";
import { getTranscriber } from "../ai/ai";
import { read_audio } from "@huggingface/transformers";

/**
 * Manages the applicant interview flow
 */
function TakeInterviewPage() {
  const { applicantId } = useParams();

  // State for API data
  const [applicant, setApplicant] = useState(null);
  const [interview, setInterview] = useState(null);
  const [questions, setQuestions] = useState([]);

  // State for interview progress
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [completed, setCompleted] = useState(false);

  // UI states
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [transcribing, setTranscribing] = useState(false);

  // Recording references
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const lockedQuestionIdRef = useRef(null);

  /**
   * Fetch applicant, interview, and questions when page loads.
   */
  useEffect(() => {
    async function loadData() {
      try {
        // Get applicant details
        const applicantData = await getApplicant(applicantId);
        setApplicant(applicantData);

        // Get interview info
        const interviewData = await getInterview(applicantData.interview_id);
        setInterview(interviewData[0]);

        // Get interview questions
        const questionData = await getQuestions(applicantData.interview_id);
        setQuestions(questionData);
      } catch (err) {
        console.error("Error loading interview:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [applicantId]);

  /**
   * Start or stop recording
   */
  async function toggleRecord() {
    if (recording) {
      // Stop recording
      // If mediaRecorderRef is null, skip
      mediaRecorderRef.current?.stop();
      setRecording(false);
      return;
    }

    // Start recording
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];

    // Save the question we are recording for
    lockedQuestionIdRef.current = questions[currentIndex]?.id;

    // Collect chunks as data becomes available
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    // When recording stops, transcribe the audio
    recorder.onstop = async () => {
      await handleTranscription(stream);
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setRecording(true);
  }

  /**
   * Pause/resume recording
   */
  function togglePause() {
    if (!mediaRecorderRef.current) return;

    if (paused) {
      mediaRecorderRef.current.resume();
      setPaused(false);
    } else {
      mediaRecorderRef.current.pause();
      setPaused(true);
    }
  }

  /**
   * Handle transcription after recording stops.
   */ 
  async function handleTranscription(stream) {
    try {
      setTranscribing(true);

      // Convert recorded chunks into audio
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      const audioData = await read_audio(url, 16000);
      URL.revokeObjectURL(url);

      // Run transcription
      const transcriber = await getTranscriber();
      const result = await transcriber(audioData, {
        chunk_length_s: 30,
        stride_length_s: 5,
      });

      // Extract transcript
      const transcript = (result.text || "").trim();
      const qId = lockedQuestionIdRef.current;

      // Only save if it's not too short
      if (transcript.length > 2) {
        setAnswers((prev) => ({ ...prev, [qId]: transcript }));
        console.log("Saved transcript for Q", qId, transcript);
      } else {
        console.warn("Discarded short/bad transcript:", transcript);
      }
    } catch (err) {
      console.error("Transcription failed:", err);
      alert("Error during transcription. Please try again.");
    } finally {
      // Always stop microphone stream
      stream.getTracks().forEach((t) => t.stop());
      setTranscribing(false);
    }
  }

  /**
   * Submit all answers to backend + mark applicant as completed. 
   */
  async function handleSubmit() {
    try {
      // Save each answer
      for (const [qId, text] of Object.entries(answers)) {
        await createAnswer(applicantId, interview.id, qId, text);
      }
      // Update applicant status
      await updateApplicant(applicantId, { interview_status: "Completed" });
      setCompleted(true);
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Error submitting interview");
    }
  }

  if (loading) return <p>Loading interview…</p>;
  if (!applicant || !interview) return <p>Could not load interview.</p>;

  // Completed screen
  if (completed) {
    return (
      <div className="container mt-4">
        <div className="card p-4 shadow-sm text-center">
          <h2 className="text-success">Thank You!</h2>
          <p>Your responses have been recorded.</p>
        </div>
      </div>
    );
  }

  // Welcome screen
  if (showWelcome) {
    return (
      <div className="container mt-4">
        <div className="card p-4 shadow-sm">
          <h2>Welcome to Your Interview</h2>

          <div className="mb-3">
            <h5>Applicant</h5>
            <p>
              {applicant.title} {applicant.firstname} {applicant.surname}
            </p>
            <p>{applicant.email_address}</p>
          </div>

          <div className="mb-3">
            <h5>Interview</h5>
            <p>{interview.title}</p>
            <p className="text-muted">{interview.job_role}</p>
          </div>

          <button className="btn btn-primary" onClick={() => setShowWelcome(false)}>
            Start Interview
          </button>
        </div>
      </div>
    );
  }

  // Active Interview Screen
  const currentQuestion = questions[currentIndex];

  return (
    <div className="container mt-4">
      <h2>
        Interview for {applicant.firstname} {applicant.surname}
      </h2>

      {questions.length === 0 ? (
        <p>No questions for this interview.</p>
      ) : (
        <div>
          <p>
            <strong>Question {currentIndex + 1}:</strong> {currentQuestion.question}
          </p>

          {/* Recording controls */}
          <button
            className={`btn ${recording ? "btn-danger" : "btn-primary"} me-2`}
            onClick={toggleRecord}
            disabled={transcribing || answers[currentQuestion.id]}
          >
            {recording ? "Stop Recording" : "Start Recording"}
          </button>

          <button
            className="btn btn-warning me-2"
            onClick={togglePause}
            disabled={!recording || transcribing}
          >
            {paused ? "Resume" : "Pause"}
          </button>

          {/* Transcribing message */}
          {transcribing && <p className="mt-3 text-muted">Transcribing answer…</p>}

          {/* Transcript preview */}
          {answers[currentQuestion.id] && !transcribing && (
            <div className="card mt-3">
              <div className="card-body">
                <h5>Transcript</h5>
                <pre>{answers[currentQuestion.id]}</pre>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-3">
            {currentIndex < questions.length - 1 ? (
              <button className="btn btn-primary" onClick={() => setCurrentIndex(currentIndex + 1)}>
                Next
              </button>
            ) : (
              <button className="btn btn-success" onClick={handleSubmit}>
                Submit Interview
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TakeInterviewPage;
