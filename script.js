// 1 - load questions it is a mirror for the json file
let quizData = {
    easy:[],
    medium:[],
    hard:[],
}
const url = "questions.json";  // fetch api local

async function loadQuestions() {    //something in the networking so we are waiting promise thats why we used async
    try{
        const response =await fetch(url); // l fetch by5ud url w berud promise krml hek mnhut await
        if(!response.ok){
            throw new Error("Network response was not ok " )
        }
        quizData = await response.json() // s7bna l file w hatena hun using this function
    
    
    
    } catch(error){
        console.error("Error loading questions" , " " , error)
    }
}
loadQuestions(); // call the function to load questions

////////////////////////////////////////////////////////////////////

let currentQuestionIndex = 0;
let currentLevel = "easy";
let score = 0;
let Timer;
let timeLeft = 50 ;
let quizEnded = false;


//2 - tane function le hye bt3ml start lal quiz

function startQuiz(level){  //la nshuf aya level bdna nblsh l quiz
    if (!quizData[level]){
        alert("No questions for this level");
        return; //exit 
    }
    //mnsafer kel she krml eza hda 3m yst3mlon bm7l tane ma y2ser 3lyna so we override them la nryh rasna
    currentLevel = level;
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 50 ;
    quizEnded = false;
    // hala2 bs yblesh l quiz lzm n3ml hidden la awal containeer w visible la tane whd
    document.getElementById("result").innerText= '';
    document.getElementById("leaderBoard").style.display="none";
    document.getElementById("difficultyContainer").style.display="none";
    document.getElementById("quizContainer").style.display="block";
    document.getElementById("next-btn").style.display="inline-block";
    document.getElementById("questionCount").style.display="block";

    loadQuestion(level); //load question msh questionsss y3ne load la kol so2al hye empty div bdna n3ml creation la ela hun
    startTimer();

}

function loadQuestion() { // No params needed
    if (quizEnded) return;

    const questionData = quizData[currentLevel][currentQuestionIndex];
    document.getElementById("question").innerText = questionData.question;

    const optionContainer = document.getElementById("options");
    optionContainer.innerHTML = "";

    questionData.options.forEach((option) => {
        const btn = document.createElement("button");
        btn.classList.add("option-btn");
        btn.innerText = option;
        btn.onclick = () => checkAnswer(option, btn); // Pass btn to checkAnswer
        optionContainer.appendChild(btn);
    });

    document.getElementById("next-btn").disabled = true; // Ensure Next button is disabled initially
    const remainingQuestions = quizData[currentLevel].length - currentQuestionIndex - 1;
    document.getElementById("questionCount").innerText = `Remaining Questions: ${remainingQuestions}`;
}


function checkAnswer(selectedOption,button){  //this fn will check the answer 
    if(quizEnded) return ;
    const correctAnswer = quizData[currentLevel][currentQuestionIndex].answer; 
    const optionBtn = document.querySelectorAll(".option-btn"); // queryselector all options that have css called option btnto disbale them
    //to disable all options
    optionBtn.forEach((btn) => btn.disabled = true);
    if(selectedOption === correctAnswer){
        button.classList.add("correct");
        score++;
    }
    else{
        button.classList.add("incorrect");
        document.querySelector('.option-btn:not(.incorrect):not(.selected)').classList.add("correct")
    }
    document.getElementById("next-btn").disabled= false; //clickable again
   
}

function nextQuestion(){
    if(quizEnded) return ;
    currentQuestionIndex++;
    if(currentQuestionIndex<quizData[currentLevel].length){
        loadQuestion();
    }
    else{
        clearInterval(Timer);
        showResult();
    }
}

function showResult() {
    quizEnded = true;
    let resultMsg = `Quiz Over! You scored ${score} out of ${quizData[currentLevel].length}`;
    if (score > quizData[currentLevel].length * 0.7) {
        resultMsg += ` You are a genius!`;
    } else {
        resultMsg += ` Oops! Sorry you lost.`;
    }
    // Display result and leaderboard
    document.getElementById("result").innerText = resultMsg;
    document.getElementById("leaderBoard").innerText = `Leaderboard\nScore: ${score}`;
    document.getElementById("leaderBoard").style.display = "block";
    document.getElementById("next-btn").style.display = "none";
    document.getElementById("questionCount").style.display = "none";
    document.getElementById("try-again-btn").style.display = "inline-block"; // Show the "Try Again" button
}

function resetQuiz() {
    // Hide the "Try Again" button and show the "difficultyContainer"
    document.getElementById("try-again-btn").style.display = "none";
    document.getElementById("difficultyContainer").style.display = "block";
    document.getElementById("quizContainer").style.display = "none";
    document.getElementById("leaderBoard").style.display = "none";
    document.getElementById("result").innerText = '';
    document.getElementById("questionCount").style.display = "none";
    document.getElementById("next-btn").style.display = "none";

    // Reset quiz state
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 50;
    quizEnded = false;
}


function startTimer(){
    Timer = setInterval(() => {
        if(quizEnded){
            clearInterval(Timer);
        }
        else{
            timeLeft--;
            document.getElementById("timer-value").innerText = timeLeft;
            if(timeLeft <= 0 ){
                clearInterval(Timer);
                quizEnded=true;
                showResult();
            }
        }
},1000) // this function will run every one second
}

document.getElementById("next-btn").addEventListener("click" , nextQuestion);