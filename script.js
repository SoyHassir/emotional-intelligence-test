/**
 * Enhanced Emotional Intelligence Test with Firebase Integration
 * This script contains all the logic for the emotional intelligence test,
 * including demographic data collection, question generation, result calculation,
 * and data storage on Firebase for analysis.
 */

// Firebase configuration - YOU NEED TO REPLACE THIS WITH YOUR OWN CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyCrUPp4SlzJLnAgpuAcMLQEWihPCyVpSwc",
    authDomain: "test-inteligencia-emocional.firebaseapp.com",
    projectId: "test-inteligencia-emocional",
    storageBucket: "test-inteligencia-emocional.firebasestorage.app",
    messagingSenderId: "221906777252",
    appId: "1:221906777252:web:0b5b2d7fb50eae2b216231",
    measurementId: "G-3XMX5RCND4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firestore instance
const db = firebase.firestore();

// Array containing all 45 questions/behaviors for the test
const questions = [
    "Me conozco a mí mismo, sé lo que pienso, lo que siento y lo que hago.",
    "Soy capaz de auto motivarme para aprender, estudiar, aprobar, conseguir algo.",
    "Cuando las cosas me van mal, mi estado de ánimo aguanta hasta que las cosas vayan mejor.",
    "Llego a acuerdos razonables con otras personas cuando tenemos posturas enfrentadas.",
    "Sé qué cosas me ponen alegre y qué cosas me ponen triste.",
    "Sé lo que es más importante en cada momento.",
    "Cuando hago las cosas bien me felicito a mí mismo.",
    "Cuando los demás me provocan intencionadamente soy capaz de no responder.",
    "Me fijo en el lado positivo de las cosas, soy optimista.",
    "Controlo mis pensamientos, pienso lo que de verdad me interesa.",
    "Hablo conmigo mismo, en voz baja claro.",
    "Cuando me piden que diga o haga algo que me parece inaceptable me niego a hacerlo.",
    "Cuando alguien me critica injustamente me defiendo adecuadamente con el diálogo.",
    "Cuando me critican por algo que es justo lo acepto porque tienen razón.",
    "Soy capaz de quitarme de la mente las preocupaciones que me obsesionan.",
    "Me doy cuenta de lo que dicen, piensan y sienten las personas más cercanas a mí (amigos, compañeros, familiares…)",
    "Valoro las cosas buenas que hago.",
    "Soy capaz de divertirme y pasármelo bien allí donde esté.",
    "Hay cosas que no me gusta hacer pero sé que hay que hacerlas y las hago.",
    "Soy capaz de sonreír.",
    "Tengo confianza en mí mismo, en lo que soy capaz de hacer, pensar y sentir.",
    "Soy una persona activa, me gusta hacer cosas.",
    "Comprendo los sentimientos de los demás.",
    "Mantengo conversaciones con la gente.",
    "Tengo buen sentido del humor.",
    "Aprendo de los errores que cometo.",
    "En momentos de tensión y ansiedad soy capaz de relajarme y tranquilizarme para no perder el control y actuar apresuradamente.",
    "Soy una persona realista con los ofrecimientos que hago, sabiendo qué cosa puedo cumplir y qué no me será posible hacer.",
    "Cuando alguien se muestra muy nervioso/a o exaltado/a lo calmo y tranquilizo.",
    "Tengo las ideas muy claras sobre lo que quiero.",
    "Controlo bien mis miedos y temores.",
    "Si he de estar solo no me agobio por eso.",
    "Formo parte de algún grupo o equipo de deporte o de ocio para compartir intereses o aficiones.",
    "Sé cuáles son mis defectos y cómo cambiarlos.",
    "Soy creativo, tengo ideas originales y las desarrollo.",
    "Sé qué pensamientos son capaces de hacerme sentir feliz, triste, enfadado, altruista, angustiado.",
    "Soy capaz de aguantar bien la frustración cuando no consigo lo que me propongo.",
    "Me comunico bien con la gente con la que me relaciono.",
    "Soy capaz de comprender el punto vista de los demás.",
    "Identifico las emociones que expresa la gente a mi alrededor.",
    "Soy capaz de verme a mí mismo desde la perspectiva de los otros.",
    "Me responsabilizo de las cosas que hago.",
    "Me adapto a las nuevas situaciones, aunque me cuesten algún cambio en mi manera de sentir las cosas.",
    "Creo que soy una persona equilibrada emocionalmente.",
    "Tomo decisiones sin dudar ni titubear demasiado."
];

