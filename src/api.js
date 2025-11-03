// Base URL for the Interview App RESTful API
const API_BASE_URL = 'REDACTED';

const JWT_TOKEN = 'REDACTED';

const USERNAME = 'REDACTED';

/**
 * Helper function to handle API requests.
 * It sets the Authorization token and optionally includes the request body.
 * 
 * @param {string} endpoint - The API endpoint to call.
 * @param {string} [method='GET'] - The HTTP method to use (GET, POST, PATCH).
 * @param {object} [body=null] - The request body to send, typically for POST or PATCH.
 * @returns {Promise<object>} - The JSON response from the API.
 * @throws Will throw an error if the HTTP response is not OK.
 */
async function apiRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JWT_TOKEN}`,
    },
  };

  // For POST/PATCH, request full object back
  if (method === 'POST' || method === 'PATCH') {
    options.headers['Prefer'] = 'return=representation';
  }

  // Add body with username if provided
  if (body) {
    options.body = JSON.stringify({ ...body, username: USERNAME });
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // DELETE requests usually return no content
  if (method === 'DELETE') {
    return;
  }

  // Otherwise parse as JSON
  return response.json();
}

/**
 * Function to insert a new project into the database.
 * 
 * @param {object} project - The project data to insert.
 * @returns {Promise<object>} - The created project object returned by the API.
 */
export async function createInterview(interview) {
  return apiRequest('/interview', 'POST', interview);
}

/**
 * Function to list all projects associated with the current user.
 * 
 * @returns {Promise<Array>} - An array of project objects.
 */
export async function getInterviews() {
  return apiRequest('/interview');
}

/**
 * Function to get a single project by its ID.
 * The url is slightly different from usual RESTFul ...
 * See the operators section https://docs.postgrest.org/en/v12/references/api/tables_views.html
 * @param {string} id - The ID of the project to retrieve.
 * @returns {Promise<object>} - The project object matching the ID.
 */
export async function getInterview(id) {
  return apiRequest(`/interview?id=eq.${id}`);
}

// Extra functions I added

/**
 * Deletes APi based off of ID
 * @param {string} id - The ID of the project to retrieve.
 * @returns {Promise<object>} - The removal of a project object.
 */
export async function deleteInterview(id) {
  return apiRequest(`/interview?id=eq.${id}`, "DELETE");
}

/**
 * Update an interview by ID
 * @param {string} id - The ID of the interview to update.
 * @param {object} updates - The fields to update.
 * @returns {Promise<object>} - The updated interview object.
 */
export async function updateInterview(id, updates) {
  return apiRequest(`/interview?id=eq.${id}`, 'PATCH', updates);
}

/**
 * Fetch all qeustions for a given interview. 
 * @param {number} interviewId - The ID of the interview. 
 * @returns {Promise<Array>} - An array of questions.
 */
export async function getQuestions(interviewId) {
  return apiRequest(`/question?interview_id=eq.${interviewId}`);
}

/**
 * Create a new question for a given interview.
 * @param {number} interviewId - The ID of the interview.
 * @param {object} question - The question data 
 * @returns {Promise<object>} - The created question object. 
 */
export async function createQuestion(interviewId, question) {
  return apiRequest('/question', 'POST', {
    ...question,
    interview_id: interviewId
  });
}

/**
 * Update an existing question by ID.
 * @param {number} id - The question ID.
 * @param {object} updates - The fields to update (e.g., { question: "Updated text", difficulty: "Intermediate" }).
 * @returns {Promise<object>} - The updated question object.
 */
export async function updateQuestion(id, updates) {
  return apiRequest(`/question?id=eq.${id}`, 'PATCH', updates);
}


/**
 * Delete a question by ID.
 * @param {number} id - The question ID.
 * @returns {Promise<void>}
 */
export async function deleteQuestion(id) {
  return apiRequest(`/question?id=eq.${id}`, 'DELETE');
}

/**
 * Fetch all applicants for a given interview.
 * @param {number} interviewId - The ID of the interview. 
 * @returns {Promise<Array>} - An array of applicants.
 */
export async function getApplicants(interviewId) {
  return apiRequest(
    `/applicant?interview_id=eq.${interviewId}&select=id,title,firstname,surname,phone_number,email_address,interview_status,interview:interview_id(id,title)`
  );
}

/**
 * Create a new applicant for a given interview.
 * @param {number} interviewId - The ID of the interview.
 * @param {object} applicant - Applicant data (title, firstname, surname, phone, email, status).
 * @returns {Promise<object>} - The created applicant object.
 */
export async function createApplicant(interviewId, applicant) {
  return apiRequest('/applicant', 'POST', {
    interview_id: interviewId, 
    title: applicant.title,
    firstname: applicant.firstname,
    surname: applicant.surname,
    phone_number: applicant.phone_number,
    email_address: applicant.email_address,
    interview_status: applicant.interview_status
  });
}

/**
 * Update an existing applicant by ID.
 * @param {number} id - The applicant ID.
 * @param {object} updates - Fields to update (e.g., { status: "Completed" }).
 * @returns {Promise<object>} - The updated applicant object.
 */
export async function updateApplicant(id, updates) {
  return apiRequest(`/applicant?id=eq.${id}`, 'PATCH', updates);
}

/**
 * Delete an applicant by ID.
 * @param {number} id - The applicant ID.
 * @returns {Promise<void>}
 */
export async function deleteApplicant(id) {
  return apiRequest(`/applicant?id=eq.${id}`, 'DELETE');
}

/**
 * Fetch a single applicant by ID.
 * @param {number} applicantId - The applicant's ID.
 * @returns {Promise<object>} - The applicant object.
 */
export async function getApplicant(applicantId) {
  const data = await apiRequest(`/applicant?id=eq.${applicantId}`);
  return data[0]; // PostgREST returns an array
}

/**
 * Create an answer record for an applicant + question
 */
export async function createAnswer(applicantId, interviewId, questionId, answerText) {
  return apiRequest('/applicant_answer', 'POST', {
    interview_id: interviewId,
    question_id: questionId,
    applicant_id: applicantId,
    answer: answerText
  });
}

/**
 * Fetch all answers for a given applicant
 */
export async function getApplicantAnswers(applicantId) {
  return apiRequest(`/applicant_answer?applicant_id=eq.${applicantId}&select=id,answer,question:question_id(id,question)`);
}