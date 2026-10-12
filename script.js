// Gaming World: demo account UI + two browser games.
// This is front-end practice, not secure authentication.

const accountButton = document.getElementById("accountButton");
const logoutButton = document.getElementById("logoutButton");
const welcomeText = document.getElementById("welcomeText");
const accountModal = document.getElementById("accountModal");
const closeAccountModal = document.getElementById("closeAccountModal");
const accountMessage = document.getElementById("accountMessage");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const tabButtons = document.querySelectorAll(".tab-button");

const gameModal = document.getElementById("gameModal");
const closeGameModal = document.getElementById("closeGameModal");
const gameModalTitle = document.getElementById("gameModalTitle");
const clickerGame = document.getElementById("clickerGame");
const numberGame = document.getElementById("numberGame");

// Demo accounts are kept in memory only and disappear when the page is refreshed.
const demoAccounts = [];
let currentUser = null;

function openModal(modal) {
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal(modal) {
  modal.classList.add("hidden");
  if (accountModal.classList.contains("hidden") && gameModal.classList.contains("hidden")) {
    document.body.style.overflow = "";
  }
}

function showAccountTab(tabName) {
  const showLogin = tabName === "login";
  loginForm.classList.toggle("hidden", !showLogin);
  signupForm.classList.toggle("hidden", showLogin);
  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });
  accountMessage.textContent = "";
}

accountButton.addEventListener("click", () => {
  showAccountTab("login");
  openModal(accountModal);
});
closeAccountModal.addEventListener("click", () => closeModal(accountModal));
accountModal.addEventListener("click", (event) => {
  if (event.target === accountModal) closeModal(accountModal);
});
tabButtons.forEach((button) => button.addEventListener("click", () => showAccountTab(button.dataset.tab)));

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = signupForm.username.value.trim();
  const password = signupForm.password.value;

  if (username.length < 3) {
    accountMessage.textContent = "Username must have at least 3 characters.";
    return;
  }
  if (demoAccounts.some((account) => account.username.toLowerCase() === username.toLowerCase())) {
    accountMessage.textContent = "That username is already taken in this session.";
    return;
  }

  demoAccounts.push({ username, password });
  currentUser = username;
  updateAccountUI();
  signupForm.reset();
  accountMessage.textContent = "Demo account created. Welcome!";
  window.setTimeout(() => closeModal(accountModal), 700);
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = loginForm.username.value.trim();
  const password = loginForm.password.value;
  const account = demoAccounts.find((item) => item.username.toLowerCase() === username.toLowerCase() && item.password === password);

  if (!account) {
    accountMessage.textContent = "No matching demo account. Sign up first in this page session.";
    return;
  }

  currentUser = account.username;
  updateAccountUI();
  loginForm.reset();
  accountMessage.textContent = "You're logged in!";
  window.setTimeout(() => closeModal(accountModal), 500);
});

function updateAccountUI() {
  const loggedIn = Boolean(currentUser);
  welcomeText.textContent = loggedIn ? `PLAYER: ${currentUser}` : "";
  accountButton.classList.toggle("hidden", loggedIn);
  logoutButton.classList.toggle("hidden", !loggedIn);
}

logoutButton.addEventListener("click", () => {
  currentUser = null;
  updateAccountUI();
});

// Close open overlays with Escape.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!accountModal.classList.contains("hidden")) closeModal(accountModal);
    if (!gameModal.classList.contains("hidden")) closeGame();
  }
});

// -------------------------
// GAME 1: NEON CLICKER
// -------------------------
const clickerTime = document.getElementById("clickerTime");
const clickerScore = document.getElementById("clickerScore");
const clickerBest = document.getElementById("clickerBest");
const clickerStart = document.getElementById("clickerStart");
const clickTarget = document.getElementById("clickTarget");
const clickerMessage = document.getElementById("clickerMessage");

let clicks = 0;
let secondsLeft = 20;
let clickerTimer = null;
let clickerRunning = false;
let clickerBestScore = 0;

function resetClicker() {
  window.clearInterval(clickerTimer);
  clickerTimer = null;
  clickerRunning = false;
  clicks = 0;
  secondsLeft = 20;
  clickerTime.textContent = secondsLeft;
  clickerScore.textContent = clicks;
  clickTarget.disabled = true;
  clickerStart.disabled = false;
  clickerStart.textContent = "START ROUND";
}

function startClicker() {
  resetClicker();
  clickerRunning = true;
  clickTarget.disabled = false;
  clickerStart.disabled = true;
  clickerStart.textContent = "ROUND RUNNING";
  clickerMessage.textContent = "Go! Click the glowing target!";
  clickerTimer = window.setInterval(() => {
    secondsLeft -= 1;
    clickerTime.textContent = secondsLeft;
    if (secondsLeft <= 0) finishClicker();
  }, 1000);
}