// Categories and interpretations for score ranges
const resultCategories = [
    {
        range: [0, 20],
        category: "MUY BAJO",
        interpretation: "Con esta puntuación debes saber que todavía no conoces suficientemente qué emociones son las que vives, no valoras adecuadamente tus capacidades, que seguramente tienes. Son muchas las habilidades que no pones en práctica, y son necesarias para que te sientas más a gusto contigo mismo y para que las relaciones con la gente sean satisfactorias."
    },
    {
        range: [21, 35],
        category: "BAJO",
        interpretation: "Tu puntaje muestra que aún estás en proceso de fortalecer tus habilidades emocionales. Te vendrá bien profundizar en tu autoconocimiento y reconocer todo tu potencial. Entender qué sientes, aprender a gestionarlo y expresarlo de forma adecuada, así como percibir las emociones de los demás, es esencial para sentirte bien y desplegar tu personalidad con mayor efectividad."
    },
    {
        range: [36, 45],
        category: "MEDIO-BAJO",
        interpretation: "Estás muy cerca de lo ideal en tus habilidades emocionales. Sabes bien lo que piensas, haces y sientes, y ya manejas bastante bien tus emociones y tu forma de comunicarte con los demás. Aún así, no te quedes ahí: aprovecha este impulso para seguir creciendo y afinar aún más tu inteligencia emocional."
    },
    {
        range: [46, 79],
        category: "MEDIO-ALTO",
        interpretation: "Tu puntuación es muy buena. Demuestra que te conoces a fondo: entiendes cómo te emocionas, gestionas tus sentimientos y reconoces esas mismas emociones en los demás. Gracias a esto mantienes relaciones saludables, expresando lo que sientes de forma adecuada y atendiendo a lo que necesitan las personas que te rodean. Sigue aprovechando estas habilidades para reforzar aún más tus vínculos y tu bienestar emocional."
    },
    {
        range: [80, 90],
        category: "MUY ALTO",
        interpretation: "¡Eres todo un maestro de tus emociones! Tu puntuación refleja que dominas por completo tu inteligencia emocional: sabes quién eres, qué quieres y cómo te sientes en cada momento. Te valoras como te mereces, gestionas tus estados de ánimo con soltura y, lo más impresionante, te comunicas con claridad y empatía. Además, tienes un don para resolver esos pequeños conflictos del día a día y mantener un clima de entendimiento a tu alrededor. ¡Sigue brillando así!"
    }
];

// Object to store all user data
let userData = {
    demographic: {},
    answers: [],
    result: {
        score: 0,
        category: "",
        interpretation: ""
    },
    timestamp: ""
};

// For batch loading questions
let currentQuestionBatch = 0;
const QUESTIONS_PER_BATCH = 10;

/**
 * Shows the loading spinner
 */
function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

/**
 * Hides the loading spinner
 */
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

/**
 * Validates the demographic form data
 * @returns {boolean} True if all fields are valid, false otherwise
 */
function validateDemographicData() {
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const education = document.getElementById('education').value;
    const occupation = document.getElementById('occupation').value;
    
    if (!age || !gender || !education || !occupation) {
        alert("Por favor, complete todos los campos demográficos.");
        return false;
    }
    
    // Store demographic data
    userData.demographic = {
        age: age,
        gender: gender,
        education: education,
        occupation: occupation
    };
    
    // Save to localStorage
    saveProgress();
    
    return true;
}

/**
 * Shows the test instructions section with smooth transition
 */
