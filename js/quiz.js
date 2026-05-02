/**
 * @module Quiz
 * Handles the interactive knowledge quiz feature including scoring and feedback.
 */

/**
 * Quiz dataset containing questions, options, correct indices, and explanations.
 * @const {Array<Object>}
 */
export const quizData = [
    {
        question: "What does EVM stand for?",
        options: [
            "Election Voting Mechanism",
            "Electronic Voting Machine",
            "Electoral Verification Method",
            "Electronic Verification Module"
        ],
        correct: 1,
        explanation: "EVM stands for Electronic Voting Machine, which replaced paper ballots in India."
    },
    {
        question: "Who oversees the election process at the national level in India?",
        options: [
            "The Supreme Court",
            "The Prime Minister's Office",
            "Election Commission of India (ECI)",
            "Parliament"
        ],
        correct: 2,
        explanation: "The Election Commission of India (ECI) is the autonomous constitutional body responsible for administering elections."
    },
    {
        question: "What is the purpose of VVPAT?",
        options: [
            "To register new voters",
            "To count votes automatically",
            "To provide a paper trail verifying the cast vote",
            "To announce election dates"
        ],
        correct: 2,
        explanation: "VVPAT (Voter Verifiable Paper Audit Trail) prints a slip allowing the voter to verify that their vote was recorded correctly."
    },
    {
        question: "When does the Model Code of Conduct come into effect?",
        options: [
            "1 month before polling",
            "Immediately after the announcement of the election schedule",
            "On the day of polling",
            "After the results are declared"
        ],
        correct: 1,
        explanation: "The MCC comes into effect immediately as soon as the ECI announces the election schedule."
    },
    {
        question: "What is the minimum voting age in India?",
        options: ["16", "18", "21", "25"],
        correct: 1,
        explanation: "The voting age was lowered from 21 to 18 years by the 61st Constitutional Amendment Act in 1988."
    }
];

let currentQuestion = 0;
let score = 0;
let hasAnswered = false;

/**
 * Initializes the quiz module listeners and state.
 */
export function initQuiz() {
    const nextBtn = document.getElementById('next-q-btn');
    const restartBtn = document.getElementById('restart-quiz');
    const qTotalEl = document.getElementById('q-total');

    if (nextBtn) nextBtn.addEventListener('click', handleNextQuestion);
    if (restartBtn) restartBtn.addEventListener('click', startQuiz);
    if (qTotalEl) qTotalEl.textContent = quizData.length;
    
    startQuiz();
}

/**
 * Resets and starts the quiz from the first question.
 */
export function startQuiz() {
    currentQuestion = 0;
    score = 0;
    hasAnswered = false;
    
    const scoreValEl = document.getElementById('score-val');
    const quizContainer = document.getElementById('quiz-container');
    const resultContainer = document.getElementById('result-container');

    if (scoreValEl) scoreValEl.textContent = score;
    if (quizContainer) quizContainer.classList.remove('hidden');
    if (resultContainer) resultContainer.classList.add('hidden');
    
    loadQuestion();
}

/**
 * Loads the current question data into the UI.
 * @private
 */
function loadQuestion() {
    hasAnswered = false;
    const q = quizData[currentQuestion];
    
    const qCurrentEl = document.getElementById('q-current');
    const qTextEl = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const feedbackEl = document.getElementById('quiz-feedback');
    const nextBtn = document.getElementById('next-q-btn');

    if (qCurrentEl) qCurrentEl.textContent = currentQuestion + 1;
    if (qTextEl) qTextEl.textContent = q.question;
    
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        const fragment = document.createDocumentFragment();
        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.setAttribute('aria-label', `Option ${index + 1}: ${opt}`);
            btn.addEventListener('click', () => selectOption(index, btn));
            fragment.appendChild(btn);
        });
        optionsContainer.appendChild(fragment);
    }
    
    if (feedbackEl) {
        feedbackEl.classList.add('hidden');
        feedbackEl.className = 'quiz-feedback hidden';
    }
    
    if (nextBtn) nextBtn.classList.add('hidden');
}

/**
 * Validates the selected option and provides immediate feedback.
 * @param {number} selectedIndex - The index of the chosen option.
 * @param {HTMLElement} btnEl - The button element that was clicked.
 * @private
 */
function selectOption(selectedIndex, btnEl) {
    if (hasAnswered) return;
    hasAnswered = true;
    
    const q = quizData[currentQuestion];
    const buttons = document.querySelectorAll('.option-btn');
    const feedbackEl = document.getElementById('quiz-feedback');
    const nextBtn = document.getElementById('next-q-btn');
    const scoreValEl = document.getElementById('score-val');
    
    buttons.forEach(btn => btn.disabled = true);
    
    if (selectedIndex === q.correct) {
        btnEl.classList.add('correct');
        score++;
        if (scoreValEl) scoreValEl.textContent = score;
        feedbackEl.textContent = `Correct! ${q.explanation}`;
        feedbackEl.classList.add('success');
    } else {
        btnEl.classList.add('wrong');
        buttons[q.correct].classList.add('correct'); 
        feedbackEl.textContent = `Incorrect. ${q.explanation}`;
        feedbackEl.classList.add('error');
    }
    
    feedbackEl.classList.remove('hidden');
    if (nextBtn) nextBtn.classList.remove('hidden');
}

/**
 * Proceeds to the next question or shows results if at the end.
 * @private
 */
function handleNextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

/**
 * Transitions to the final results view with a summary message.
 * @private
 */
function showResults() {
    const quizContainer = document.getElementById('quiz-container');
    const resultContainer = document.getElementById('result-container');
    const finalScoreEl = document.getElementById('final-score');
    const resultMessageEl = document.getElementById('result-message');

    if (quizContainer) quizContainer.classList.add('hidden');
    if (resultContainer) resultContainer.classList.remove('hidden');
    if (finalScoreEl) finalScoreEl.textContent = `${score} / ${quizData.length}`;
    
    let message = "";
    const percentage = score / quizData.length;
    
    if (percentage === 1) message = "Perfect! You are an election expert.";
    else if (percentage >= 0.6) message = "Great job! You know the system well.";
    else message = "Good effort! Check out the 'Learn System' section to brush up.";
    
    if (resultMessageEl) resultMessageEl.textContent = message;
}
