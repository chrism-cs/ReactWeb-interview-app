import { Routes, Route } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";

import InterviewPage from "./pages/InterviewPage";
import InterviewEditForm from "./pages/InterviewEditForm";
import QuestionsPage from "./pages/QuestionsPage";
import ApplicantsPage from "./pages/ApplicantsPage";
import TakeInterviewPage from "./pages/TakeInterviewPage";
import ApplicantAnswersPage from "./pages/ApplicantAnswersPage";
import NotFound from "./pages/NotFound";

/**
 * Main App component.
 * Only responsible for routing between pages.
 */
function App() {
  return (
    <>
      <Header />

      <main className="mt-4">
        {/* Define all routes for the app.*/}
        <Routes>
          {/* When URL is /, show the InterviewPage which is basically home page*/}
          <Route path="/" element={<InterviewPage />} />
          <Route path="/edit/:id" element={<InterviewEditForm />} />
          <Route path="/interview/:id/questions" element={<QuestionsPage />} />
          <Route path="/interview/:id/applicants" element={<ApplicantsPage />} />
          <Route path="/take/:applicantId" element={<TakeInterviewPage />} />
          <Route
            path="/applicant/:applicantId/answers"
            element={<ApplicantAnswersPage />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