function showInstructions() {
    if (validateDemographicData()) {
        showSectionWithTransition('#demographic-section', '#test-instructions');
        document.querySelector('.intro').style.display = 'none';
    }
}

/**
 * Shows the test questions section with smooth transition
 */
function showQuestions() {
    showSectionWithTransition('#test-instructions', '#test-container');
    // Ensure that the introduction is still hidden
    document.querySelector('.intro').style.display = 'none';
    document.getElementById('progress-indicator').style.display = 'block';
    document.getElementById('submit-btn').style.display = 'block';

    // Initialize the progress indicator
    updateProgressIndicator(1); // It starts at question 1

    // Añade esto al final de la función showQuestions()
setTimeout(() => {
    const progressBar = document.getElementById('progress-indicator');
    const submitButton = document.getElementById('submit-btn');
    
    progressBar.style.display = 'block';
    progressBar.style.visibility = 'visible';
    progressBar.style.opacity = '1';
    
    submitButton.style.display = 'block';
    submitButton.style.visibility = 'visible';
    submitButton.style.opacity = '1';
    
    console.log("Elementos forzados a mostrar:", progressBar, submitButton);
  }, 500);
}

/**
 * Handles transitions between sections
 * @param {string} hideSelector - Selector of the section to hide
 * @param {string} showSelector - Selector of the section to show
 */
function showSectionWithTransition(hideSelector, showSelector) {
    const currentSection = document.querySelector(hideSelector);
    if (currentSection) {
        currentSection.classList.remove('fade-in');
        
        setTimeout(() => {
            currentSection.style.display = 'none';
            
            const newSection = document.querySelector(showSelector);
            if (newSection) {
                newSection.classList.add('fade-transition');
                newSection.style.display = 'block';
                
                // Force reflow
                void newSection.offsetWidth;
                
                // Add fade-in class
                newSection.classList.add('fade-in');
            }
        }, 300); // Match transition duration
    }
}

/**
 * Generates questions in batches for performance optimization
 * @param {number} startIndex - Index to start generating questions from
 */
function generateQuestionBatch(startIndex) {
    const container = document.getElementById('test-container');
    const endIndex = Math.min(startIndex + QUESTIONS_PER_BATCH, questions.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        // Create a container for each question
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question fade-transition';
        
        // Add the question text and radio buttons for answers
        questionDiv.innerHTML = `
            <div class="question-text">${i + 1}. ${questions[i]}</div>
            <div class="options">
                <label class="option">
                    <input type="radio" name="q${i}" value="0" aria-label="Nunca: ${questions[i]}"> Nunca
                </label>
                <label class="option">
                    <input type="radio" name="q${i}" value="1" aria-label="Algunas veces: ${questions[i]}"> Algunas veces
                </label>
                <label class="option">
                    <input type="radio" name="q${i}" value="2" aria-label="Siempre: ${questions[i]}"> Siempre
                </label>
            </div>
        `;
        container.appendChild(questionDiv);
        
        // Add fade-in animation with a slight delay for each question
        setTimeout(() => {
            questionDiv.classList.add('fade-in');
        }, 50 * (i - startIndex));
    }
    
    // Set up visual feedback for radio buttons
    setupVisualFeedback();
    
    // Update current batch index
    currentQuestionBatch = endIndex;
    
    // Set up scroll detection for loading next batch
    setupScrollDetection();
}

/**
 * Sets up scroll detection for dynamic loading of question batches
 */
function setupScrollDetection() {
    if (currentQuestionBatch >= questions.length) {
        // All questions loaded, no need for scroll detection
        window.removeEventListener('scroll', scrollHandler);
        return;
    }
    
    window.addEventListener('scroll', scrollHandler);
}

/**
 * Handles scroll events to load more questions when near the bottom
 */
function scrollHandler() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.body.offsetHeight;
    
    // If scrolled to near bottom, load more questions
    if (scrollPosition > pageHeight - 500 && currentQuestionBatch < questions.length) {
        generateQuestionBatch(currentQuestionBatch);
        // Remove event listener to prevent multiple loads
        window.removeEventListener('scroll', scrollHandler);
    }
}

