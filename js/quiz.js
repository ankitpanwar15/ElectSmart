// Quiz Module

const quizData = [
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

function initQuiz() {
    document.getElementById('next-q-btn').addEventListener('click', handleNextQuestion);
    document.getElementById('restart-quiz').addEventListener('click', startQuiz);
    
    // Set total questions
    document.getElementById('q-total').textContent = quizData.length;
    startQuiz();
}

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    hasAnswered = false;
    
    document.getElementById('score-val').textContent = score;
    document.getElementById('quiz-container').classList.remove('hidden');
    document.getElementById('result-container').classList.add('hidden');
    
    loadQuestion();
}

function loadQuestion() {
    hasAnswered = false;
    const q = quizData[currentQuestion];
    
    document.getElementById('q-current').textContent = currentQuestion + 1;
    document.getElementById('question-text').textContent = q.question;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => selectOption(index, btn));
        optionsContainer.appendChild(btn);
    });
    
    const feedbackEl = document.getElementById('quiz-feedback');
    feedbackEl.classList.add('hidden');
    feedbackEl.className = 'quiz-feedback hidden';
    
    document.getElementById('next-q-btn').classList.add('hidden');
}

function selectOption(selectedIndex, btnEl) {
    if (hasAnswered) return;
    hasAnswered = true;
    
    const q = quizData[currentQuestion];
    const buttons = document.querySelectorAll('.option-btn');
    const feedbackEl = document.getElementById('quiz-feedback');
    
    // Disable all buttons
    buttons.forEach(btn => btn.disabled = true);
    
    if (selectedIndex === q.correct) {
        btnEl.classList.add('correct');
        score++;
        document.getElementById('score-val').textContent = score;
        feedbackEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> <strong>Correct!</strong> ${q.explanation}`;
        feedbackEl.classList.add('success');
    } else {
        btnEl.classList.add('wrong');
        buttons[q.correct].classList.add('correct'); // Highlight correct answer
        feedbackEl.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> <strong>Incorrect.</strong> ${q.explanation}`;
        feedbackEl.classList.add('error');
    }
    
    feedbackEl.classList.remove('hidden');
    document.getElementById('next-q-btn').classList.remove('hidden');
}

function handleNextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById('quiz-container').classList.add('hidden');
    const resultContainer = document.getElementById('result-container');
    resultContainer.classList.remove('hidden');
    
    document.getElementById('final-score').textContent = `${score} / ${quizData.length}`;
    
    let message = "";
    const percentage = score / quizData.length;
    
    if (percentage === 1) message = "Perfect! You are an election expert.";
    else if (percentage >= 0.6) message = "Great job! You know the system well.";
    else message = "Good effort! Check out the 'Learn System' section to brush up.";
    
    document.getElementById('result-message').textContent = message;
}
