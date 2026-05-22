// Quiz Data Repository
const questions = [
    { question: "What's your babe's name?", answers: ["titi", "tope", "i no get", "ooooh"], correct: 1 },
    { question: "Do you really need money?", answers: ["No", "i dont", "for what", "i no want"], correct: 1 },
    { question: "How are you today?", answers: ["we bless God", "kinni", "kinla", "humm"], correct: 3},
    { question: "fola is very wicked, isn't he?", answers: ["absolutely", "yes", "before nko", "100%"], correct: 2},
    { question: "What's your babe's name again for the last time?", answers: ["titi", "tope", "i no get", "ooooh"], correct: 1 }
];

// State Variables
let currentQuestionIndex = 0;
let score = 0;
let timerCount = 15;
let timerInterval; // Fixed the missing space here
let userHistory = []; 

// DOM Elements - FIXED TO MATCH YOUR HTML EXACTLY
const startContainer = document.getElementById('start-container');
const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container'); // Fixed 'options'
const timerDisplay = document.getElementById('timer'); // Fixed 'timer'
const finalScore = document.getElementById('final-score');
const reviewContainer = document.getElementById('review-container');
const highScoreDisplay = document.getElementById('high-score-display'); // Fixed to match your HTML id

// Initialize App: Show High Score
window.addEventListener('DOMContentLoaded', () => {
    const savedHighScore = localStorage.getItem('quizHighScore') || 0;
    if (highScoreDisplay) {
        highScoreDisplay.textContent = savedHighScore;
    }
});

// Event Listeners
startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', startQuiz);

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    userHistory = [];
    startContainer.classList.add('hidden');
    resultContainer.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    showQuestion();
}

function showQuestion() {
    clearInterval(timerInterval);
    timerCount = 15;
    timerDisplay.textContent = timerCount;
    optionsContainer.innerHTML = '';
    
    quizContainer.classList.remove('slide-in');
    void quizContainer.offsetWidth; // Trigger DOM reflow to restart CSS animation
    quizContainer.classList.add('slide-in');

    startTimer();

    let currentQuestion = questions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;

    currentQuestion.answers.forEach((answer, index) => {
        const label = document.createElement('label');
        label.className = 'option-label';
        label.innerHTML = `
            <input type="radio" name="quiz-option" value="${index}" style="margin-right: 10px;">
            ${answer}
        `;
        
        label.querySelector('input').addEventListener('change', () => handleSelection(index));
        optionsContainer.appendChild(label);
    });
}

function startTimer() {
    timerInterval = setInterval(() => {
        timerCount--;
        timerDisplay.textContent = timerCount;
        if (timerCount <= 0) {
            clearInterval(timerInterval);
            handleSelection(-1); 
        }
    }, 1000);
}

function handleSelection(selectedIndex) {
    clearInterval(timerInterval);
    const currentQuestion = questions[currentQuestionIndex];
    const correctIndex = currentQuestion.correct;
    const labels = optionsContainer.getElementsByClassName('option-label');

    Array.from(labels).forEach(label => label.querySelector('input').disabled = true);

    userHistory.push({
        question: currentQuestion.question,
        userAnswer: selectedIndex !== -1 ? currentQuestion.answers[selectedIndex] : "Timeout (No Answer)",
        correctAnswer: currentQuestion.answers[correctIndex],
        isCorrect: selectedIndex === correctIndex
    });

    if (selectedIndex === correctIndex) {
        score++;
        labels[selectedIndex].classList.add('correct');
    } else {
        if (selectedIndex !== -1) {
            labels[selectedIndex].classList.add('incorrect');
        }
        labels[correctIndex].classList.add('correct'); 
    }

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

function showResults() {
    quizContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    finalScore.textContent = `You scored: ${score} / ${questions.length}`;

    const currentHighScore = localStorage.getItem('quizHighScore') || 0;
    if (score > currentHighScore) {
        localStorage.setItem('quizHighScore', score);
        if (highScoreDisplay) highScoreDisplay.textContent = score;
    }

    reviewContainer.innerHTML = '';
    userHistory.forEach(item => {
        const reviewItem = document.createElement('div');
        reviewItem.style.margin = '15px 0';
        reviewItem.style.padding = '10px';
        reviewItem.style.borderLeft = item.isCorrect ? '5px solid #28a745' : '5px solid #dc3545';
        reviewItem.style.textAlign = 'left';
        reviewItem.style.background = '#f9f9f9';
        
        reviewItem.innerHTML = `
            <strong>Q: ${item.question}</strong><br>
            <span style="color: ${item.isCorrect ? '#28a745' : '#dc3545'}">Your Answer: ${item.userAnswer}</span><br>
            <span style="color: #28a745">Correct Answer: ${item.correctAnswer}</span>
        `;
        reviewContainer.appendChild(reviewItem);
    });
}