/**
 * Sets up visual feedback for radio button selections
 */
function setupVisualFeedback() {
    document.querySelectorAll('.option input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // Flash effect on the parent question
            const questionDiv = this.closest('.question');
            questionDiv.style.backgroundColor = 'rgba(58, 123, 213, 0.05)';
            setTimeout(() => {
                questionDiv.style.backgroundColor = '';
            }, 300);
            
            // Save progress when answering questions
            saveProgress();
        });
    });
}

/**
 * Updates the progress indicator
 * @param {number} currentQuestionIndex - The current question number
 */
function updateProgressIndicator(currentQuestionIndex) {
    const totalQuestions = questions.length;
    const progressPercentage = (currentQuestionIndex / totalQuestions) * 100;
    
    document.getElementById('progress-bar-fill').style.width = `${progressPercentage}%`;
    document.getElementById('progress-text').textContent = 
        `Pregunta ${currentQuestionIndex} de ${totalQuestions}`;
}

/**
 * Calculates the total score from all answers
 * Returns null if not all questions are answered
 * @returns {number|null} The total score or null if incomplete
 */
function calculateResults() {
    let totalScore = 0;
    let unansweredQuestions = [];
    let answers = [];
    
    // Check each question
    for (let i = 0; i < questions.length; i++) {
        const options = document.getElementsByName(`q${i}`);
        let answered = false;
        let selectedValue = null;
        
        // Find the selected option
        for (let j = 0; j < options.length; j++) {
            if (options[j].checked) {
                // Add points based on the selected value (0, 1, or 2)
                selectedValue = parseInt(options[j].value);
                totalScore += selectedValue;
                answered = true;
                break;
            }
        }
        
        // Store the answer
        if (answered) {
            answers.push({
                questionIndex: i,
                question: questions[i],
                answer: selectedValue
            });
        }
        
        // If not answered, add to the unanswered list
        if (!answered) {
            unansweredQuestions.push(i + 1);
        }
    }
    
    // Check for unanswered questions
    if (unansweredQuestions.length > 0) {
        alert(`Por favor, responde a las siguientes preguntas: ${unansweredQuestions.join(', ')}`);
        return null;
    }
    
    // Store answers in the userData object
    userData.answers = answers;
    
    return totalScore;
}

/**
 * Displays the test results in the results section
 * @param {number} score - The total score to display
 */
function showResults(score) {
    // Hide the question section and progress indicator
    document.getElementById('test-container').style.display = 'none';
    document.getElementById('progress-indicator').style.display = 'none';
    document.getElementById('submit-btn').style.display = 'none';
    
    const resultsDiv = document.getElementById('results');
    const scoreSpan = document.getElementById('score');
    const categorySpan = document.getElementById('category');
    const interpretationDiv = document.getElementById('interpretation');
    const scoreBar = document.getElementById('score-bar');
    
    // Set the score
    scoreSpan.textContent = score;
    
    // Calculate percentage for progress bar
    const percentage = (score / 90) * 100;
    scoreBar.style.width = `${percentage}%`;
    
    // Find the corresponding category
    let category = null;
    for (const cat of resultCategories) {
        if (score >= cat.range[0] && score <= cat.range[1]) {
            category = cat;
            break;
        }
    }
    
    // Display category and interpretation
    categorySpan.textContent = category.category;
    interpretationDiv.textContent = category.interpretation;
    
    // Store result in userData
    userData.result = {
        score: score,
        category: category.category,
        interpretation: category.interpretation
    };
    
    // Add timestamp
    userData.timestamp = new Date().toISOString();
    
    // Show the results div with transition
    resultsDiv.classList.add('fade-transition');
    resultsDiv.style.display = 'block';
    setTimeout(() => {
        resultsDiv.classList.add('fade-in');
    }, 10);
    
    // Scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
    
    // Save data to Firebase and localStorage
    saveUserDataToFirebase();
    saveProgress();
}

/**
 * Saves the user data to Firebase Firestore
 */
