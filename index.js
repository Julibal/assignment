const questions = [ { question: "What's your babe's name?", answers: ["titi", "tope", " i no get","omoooh"], correct: 4}, 
{question: "Do you really need money?", answers: ["No", "i dont", "for what", " i no want"], correct: 1}];

let currentQuestionindex = 0;
let score = 0;
let timerCount = 15;
lettimerInterval;
let userHistory = [];
const startContainer = document.getElementById('start-container');
const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('option-container');
const timerDisplay = document.getElementById('timer-display');
const finalScore = document.getElementById('final-score');
const reviewContainer = document.getElementById('review-container');
const highscoreDisplay = document.getElementById('highscore-display');

window.addEventListener('DOMContentLoaded', () => {
    const savedHighscore = localStorage.getitem('quizHighScore') || 0;
    const highscoreDisplay =document.getElementById('highScoreDisplay');
    if (highScoreDisplay) { highScoreDisplay.textcontent = 'High Score: ${savedHighScore}';}})

        startBtn.addEventListener('click,startQuiz');
        restartBtn.addEventListener('click', startQuiz);

        function startQuiz() {
            currentQuestionIndex = 0;
            score = 0;
            userHistory = [];
            startContainer.classList.add('hidden');
            resultContainer.classList.add('hidden');
            quizContainer.classList.remove('hidden');
            showQuestion()
        }

        function showQuestion() {
            clearInterval(timerInterval);
            timerCount = 15;
            timerDisplay.textContent = timerCount;
            optionsContainer.innerHTML = '';
            quizContainer.classList.remove('slide-in');
            void
            quizContainer.offsetWidth;
            quizContainer.classList.add('slide-in')
            startTimer();

    let currentQuestion = questions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;

    // Render options dynamically
    currentQuestion.answers.forEach((answer, index) => {
        const label = document.createElement('label');
        label.className = 'option-label';
        label.innerHTML = `
            <input type="radio" name="quiz-option" value="${index}" style="margin-right: 10px;">
            ${answer}
        `;
        
        // Listen for selection immediately
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
            handleSelection(-1); // Timeout condition (-1 means no answer selected)
        }
    }, 1000);
}

function handleSelection(selectedIndex) {
    clearInterval(timerInterval);
    const currentQuestion = questions[currentQuestionIndex];
    const correctIndex = currentQuestion.correct;
    const labels = optionsContainer.getElementsByClassName('option-label');

    // Disable all inputs immediately to lock choices
    Array.from(labels).forEach(label => label.querySelector('input').disabled = true);

    // Save choice history for the final review screen
    userHistory.push({
        question: currentQuestion.question,
        userAnswer: selectedIndex !== -1 ? currentQuestion.answers[selectedIndex] : "Timeout (No Answer)",
        correctAnswer: currentQuestion.answers[correctIndex],
        isCorrect: selectedIndex === correctIndex
    });

    // Color Feedback Evaluation
    if (selectedIndex === correctIndex) {
        score++;
        labels[selectedIndex].classList.add('correct');
    } else {
        if (selectedIndex !== -1) {
            labels[selectedIndex].classList.add('incorrect');
        }
        labels[correctIndex].classList.add('correct'); // Guide user to correct answer
    }

    // Step Increment Logic with Short Delay
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

    // Manage High Score Strategy
    const currentHighScore = localStorage.getItem('quizHighScore') || 0;
    if (score > currentHighScore) {
        localStorage.setItem('quizHighScore', score);
        highScoreDisplay.textContent = score;
    }

    // Build History Review UI Element
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