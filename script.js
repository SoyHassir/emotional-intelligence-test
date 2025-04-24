/**
 * Enhanced Emotional Intelligence Test with Firebase Integration
 * This script contains all the logic for the emotional intelligence test,
 * including demographic data collection, question generation, result calculation,
 * and data storage on Firebase for analysis.
 */

// Firebase configuration
import firebaseConfig from './firebase-config.js';

import firebase from 'firebase/app';
import 'firebase/firestore';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // Si ya está inicializado
}

// Initialize Firebase
//firebase.initializeApp(firebaseConfig);

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
    "Mi fijo en el lado positivo de las cosas, soy optimista.",
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
    "Soy una persona realista, con los ofrecimientos que hago, sabiendo qué cosa puedo cumplir y qué no me será posible hacer.",
    "Cuando alguien se muestra muy nervioso/a o exaltado/a lo calmo y tranquilizo.",
    "Tengo las ideas muy claras sobre lo que quiero.",
    "Controlo bien mis miedos y temores.",
    "Si he de estar solo no me agobio por eso.",
    "Formo parte algún grupo o equipo de deporte o de ocio para compartir intereses o aficiones.",
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
        interpretation: "Con esta puntuación tus habilidades emocionales son todavía escasas. Necesitas conocerte un poco mejor y valorar más lo que tú puedes ser capaz de hacer. Saber qué emociones experimentas, cómo las controlas, cómo las expresas y como las identificas en los demás es fundamental para que te puedas sentir bien, y desarrollar toda tu personalidad de una manera eficaz."
    },
    {
        range: [36, 45],
        category: "MEDIO-BAJO",
        interpretation: "Casi lo conseguiste. Con esta puntuación te encuentras rayando lo deseable para tus habilidades emocionales. Ya conoces muchas cosas de lo que piensas, haces y sientes y, posiblemente, de cómo manejar tus emociones y comunicarte con eficacia con los demás. No obstante, no te conformes con este puntaje conseguido."
    },
    {
        range: [46, 79],
        category: "MEDIO-ALTO",
        interpretation: "No está nada mal la puntuación que has obtenido. Indica que sabes quién eres, cómo te emocionas, cómo manejas tus sentimientos y cómo descubres todo esto en los demás. Tus relaciones con la gente las llevas bajo control, empleando para ello tus habilidades para saber cómo te sientes tú, cómo debes expresarlo y también conociendo cómo se sienten los demás, y qué debes hacer para mantener relaciones satisfactorias con otras personas."
    },
    {
        range: [80, 90],
        category: "MUY ALTO",
        interpretation: "Eres un superhéroe de la emoción y su control. Se diría que eres número 1 en eso de la INTELIGENCIA EMOCIONAL. Tus habilidades te permiten ser consciente de quién eres, qué objetivos pretendes, qué emociones vives, sabes valorarte como te mereces, manejas bien tus estados emocionales y, además, con más mérito todavía, eres capaz de comunicarte eficazmente con quienes te rodean, y también eres único/a para solucionar posconflictos interpersonales que cada día acontecen."
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
    
    return true;
}

/**
 * Shows the test instructions section
 */
function showInstructions() {
    if (validateDemographicData()) {
        document.getElementById('demographic-section').style.display = 'none';
        document.getElementById('test-instructions').style.display = 'block';
    }
}

/**
 * Shows the test questions section
 */
function showQuestions() {
    document.getElementById('test-instructions').style.display = 'none';
    document.getElementById('test-container').style.display = 'block';
    document.getElementById('submit-btn').style.display = 'block';
}

/**
 * Generates all question elements in the HTML document
 * Creates radio button groups for each question
 */
function generateQuestions() {
    const container = document.getElementById('test-container');
    
    questions.forEach((question, index) => {
        // Create a container for each question
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        
        // Add the question text and radio buttons for answers
        questionDiv.innerHTML = `
            <div class="question-text">${index + 1}. ${question}</div>
            <div class="options">
                <label class="option">
                    <input type="radio" name="q${index}" value="0" required> NUNCA
                </label>
                <label class="option">
                    <input type="radio" name="q${index}" value="1" required> ALGUNAS VECES
                </label>
                <label class="option">
                    <input type="radio" name="q${index}" value="2" required> SIEMPRE
                </label>
            </div>
        `;
        container.appendChild(questionDiv);
    });
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
    
    // Show the results div
    resultsDiv.style.display = 'block';
    
    // Hide the submit button
    document.getElementById('submit-btn').style.display = 'none';
    
    // Scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
    
    // Save data to Firebase
    saveUserDataToFirebase();
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
        // Show thank you message after short delay
        setTimeout(showThankYouMessage, 1000);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
        hideLoading();
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo más tarde.");
    });
}

/**
 * Shows the thank you message after saving data
 */
function showThankYouMessage() {
    document.getElementById('results').style.display = 'none';
    document.getElementById('thank-you').style.display = 'block';
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
    
    // Hide all sections except demographic
    document.getElementById('results').style.display = 'none';
    document.getElementById('test-container').style.display = 'none';
    document.getElementById('test-instructions').style.display = 'none';
    document.getElementById('thank-you').style.display = 'none';
    
    // Show demographic section
    document.getElementById('demographic-section').style.display = 'block';
    
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
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize the test when the page loads
window.onload = function() {
    // Generate all questions
    generateQuestions();
    
    // Add event listeners
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
};