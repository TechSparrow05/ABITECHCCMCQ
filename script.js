// script.js
let currentUnit = 1;
let currentQuestionIndex = 0;
let userAnswers = {};
let timerInterval;
let timeRemaining = 900; // 15 minutes in seconds

// Sample questions database (expand this for all units)
const questionsDatabase = {
    1: [
        {
            id: 1,
            question: "Which of the following is NOT a characteristic of cloud computing according to NIST?",
            options: {
                A: "On-demand self-service",
                B: "Broad network access",
                C: "Limited scalability",
                D: "Measured service"
            },
            correct: "C"
        },
        {
            id: 2,
            question: "In which cloud deployment model does an organization have complete control over the infrastructure?",
            options: {
                A: "Public Cloud",
                B: "Private Cloud",
                C: "Community Cloud",
                D: "Hybrid Cloud"
            },
            correct: "B"
        },
        // Add more questions here...
    ],
    2: [], // Unit 2 questions
    3: [], // Unit 3 questions
    4: [], // Unit 4 questions
    5: []  // Unit 5 questions
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Add click listeners to options when quiz starts
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', selectOption);
    });
}

function startQuiz(unitNumber) {
    currentUnit = unitNumber;
    currentQuestionIndex = 0;
    userAnswers = {};
    timeRemaining = 900;
    
    // Hide unit selection, show quiz screen
    document.getElementById('unitSelection').classList.remove('active');
    document.getElementById('quizScreen').classList.add('active');
    
    // Update unit name
    document.querySelector('.unit-name').textContent = `Unit ${unitNumber}: ${getUnitName(unitNumber)}`;
    
    // Initialize question palette
    initializePalette();
    
    // Load first question
    loadQuestion(0);
    
    // Start timer
    startTimer();
}

function getUnitName(unitNumber) {
    const unitNames = {
        1: "Cloud Computing",
        2: "Virtualization",
        3: "Web Services & Providers",
        4: "Cloud Security",
        5: "Cloud Applications"
    };
    return unitNames[unitNumber];
}

function initializePalette() {
    const paletteGrid = document.getElementById('paletteGrid');
    paletteGrid.innerHTML = '';
    
    for (let i = 1; i <= 50; i++) {
        const paletteItem = document.createElement('div');
        paletteItem.className = 'palette-item unanswered';
        paletteItem.textContent = i;
        paletteItem.onclick = () => jumpToQuestion(i - 1);
        paletteGrid.appendChild(paletteItem);
    }
}

function loadQuestion(index) {
    const questions = questionsDatabase[currentUnit];
    if (!questions || !questions[index]) {
        // For demo purposes, show a placeholder
        document.getElementById('questionText').textContent = `Question ${index + 1}: Sample question for Unit ${currentUnit}`;
        generateSampleOptions();
        return;
    }
    
    const question = questions[index];
    currentQuestionIndex = index;
    
    // Update question counter
    document.querySelector('.question-counter').textContent = `Question ${index + 1} of 50`;
    
    // Update question text
    document.getElementById('questionText').textContent = question.question;
    
    // Update options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    Object.entries(question.options).forEach(([key, value]) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.innerHTML = `
            <span class="option-label">${key}</span>
            <span class="option-text">${value}</span>
        `;
        optionDiv.onclick = () => selectOption(key);
        
        // Check if this option was previously selected
        if (userAnswers[index] === key) {
            optionDiv.classList.add('selected');
        }
        
        optionsContainer.appendChild(optionDiv);
    });
    
    // Update palette
    updatePalette();
}

function generateSampleOptions() {
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    const sampleOptions = {
        A: "Option A - Sample answer",
        B: "Option B - Sample answer",
        C: "Option C - Sample answer",
        D: "Option D - Sample answer"
    };
    
    Object.entries(sampleOptions).forEach(([key, value]) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.innerHTML = `
            <span class="option-label">${key}</span>
            <span class="option-text">${value}</span>
        `;
        optionDiv.onclick = () => selectOption(key);
        
        if (userAnswers[currentQuestionIndex] === key) {
            optionDiv.classList.add('selected');
        }
        
        optionsContainer.appendChild(optionDiv);
    });
}

function selectOption(optionKey) {
    // Store the answer
    userAnswers[currentQuestionIndex] = optionKey;
    
    // Update UI
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });
    
    event.currentTarget.classList.add('selected');
    
    // Update palette
    updatePalette();
}

function updatePalette() {
    const paletteItems = document.querySelectorAll('.palette-item');
    
    paletteItems.forEach((item, index) => {
        item.classList.remove('answered', 'current', 'unanswered');
        
        if (index === currentQuestionIndex) {
            item.classList.add('current');
        } else if (userAnswers[index] !== undefined) {
            item.classList.add('answered');
        } else {
            item.classList.add('unanswered');
        }
    });
}

function nextQuestion() {
    if (currentQuestionIndex < 49) {
        loadQuestion(currentQuestionIndex + 1);
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        loadQuestion(currentQuestionIndex - 1);
    }
}

function jumpToQuestion(index) {
    loadQuestion(index);
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;
        
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        const timerDisplay = document.getElementById('timer');
        
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Add warning class when 2 minutes remaining
        if (timeRemaining <= 120) {
            document.querySelector('.timer').classList.add('warning');
        }
        
        // Auto submit when time runs out
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            submitQuiz();
        }
    }, 1000);
}

function submitQuiz() {
    // Clear timer
    clearInterval(timerInterval);
    
    // Calculate results
    const totalQuestions = 50;
    const answeredQuestions = Object.keys(userAnswers).length;
    const correctAnswers = calculateCorrectAnswers();
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Hide quiz screen, show results
    document.getElementById('quizScreen').classList.remove('active');
    document.getElementById('resultsScreen').classList.add('active');
    
    // Update results display
    document.querySelector('.score-value').textContent = `${score}%`;
    document.querySelectorAll('.stat-value')[0].textContent = `${correctAnswers}/${totalQuestions}`;
    
    const timeTaken = 900 - timeRemaining;
    const minutesTaken = Math.floor(timeTaken / 60);
    const secondsTaken = timeTaken % 60;
    document.querySelectorAll('.stat-value')[1].textContent = `${minutesTaken}:${secondsTaken.toString().padStart(2, '0')}`;
    
    const accuracy = answeredQuestions > 0 ? Math.round((correctAnswers / answeredQuestions) * 100) : 0;
    document.querySelectorAll('.stat-value')[2].textContent = `${accuracy}%`;
}

function calculateCorrectAnswers() {
    // For demo purposes, return a random number
    // In production, compare userAnswers with correct answers
    return Math.floor(Math.random() * 10) + 35;
}

function reviewAnswers() {
    // Implementation for reviewing answers
    alert('Review feature coming soon!');
}

function backToHome() {
    // Reset everything
    currentQuestionIndex = 0;
    userAnswers = {};
    
    // Hide results, show unit selection
    document.getElementById('resultsScreen').classList.remove('active');
    document.getElementById('unitSelection').classList.add('active');
}

// Prevent accidental navigation away
window.addEventListener('beforeunload', function (e) {
    if (document.getElementById('quizScreen').classList.contains('active')) {
        e.preventDefault();
        e.returnValue = '';
    }
});