function finishClicker() {
  window.clearInterval(clickerTimer);
  clickerTimer = null;
  clickerRunning = false;
  clickTarget.disabled = true;
  clickerStart.disabled = false;
  clickerStart.textContent = "PLAY AGAIN";
  if (clicks > clickerBestScore) {
    clickerBestScore = clicks;
    clickerBest.textContent = clickerBestScore;
    clickerMessage.textContent = `Time! New personal best: ${clicks} clicks. Nice work!`;
  } else {
    clickerMessage.textContent = `Time's up! You scored ${clicks}. Try to beat your best of ${clickerBestScore}.`;
  }
}

clickerStart.addEventListener("click", startClicker);
clickTarget.addEventListener("click", () => {
  if (!clickerRunning) return;
  clicks += 1;
  clickerScore.textContent = clicks;
  // Change the target's look slightly so each click feels responsive.
  clickTarget.style.transform = `rotate(${(clicks % 2) ? 12 : -12}deg) scale(${(clicks % 2) ? 1.05 : 1})`;
});

// -------------------------
// GAME 2: NUMBER HUNTER
// -------------------------
const guessForm = document.getElementById("guessForm");
const guessInput = document.getElementById("guessInput");
const guessAttempts = document.getElementById("guessAttempts");
const guessBest = document.getElementById("guessBest");
const guessMessage = document.getElementById("guessMessage");
const newNumberGame = document.getElementById("newNumberGame");

let secretNumber = 0;
let attempts = 0;
let numberGameWon = false;
let bestGuessCount = null;

function startNumberGame() {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  numberGameWon = false;
  guessAttempts.textContent = "0";
  guessInput.value = "";
  guessInput.disabled = false;
  guessForm.querySelector("button").disabled = false;
  guessMessage.textContent = "New number chosen. Enter a guess from 1 to 100.";
  guessInput.focus();
}

guessForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (numberGameWon) return;

  const guess = Number(guessInput.value);
  if (!Number.isInteger(guess) || guess < 1 || guess > 100) {
    guessMessage.textContent = "Please enter a whole number from 1 to 100.";
    return;
  }

  attempts += 1;
  guessAttempts.textContent = attempts;

  if (guess === secretNumber) {
    numberGameWon = true;
    guessInput.disabled = true;
    guessForm.querySelector("button").disabled = true;
    if (bestGuessCount === null || attempts < bestGuessCount) {
      bestGuessCount = attempts;
      guessBest.textContent = bestGuessCount;
      guessMessage.textContent = `Correct! You found ${secretNumber} in ${attempts} ${attempts === 1 ? "guess" : "guesses"} — new best!`;
    } else {
      guessMessage.textContent = `Correct! The number was ${secretNumber}. You used ${attempts} guesses.`;
    }
  } else if (guess < secretNumber) {
    guessMessage.textContent = "Too low — try a higher number!";
  } else {
    guessMessage.textContent = "Too high — try a lower number!";
  }
  guessInput.select();
});

newNumberGame.addEventListener("click", startNumberGame);

// -------------------------
// GAME LAUNCHING / CLOSING
// -------------------------
function launchGame(gameName) {
  clickerGame.classList.toggle("hidden", gameName !== "clicker");
  numberGame.classList.toggle("hidden", gameName !== "number");

  if (gameName === "clicker") {
    gameModalTitle.innerHTML = 'NEON <span>CLICKER</span>';
    resetClicker();
    clickerMessage.textContent = "Press Start Round when you're ready.";
  } else {
    gameModalTitle.innerHTML = 'NUMBER <span>HUNTER</span>';
    startNumberGame();
  }
  openModal(gameModal);
}

document.querySelectorAll(".game-launch").forEach((button) => {
  button.addEventListener("click", () => launchGame(button.dataset.game));
});

function closeGame() {
  resetClicker();
  closeModal(gameModal);
}
closeGameModal.addEventListener("click", closeGame);
gameModal.addEventListener("click", (event) => {
  if (event.target === gameModal) closeGame();
});