function saveUserDataToFirebase() {
    showLoading();
    
    // Add a new document to the "test_results" collection
    db.collection("test_results").add({
        demographic: userData.demographic,
        answers: userData.answers,
        result: userData.result,
        timestamp: firebase.firestore.Timestamp.fromDate(new Date())
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        hideLoading();
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
        hideLoading();
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo más tarde.");
    });
}

/**
 * Saves progress to localStorage
 */
function saveProgress() {
    // Save demographic data
    localStorage.setItem('ei_test_demographic', JSON.stringify(userData.demographic));
    
    // Save answers
    const answersToSave = [];
    for (let i = 0; i < questions.length; i++) {
        const options = document.getElementsByName(`q${i}`);
        for (let j = 0; j < options.length; j++) {
            if (options[j].checked) {
                answersToSave.push({
                    questionIndex: i,
                    answer: options[j].value
                });
                break;
            }
        }
    }
    
    localStorage.setItem('ei_test_answers', JSON.stringify(answersToSave));
    console.log('Progress saved to localStorage');
}

/**
 * Loads saved progress from localStorage
 */
function loadProgress() {
    // Load demographic data
    const savedDemographic = localStorage.getItem('ei_test_demographic');
    if (savedDemographic) {
        try {
            const demographicData = JSON.parse(savedDemographic);
            
            // Fill in demographic fields
            if (demographicData.age) document.getElementById('age').value = demographicData.age;
            if (demographicData.gender) document.getElementById('gender').value = demographicData.gender;
            if (demographicData.education) document.getElementById('education').value = demographicData.education;
            if (demographicData.occupation) document.getElementById('occupation').value = demographicData.occupation;
            
            // Update empty class for selects
            const selects = document.querySelectorAll('.form-group select');
            selects.forEach(select => {
                if (select.value) select.classList.remove('empty');
            });
            
            // Store in userData
            userData.demographic = demographicData;
        } catch (e) {
            console.error('Error loading demographic data:', e);
        }
    }
    
    // Load saved answers
    const savedAnswers = localStorage.getItem('ei_test_answers');
    if (savedAnswers) {
        try {
            const answers = JSON.parse(savedAnswers);
            
            // Fill in saved answers
            answers.forEach(answer => {
                const options = document.getElementsByName(`q${answer.questionIndex}`);
                for (let j = 0; j < options.length; j++) {
                    if (options[j].value === answer.answer) {
                        options[j].checked = true;
                        break;
                    }
                }
            });
            
            // Update progress indicator
            const answeredCount = answers.length;
            if (answeredCount > 0) {
                updateProgressIndicator(answeredCount);
            }
        } catch (e) {
            console.error('Error loading saved answers:', e);
        }
    }
    
    console.log('Progress loaded from localStorage');
}

/**
 * Toggles dark mode
 */
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    
    // Save preference to localStorage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('ei_test_dark_mode', isDarkMode);
    
    // Update button text
    const darkModeButton = document.getElementById('dark-mode-toggle');
    darkModeButton.textContent = isDarkMode ? '☀️ Modo claro' : '🌙 Modo Oscuro';
}

/**
 * Shows the thank you message after saving data
 */
