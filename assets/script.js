// get all the elements needed
var questionEl = document.getElementById("question");
var btnListEl = document.getElementById("btn-list");
var questionCardEl = document.getElementById("question-card");
var resultCarEl = document.getElementById("result-card");
var finalResultEl = document.getElementById("final-result-card");
var rankingCardEl = document.getElementById("ranking-card");
var startBtnEl = document.getElementById("btn-start");
var startCardEl = document.getElementById("start-card");
var nextBtnEl = document.getElementById("btn-next");
var finalEl = document.getElementById("final-result");
var correctEl = document.getElementById("correct");
var incorrectEl = document.getElementById("incorrect");
var answeredEl = document.getElementById("answered");
var timerEl = document.getElementById("timer");
var submitEl = document.getElementById("submit-form");
var submitBtnEl = document.getElementById("btn-submit");
var userNameInputEl = document.getElementById("user-name");
var rankingListEl = document.getElementById("ranking-list");

//get all the option buttons as a array
var optionsArrayEl = Array.from(document.getElementsByClassName("option"));

//set variables
var correct = 0;
var incorrect = 0;
var score = 0;
var currentQuestion = {};
var questionCounter = 0;
//questions not be answered
var avaliableQuestions = [];
var answeredNum = 0;
var secondsLeft = 60;
var correctAnswer = false;
//read the records from local storage if not, make new array
var rankingArray = JSON.parse(localStorage.getItem("records")) || [];

//set all the questions
var questions = [
    {
        question: 'Inside which HTML element do we put the JavaScript??',
        option0: '<script>',
        option1: '<javascript>',
        option2: '<js>',
        option3: '<scripting>',
        answer: 0,
    },
    {
        question: "What is the correct syntax for referring to an external script called 'xxx.js'?",
        option0: "<script href='xxx.js'>",
        option1: "<script name='xxx.js'>",
        option2: "<script src='xxx.js'>",
        option3: "<script file='xxx.js'>",
        answer: 2,
    },
    {
        question: " How do you write 'Hello World' in an alert box?",
        option0: "msgBox('Hello World');",
        option1: "alertBox('Hello World');",
        option2: "msg('Hello World');",
        option3: "alert('Hello World');",
        answer: 3,
    },
    {
        question: "Who invented JavaScript?",
        option0: "Douglas Crockford",
        option1: "Sheryl Sandberg",
        option2: "Brendan Eich",
        option3: "Tim Cook",
        answer: 2,
    },
    {
        question: "Which one of these is a JavaScript package manager?",
        option0: "Node.js",
        option1: "TypeScript",
        option2: "npm",
        option3: "jQuery",
        answer: 2,
    },
    {
        question: "Which tool can you use to ensure code quality?",
        option0: "Angular",
        option1: "jQuery",
        option2: "RequireJS",
        option3: "ESLint",
        answer: 3,
    }
];

//render ranking card
if (rankingArray.length > 0) {
    renderRanking();
}


//initialize the question page, get the first random question and start the count down timer.
function initializeQuestion() {

    secondsLeft = 60;
    questionCardEl.setAttribute("class", "show");
    startCardEl.setAttribute("class", "hide");
    resultCarEl.setAttribute("class", "show");
    rankingCardEl.setAttribute("class", "hide");
    finalResultEl.setAttribute("class", "hide")
    //set a new array avaliableQuestions
    for (var i = 0; i < questions.length; i++) {
        avaliableQuestions[i] = questions[i];
    }

    countDownTimer();
    getNextQuestion();
}

//function to get a new question
function getNextQuestion() {

    if (avaliableQuestions.length !== 0) {
        nextBtnEl.classList.add("show");
    }
    else {
        secondsLeft = 0;
        return;
    }

    //get a random question
    questionIndex = Math.floor(Math.random() * avaliableQuestions.length);
    currentQuestion = avaliableQuestions[questionIndex];
    //represent question
    questionEl.textContent = currentQuestion.question;
    //represent option
    for (var i = 0; i < optionsArrayEl.length; i++) {
        optionsArrayEl[i].textContent = currentQuestion["option" + i];
    }
    //after represent question, move out from the avaliableQuestions array
    avaliableQuestions.splice(questionIndex, 1);

    //add event listener on all the option buttons
    btnListEl.addEventListener("click", getAnswer);
}