// 20 extra games. Every challenge has 10 rounds to make it a longer play session.
const extraGames = [
["Word Scramble Quest","WORD PUZZLE","🔤","word","Unscramble ten increasingly tricky words."],
["Math Marathon","BRAIN POWER","➗","math","Solve ten arithmetic challenges that get harder."],
["Pattern Detective","LOGIC","🔎","pattern","Discover the rule and complete ten number patterns."],
["Code Breaker","CODE PUZZLE","🔐","code","Crack ten secret three-digit codes using clues."],
["Memory Master","MEMORY","🧠","memory","Memorize and recall ten growing sequences."],
["Riddle Dungeon","RIDDLES","🗝️","riddle","Answer ten riddles to escape the dungeon."],
["World Trivia Tour","TRIVIA","🌍","trivia","Travel through ten general-knowledge questions."],
["Spelling Champion","WORDS","✍️","spell","Type the correct spelling for ten words."],
["Number Sequence Lab","NUMBERS","🔢","sequence","Find the missing number in ten sequences."],
["Emoji Decoder","DECODER","🧩","emoji","Decode ten emoji clues into everyday words."],
["Science Explorer","SCIENCE","🧪","science","Pass ten science questions from easy to tricky."],
["Geography Genius","GEOGRAPHY","🗺️","geo","Answer ten questions about places and maps."],
["Word Ladder","WORD GAME","🪜","ladder","Solve ten word clues with exact answers."],
["Quick Calculus","MATH","📐","multi","Beat ten multi-step mental maths questions."],
["Logic Grid Mini","LOGIC","🧩","logic","Use clues to solve ten deduction puzzles."],
["Animal Kingdom","WILDLIFE","🦊","animal","Identify ten animals from clever clues."],
["History Hopper","HISTORY","🏛️","history","Journey through ten history knowledge checks."],
["Keyboard Sprint","TYPING","⌨️","typing","Copy ten phrases accurately to complete the sprint."],
["Treasure Coordinates","PUZZLE","🧭","coord","Solve ten coordinate and direction puzzles."],
["Final Boss Quiz","BOSS LEVEL","👾","boss","A ten-stage mixed quiz with tougher questions."]
].map(([name,category,icon,mode,desc])=>({name,category,icon,mode,desc}));
const extraGrid=document.querySelector(".game-grid");
extraGames.forEach((g,i)=>{const card=document.createElement("article");card.className="game-card extra-game-card";card.innerHTML=`<div class="game-art extra-art"><span class="art-tag">${g.category}</span><div class="extra-game-icon">${g.icon}</div><span class="art-bottom">10 ROUNDS • CHALLENGE MODE</span></div><div class="game-card-body"><div class="game-title-row"><h3>${g.name}</h3><span class="game-number">${String(i+3).padStart(2,"0")}</span></div><p>${g.desc}</p><div class="game-meta"><span>🧠 10 rounds</span><span>🏆 Challenge mode</span></div><button class="button button-primary extra-game-launch" data-extra-game="${i}" type="button">PLAY GAME →</button></div>`;extraGrid.appendChild(card);});
const extraScreen=document.createElement("section");extraScreen.id="extraGameScreen";extraScreen.className="game-screen hidden";extraScreen.innerHTML=`<p id="extraInstructions" class="game-instructions"></p><div class="score-board"><div><span>ROUND</span><strong id="extraRound">1/10</strong></div><div><span>SCORE</span><strong id="extraScore">0</strong></div><div><span>BEST RUN</span><strong id="extraBest">0</strong></div></div><div id="extraPrompt" class="extra-prompt"></div><form id="extraAnswerForm" class="guess-form"><label for="extraAnswer">Your answer</label><div class="guess-controls"><input id="extraAnswer" autocomplete="off" required placeholder="Type your answer"><button class="button button-primary" type="submit">SUBMIT</button></div></form><p id="extraMessage" class="game-message" role="status" aria-live="polite"></p><button id="extraNext" class="button button-outline full-width hidden" type="button">NEXT ROUND</button>`;document.querySelector(".game-modal-panel").appendChild(extraScreen);
const extraData={
word:[["tenalp","planet"],["zelzup","puzzle"],["nedrag","garden"],["yenruoj","journey"],["dnomaid","diamond"],["draobyek","keyboard"],["elgnairt","triangle"],["erutnevda","adventure"],["egnellahc","challenge"],["yretsym","mystery"]],
riddle:[["What has keys but cannot open locks?","piano"],["What gets wetter as it dries?","towel"],["What has a face and two hands but no arms?","clock"],["What has many teeth but cannot bite?","comb"],["What has one eye but cannot see?","needle"],["What goes up but never comes down?","age"],["What has a neck but no head?","bottle"],["What travels the world from one corner?","stamp"],["What has words but never speaks?","book"],["What has cities but no houses?","map"]],
trivia:[["Which planet is known as the Red Planet?","mars"],["How many sides does a hexagon have?","6"],["What is the largest ocean?","pacific"],["Which gas do plants absorb?","carbon dioxide"],["How many minutes are in 2 hours?","120"],["Water freezes at how many Celsius degrees?","0"],["What is the nearest star to Earth?","sun"],["How many continents are commonly taught?","7"],["What is the square root of 144?","12"],["Which instrument measures temperature?","thermometer"]],
science:[["What is H2O commonly called?","water"],["Which force pulls objects toward Earth?","gravity"],["Which plant part absorbs water?","roots"],["How many legs does an insect have?","6"],["What is the center of an atom called?","nucleus"],["Which organ pumps blood?","heart"],["Which planet is closest to the Sun?","mercury"],["What do bees collect from flowers?","nectar"],["What process lets plants make food?","photosynthesis"],["Which vitamin can sunlight help the body make?","vitamin d"]],
geo:[["What is the capital of Japan?","tokyo"],["Which country is shaped like a boot?","italy"],["What is the largest continent?","asia"],["The Nile is a famous what?","river"],["What is the capital of France?","paris"],["Which ocean lies between Africa and Australia?","indian"],["Mount Everest is in which range?","himalayas"],["What is the capital of India?","new delhi"],["Cairo is a city in which country?","egypt"],["What is the smallest continent?","australia"]],
animal:[["Which mammal can truly fly?","bat"],["What is the tallest land animal?","giraffe"],["Which animal can change color?","chameleon"],["What is a baby frog called?","tadpole"],["Which bird has a colorful tail display?","peacock"],["Which animal carries its home on its back?","snail"],["What is the fastest land animal?","cheetah"],["Which sea animal has eight arms?","octopus"],["A group of lions is called a what?","pride"],["Which animal has black-and-white stripes?","zebra"]],
history:[["The pyramids of Giza are in which country?","egypt"],["Who first walked on the Moon?","neil armstrong"],["Which civilization used hieroglyphs?","egyptians"],["What wall divided Berlin during the Cold War?","berlin wall"],["Which ship sank in 1912?","titanic"],["The Colosseum is in which city?","rome"],["Who built Machu Picchu?","inca"],["Which country gifted the Statue of Liberty?","france"],["The Renaissance followed which broad period?","middle ages"],["What ancient city was buried by Vesuvius?","pompeii"]],
emoji:[["🌧️ + 🌈","rainbow"],["🦷 + 🪥","toothbrush"],["⭐ + 🐟","starfish"],["🌞 + 🌻","sunflower"],["🐉 + 🪰","dragonfly"],["🧈 + 🪰","butterfly"],["🌊 + 🐴","seahorse"],["🧊 + 🍦","ice cream"],["📚 + 🪱","bookworm"],["🔥 + 🐜","fire ant"]],
ladder:[["A place where books are borrowed","library"],["A person who designs buildings","architect"],["A word meaning very large","enormous"],["Frozen water","ice"],["A place where planes take off","airport"],["A person who studies stars","astronomer"],["A story that teaches a lesson","fable"],["A shape with three sides","triangle"],["A place where paintings are shown","gallery"],["A device used to see tiny things","microscope"]],
logic:[["Mia is older than Leo. Leo is older than Ava. Who is youngest?","ava"],["All glips are blue. This is a glip. What color is it?","blue"],["You have 3 apples and take away 1. How many did you take?","1"],["A is before B; B before C. Which comes last?","c"],["How many cats are needed for four mice if each cat catches one?","4"],["Two days after Monday is what day?","wednesday"],["There are 5 birds; 2 fly away. How many remain?","3"],["A dozen equals how many?","12"],["Sam is left of Kim; Kim left of Jo. Who is farthest right?","jo"],["How many months have at least 28 days?","12"]],
coord:[["Start x=2, move 4 east. New x?","6"],["Start y=2, move 3 north. New y?","5"],["Move 2 west from x=8. New x?","6"],["Move 5 south from y=9. New y?","4"],["From x=1, move 3 east. New x?","4"],["From y=4, move 6 north. New y?","10"],["From x=10, move 7 west. New x?","3"],["From y=12, move 4 south. New y?","8"],["Move 2 east then 3 west from x=5. Final x?","4"],["Move 5 north then 2 south from y=3. Final y?","6"]]
};
const extraBestScores={};let activeExtraGame=null,extraRound=1,extraScore=0,extraQuestion=null,extraDone=false;
function getExtraQuestion(g,n){const i=n-1;if(extraData[g.mode]){let q=extraData[g.mode][i];if(g.mode==="word")return{prompt:`Unscramble this word: <b>${q[0].toUpperCase()}</b>`,answer:q[1]};if(g.mode==="emoji")return{prompt:`Decode these emojis: <b>${q[0]}</b>`,answer:q[1]};return{prompt:q[0],answer:q[1]};}
if(g.mode==="spell")return{prompt:`Spell this word correctly: <b>${extraData.word[i][1].toUpperCase()}</b>`,answer:extraData.word[i][1]};
if(g.mode==="math"||g.mode==="multi"){let a=12+i*7,b=5+i*3;return g.mode==="math"?{prompt:`Calculate: ${a} × ${b} + ${i*4}`,answer:String(a*b+i*4)}:{prompt:`Calculate: (${18+i*4} + ${6+i}) × 2 − ${i+3}`,answer:String((18+i*4+6+i)*2-i-3)};}
if(g.mode==="pattern"||g.mode==="sequence"){let a=i+2,b=i+3;return{prompt:`Find the next number: ${a}, ${a+b}, ${a+2*b}, ${a+3*b}, ?`,answer:String(a+4*b)};}
if(g.mode==="code"){let c=String(314+i*7);return{prompt:`A three-digit code has first digit ${c[0]}, middle digit ${c[1]} and last digit ${c[2]}. Enter the code.`,answer:c};}
if(g.mode==="memory"){let s=Array.from({length:n+2},(_,j)=>(j*3+n*2)%10).join(" ");return{prompt:`Memorize and type this sequence exactly: <b>${s}</b>`,answer:s};}
if(g.mode==="typing"){let s=["bright stars shine","practice makes progress","curiosity opens doors","small steps go far","keep your mind active","every puzzle has clues","focus and try again","learning can be fun","think before you answer","you are the final champion"][i];return{prompt:`Type this phrase exactly: <b>${s}</b>`,answer:s};}
if(g.mode==="boss"){let q=(i%2?extraData.science:extraData.trivia)[i];return{prompt:q[0],answer:q[1]};}
return{prompt:"What is 7 × 8?",answer:"56"};}
function startExtraGame(i){activeExtraGame=extraGames[i];extraRound=1;extraScore=0;extraDone=false;$("clickerGame").classList.add("hidden");$("numberGame").classList.add("hidden");extraScreen.classList.remove("hidden");gameModalTitle.innerHTML=`${activeExtraGame.icon} <span>${activeExtraGame.name.toUpperCase()}</span>`;$("extraInstructions").textContent="Complete all 10 rounds. Take your time — you can retry an answer until it is correct.";$("extraBest").textContent=extraBestScores[i]||0;openModal(gameModal);showExtraRound();}
function showExtraRound(){extraQuestion=getExtraQuestion(activeExtraGame,extraRound);$("extraRound").textContent=`${extraRound}/10`;$("extraScore").textContent=extraScore;$("extraPrompt").innerHTML=extraQuestion.prompt;$("extraMessage").textContent=`Round ${extraRound} of 10`; $("extraAnswer").value="";$("extraAnswer").disabled=false;$("extraAnswerForm").querySelector("button").disabled=false;$("extraAnswerForm").classList.remove("hidden");$("extraNext").classList.add("hidden");$("extraNext").textContent="NEXT ROUND";$("extraAnswer").focus();}
$("extraAnswerForm").addEventListener("submit",e=>{e.preventDefault();if(extraDone)return;let a=$("extraAnswer").value.trim().toLowerCase().replace(/\s+/g," "),correct=extraQuestion.answer.toLowerCase().replace(/\s+/g," ");if(a!==correct){$("extraMessage").textContent="Not quite — review the clue and try again.";return;}extraScore++;$("extraScore").textContent=extraScore;$("extraAnswer").disabled=true;$("extraAnswerForm").querySelector("button").disabled=true;if(extraRound===10){extraDone=true;let i=extraGames.indexOf(activeExtraGame);extraBestScores[i]=Math.max(extraBestScores[i]||0,extraScore);$("extraBest").textContent=extraBestScores[i];$("extraMessage").textContent=`Challenge complete! You scored ${extraScore}/10. Great work!`;$("extraNext").textContent="PLAY AGAIN";}else{$("extraMessage").textContent="Correct! Ready for the next round?";} $("extraNext").classList.remove("hidden");});
$("extraNext").addEventListener("click",()=>{if(extraDone){startExtraGame(extraGames.indexOf(activeExtraGame));return;}extraRound++;showExtraRound();});
extraGrid.addEventListener("click",e=>{const b=e.target.closest(".extra-game-launch");if(b)startExtraGame(Number(b.dataset.extraGame));});
document.querySelectorAll(".game-launch").forEach(b=>b.addEventListener("click",()=>extraScreen.classList.add("hidden")));
const previousCloseGame=closeGame;closeGame=function(){extraScreen.classList.add("hidden");previousCloseGame();};