function showThankYouMessage() {
    document.querySelector('header').style.display = 'none';
    showSectionWithTransition('#results', '#thank-you');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Resets the test to start over
 */
function resetTest() {
    // Reset all radio buttons
    for (let i = 0; i < questions.length; i++) {
        const options = document.getElementsByName(`q${i}`);
        for (let j = 0; j < options.length; j++) {
            options[j].checked = false;
        }
    }
    
    // Reset demographic form
    document.getElementById('age').value = '';
    document.getElementById('gender').value = '';
    document.getElementById('education').value = '';
    document.getElementById('occupation').value = '';
    
    // Update selects empty class
    const selects = document.querySelectorAll('.form-group select');
    selects.forEach(select => {
        select.classList.add('empty');
    });
    
    // Hide all sections except demographic
    document.getElementById('results').style.display = 'none';
    document.getElementById('test-container').style.display = 'none';
    document.getElementById('test-instructions').style.display = 'none';
    document.getElementById('thank-you').style.display = 'none';
    document.getElementById('progress-indicator').style.display = 'none';
    
    // Show header and demographic section
    document.querySelector('header').style.display = 'block';
    document.getElementById('demographic-section').style.display = 'block';
    document.querySelector('.intro').style.display = 'block';
    
    // Reset userData object
    userData = {
        demographic: {},
        answers: [],
        result: {
            score: 0,
            category: "",
            interpretation: ""
        },
        timestamp: ""
    };
    
    // Clear localStorage
    localStorage.removeItem('ei_test_answers');
    localStorage.removeItem('ei_test_demographic');
    
    // Reset question container and regenerate first batch
    document.getElementById('test-container').innerHTML = '';
    currentQuestionBatch = 0;
    generateQuestionBatch(0);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize the test when the page loads
window.onload = function() {
    // Check for dark mode preference
    const darkModeSaved = localStorage.getItem('ei_test_dark_mode');
    if (darkModeSaved === 'true') {
        document.body.classList.add('dark-mode');
        document.getElementById('dark-mode-toggle').textContent = '☀️ Modo Claro';
    }
    
    // Generate first batch of questions
    generateAllQuestions();
    
    // Add event listeners
    document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
    document.getElementById('start-test-btn').addEventListener('click', showInstructions);
    document.getElementById('show-questions-btn').addEventListener('click', showQuestions);
    
    // Add click event listener to the submit button
    document.getElementById('submit-btn').addEventListener('click', function() {
        const score = calculateResults();
        if (score !== null) {
            showResults(score);
        }
    });
    
    // Add click event listener to the restart button
    document.getElementById('restart-btn').addEventListener('click', showThankYouMessage);
    
    // Add click event listener to start a new test
    document.getElementById('new-test-btn').addEventListener('click', resetTest);

    // Update progress when user answers questions
    document.addEventListener('change', function(event) {
        if (event.target.type === 'radio') {
            // Count how many questions have been answered
            let answeredCount = 0;
            for (let i = 0; i < questions.length; i++) {
                const options = document.getElementsByName(`q${i}`);
                for (let j = 0; j < options.length; j++) {
                    if (options[j].checked) {
                        answeredCount++;
                        break;
                    }
                }
            }
            updateProgressIndicator(answeredCount);
        }
    });
    
    // Check if empty selects
    const selects = document.querySelectorAll('.form-group select');
    selects.forEach(select => {
        // Check initial state
        if (!select.value || select.value === "") {
            select.classList.add('empty');
        }
        
        // Add listener for changes
        select.addEventListener('change', function() {
            if (!this.value || this.value === "") {
                this.classList.add('empty');
            } else {
                this.classList.remove('empty');
            }
        });
    });
    
    // Load saved progress
    loadProgress();
    
    // Set up autosave interval (every 30 seconds)
    setInterval(saveProgress, 30000);
};

/**
 * Generates all questions at once instead of in batches
 */
function generateAllQuestions() {
    const container = document.getElementById('test-container');
    
    questions.forEach((question, index) => {
      const questionDiv = document.createElement('div');
      questionDiv.className = 'question fade-transition';
      
      questionDiv.innerHTML = `
          <div class="question-text">${index + 1}. ${question}</div>
          <div class="options">
              <label class="option">
                  <input type="radio" name="q${index}" value="0" aria-label="Nunca: ${question}"> Nunca
              </label>
              <label class="option">
                  <input type="radio" name="q${index}" value="1" aria-label="Algunas veces: ${question}"> Algunas veces
              </label>
              <label class="option">
                  <input type="radio" name="q${index}" value="2" aria-label="Siempre: ${question}"> Siempre
              </label>
          </div>
      `;
      container.appendChild(questionDiv);
      
      setTimeout(() => {
          questionDiv.classList.add('fade-in');
      }, 20 * index);
    });
    
    setupVisualFeedback();
  }