
const quizData = [
    {
        question: "Which keyword is used to create a class in Java?",
        options: ["define", "class", "object", "struct"],
        correct: 1
    },
    {
        question: "Which HTML tag is used to insert an image?",
        options: ["<img>", "<image>", "<pic>", "<src>"],
        correct: 0
    },
    {
        question: "Which data structure works on FIFO principle?",
        options: ["Stack", "Queue", "Tree", "Graph"],
        correct: 1
    },
    {
        question: "Which CSS property is used to make text bold?",
        options: ["font-weight", "text-bold", "font-style", "bold"],
        correct: 0
    },
    {
        question: "Which symbol is used for comments in JavaScript?",
        options: ["<!-- -->", "#", "//", "**"],
        correct: 2
    }
];

let currentQuestionIndex = 0;
let score = 0;

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const resultArea = document.getElementById('result-area');
const questionArea = document.getElementById('question-area');
const scoreText = document.getElementById('score-text');
const feedbackMsg = document.getElementById('feedback-msg');
const restartBtn = document.getElementById('restart-btn');

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    resultArea.classList.add('hidden');
    questionArea.classList.remove('hidden');
    showQuestion();
}

function showQuestion() {
    const currentQuestion = quizData[currentQuestionIndex];
    questionText.innerText = currentQuestion.question;
    optionsContainer.innerHTML = '';

    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedIndex) {
    if (selectedIndex === quizData[currentQuestionIndex].correct) {
        score++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < quizData.length) {
        showQuestion();
    } else {
        displayResults();
    }
}

function displayResults() {
    questionArea.classList.add('hidden');
    resultArea.classList.remove('hidden');

    scoreText.innerText = `Final Score: ${score} / ${quizData.length}`;

    if (score === quizData.length) {
        feedbackMsg.innerText = "Outstanding! 🌟 Perfect Score!";
    } else if (score >= 3) {
        feedbackMsg.innerText = "Great Job! 👍 Keep Improving!";
    } else {
        feedbackMsg.innerText = "Keep Practicing 💪";
    }
}

restartBtn.addEventListener('click', startQuiz);

startQuiz();