//validate the select answer
function getAnswer(event) {
    var selectedOption = event.target.dataset["id"];
    if (selectedOption == currentQuestion.answer) {
        correctAnswer = true;
    }
    else {
        correctAnswer = false;
    }
}

//represent result
function checkAnswer() {
    if (correctAnswer) {
        correct++;
        score += 20;
    }
    else {
        incorrect++;
        secondsLeft -= 3;
    }

    correctEl.textContent = "Correct: " + correct;
    incorrectEl.textContent = "Incorrect: " + incorrect;
    answeredNum++;
    answeredEl.textContent = "Answered: " + answeredNum + "/" + questions.length;
}

//quiz finish:
function quizFinish() {
    finalEl.innerHTML = "";

    var resultTitle = document.createElement("h3");
    var resultCorrect = document.createElement("h4");
    var resultInCorrect = document.createElement("h4");
    var totalScore = document.createElement("h4");

    resultTitle.textContent = "Your result is:"
    resultCorrect.textContent = "Total correct: " + correct;
    resultInCorrect.textContent = "Total incorrect: " + incorrect;
    totalScore.textContent = "Total score: " + score;

    finalEl.appendChild(resultTitle);
    finalEl.appendChild(resultCorrect);
    finalEl.appendChild(resultInCorrect);
    finalEl.appendChild(totalScore);

    questionCardEl.setAttribute("class", "hide");
    // resultCarEl.setAttribute("class", "hide");
    finalResultEl.setAttribute("class", "show");
    // rankingCardEl.setAttribute("class", "show");
    submitEl.setAttribute("class", "show");
}

//count down timer
function countDownTimer() {
    var interval = setInterval(function () {
        timerEl.textContent = "Time left: " + secondsLeft;
        secondsLeft--;
        if (secondsLeft < 0) {
            clearInterval(interval);
            quizFinish();
            timerEl.textContent = "Time Finished";
            nextBtnEl.textContent = "RESTART";
        }
    }, 1000);
}

//arrary element compare, big to small
function compare(property) {
    return function (obj1, obj2) {
        var value1 = obj1[property];
        var value2 = obj2[property];
        return value2 - value1;
    }
}


//store records on local storage
function storeRecords() {
    var record = {
        "userName": userNameInputEl.value,
        "userScore": score
    }
    //store all records in a array
    rankingArray.push(record);
    //sort as reverse order
    rankingArray.sort(compare("userScore"));
    console.log(rankingArray);

    renderRanking();

    localStorage.setItem("records", JSON.stringify(rankingArray));
}

//render ranking display
function renderRanking() {
    rankingListEl.innerHTML = "";
    for (var i = 0; i < rankingArray.length; i++) {
        if (i < 3) {
            var rankingList = document.createElement("li");
            rankingList.classList.add("list-group-item");
            rankingList.textContent = (i + 1) + ". " + rankingArray[i].userName + " : " + rankingArray[i].userScore;
            rankingListEl.appendChild(rankingList);
        }
        else return;
    }
}



//add event listener on the "next" button
nextBtnEl.addEventListener("click", function () {
    //if click RESTAR then reload the page
    if (nextBtnEl.textContent == "RESTART") {
        location.reload();
    }
    else {
        checkAnswer();
        getNextQuestion();
    }
});

//add event listener on "start" button to start quiz
startBtnEl.addEventListener("click", initializeQuestion)

//add event listener on "subimt" button to store local storage
submitBtnEl.addEventListener("click", function (event) {
    event.preventDefault();
    //is user input is empty then alert, else display store record and display ranking
    if (document.getElementById("user-name").value.trim() !== "") {
        storeRecords();
        submitEl.setAttribute("class", "hide");
        rankingCardEl.setAttribute("class", "show");
        resultCarEl.setAttribute("class", "hide");
    }
    else {
        alert("Please enter your name!");
    }
})







