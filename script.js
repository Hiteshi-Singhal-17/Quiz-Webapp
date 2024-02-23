let currentQuestionIndex = 0;
let correctAnswers = 0;
let startTime;
let hosturl = 'http://10.154.14.150:5010/';

const questions = [
    { question: "When our company mission \"alleviate pain, restore health, and extend life\" was written?", answers: ["1960", "1962", "1965", "1970"], correct: 0 },
    { question: "How many tenets we have in our Medtronic Mission?", answers: ["4", "5", "6", "7"], correct: 2 },
    { question: "Medtronic was founded in 1949 as a medical equipment repair shop by ____ and his brother-in-law ____", answers: ["Earl Bakken & Palmer Hermundslie", "Palmer Hermundslie & Mike Johnson", "Earl Bakken & Frank", "Albert Einstein & Sheldon Cooper"], correct: 0 },
    { question: "The estimated average battery life for a Micra device is approximately", answers: ["13 to 15 years", "10 to 12 years", "16 to 17 years", "5 to 7 years"], correct: 2 },
    { question: "Who is EVP and President of Neuroscience Portfolio?", answers: ["Mike Marinaro", "Bob White", "Sean Salmon", "Brett Wall"], correct: 3 }
    
];

function startQuiz(fn, ln, userid) {
    document.getElementById("signUpScreen").classList.add("hidden");
    document.getElementById("quizScreen").classList.remove("hidden");
    startTime = new Date();
    //showQuestion();

    userRegistration(fn, ln, userid);
}

function userRegistration(fn, ln, userid) {
    // Define the URL of the API endpoint
const apiUrl = hosturl + 'api/register';

// Define the data you want to send in the POST request
const postData = {
    "uid": userid,
    "fn": fn,
    "ln": ln
}

// Create an object for the POST request configuration
const requestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json' // Specify content type as JSON
  },
  body: JSON.stringify(postData) // Convert data to JSON format
};

// Make the POST request using fetch
fetch(apiUrl, requestOptions)
  .then(response => {
    //console.log("RESPONSE : " + response.json());
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse response body as JSON
  })
  .then(data => {
    // Handle the response data
    console.log('Response from server:', data);
    showQuestion(userid);
  })
  .catch(error => {
    // Handle errors
    console.error('There was a problem with the POST request:', error);
  });

}

function showQuestion(userid) {
    console.log("show qn userid " + userid);
    const q = questions[currentQuestionIndex];
    document.getElementById("questionText").innerText = q.question;
    document.getElementById("questionNumber").innerText = currentQuestionIndex + 1;
    const answerList = document.getElementById("answerList");
    answerList.innerHTML = ""; // Clear previous answers

    q.answers.forEach((answer, index) => {
        const li = document.createElement("li");
        const button = document.createElement("button");
        button.innerText = answer;
        button.onclick = () => checkAnswer(index, userid);
        li.appendChild(button);
        answerList.appendChild(li);
    });
}

function checkAnswer(selected, userid) {
    if (selected === questions[currentQuestionIndex].correct) {
        correctAnswers++;
    }
    nextQuestion(userid);
}

function nextQuestion(userid) {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion(userid);
    } else {
        //endQuiz(userid);
        quizSubmission(userid);
    }
}

function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let formattedTime = '';
    if (hours > 0) {
        formattedTime += `${hours}h `;
    }
    if (minutes > 0 || hours > 0) {
        formattedTime += `${minutes}m `;
    }
    formattedTime += `${seconds}s`;

    return formattedTime;
}

// Example usage:
//const totalTimeInSeconds = 3665; // Example time in seconds
//const formattedTime = formatTime(totalTimeInSeconds);
//console.log(formattedTime);

function endQuiz(endTime) {
    document.getElementById("quizScreen").classList.add("hidden");
    document.getElementById("resultsScreen").classList.remove("hidden");
    document.getElementById("correctAnswersCount").innerText = `You answered ${correctAnswers} questions correctly.`;
    //const endTime = new Date();
    const timeSpent = (endTime - startTime) / 1000; // time in seconds
    const timeFormat = formatTime(timeSpent);
    document.getElementById("timeSpent").innerText = `Time spent in: ${timeFormat}`;
}

//quiz submission
function quizSubmission(userid) {
    console.log("start quizSubmission " + userid);
    const endTime = new Date();
    const timeSpent = (endTime - startTime) / 1000;    
    // Define the URL of the API endpoint
    const apiUrl = hosturl + 'api/submitQuiz';
    console.log(`CORRECT ANS  ${correctAnswers}   Time Spent  ${timeSpent}` );

// Define the data you want to send in the POST request
const postData = {
    "uid": userid,
    "answered": `${correctAnswers}`,
    "duration": `${timeSpent}`
}

// Create an object for the POST request configuration
const requestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json' // Specify content type as JSON
  },
  body: JSON.stringify(postData) // Convert data to JSON format
};

// Make the POST request using fetch
fetch(apiUrl, requestOptions)
  .then(response => {
    //console.log("RESPONSE : " + response.json());
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse response body as JSON
  })
  .then(data => {
    // Handle the response data
    console.log('Response from server:', data);
    endQuiz(endTime);
  })
  .catch(error => {
    // Handle errors
    console.error('There was a problem with the POST request:', error);
  });

}

// Initial call to set up the first question
//showQuestion();