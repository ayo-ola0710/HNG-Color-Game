function randomNum() {
  return Math.floor(Math.random() * 256);
}

function randomColor() {
  return `rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`;
}

function generateOptions(correctColor) {
  const array = [correctColor];
  
  for (let i = 0; i < 5; i++) {
      array.push(randomColor());
  }
  
  return array.sort(() => Math.random() - 0.5);
}

let targetColor;
let score = 0;
let isAnimating = false; // Prevent multiple clicks during animation

function updateScoreDisplay() {
  document.getElementById('score').textContent = score;
}

function showFeedback(message, isCorrect) {
  const feedbackElement = document.getElementById('feedback');
  feedbackElement.innerHTML = `
      <div class="feedback-message ${isCorrect ? 'correct' : 'incorrect'}">
          ${message}
      </div>
  `;
  
  // Add animation class
  feedbackElement.classList.add('animate-feedback');
  setTimeout(() => {
      feedbackElement.classList.remove('animate-feedback');
  }, 500);
}

function handleColorClick(selectedColor) {
  if (isAnimating) return; // Prevent multiple clicks during animation
  isAnimating = true;
  
  const isCorrect = selectedColor === targetColor;
  
  if (isCorrect) {
      score++;
      showFeedback('Correct! +1 point', true);
  } else {
      score = Math.max(0, score - 1);
      showFeedback('Wrong! -1 point', false);
  }
  
  updateScoreDisplay();
  
  // Highlight correct answer
  const buttons = document.querySelectorAll(".color-option");
  buttons.forEach(button => {
      if (button.style.backgroundColor === targetColor) {
          button.classList.add('correct-answer');
      }
      button.style.pointerEvents = 'none'; // Disable clicks temporarily
  });
  
  // Wait for animation before starting new round
  setTimeout(() => {
      buttons.forEach(button => {
          button.classList.remove('correct-answer');
          button.style.pointerEvents = 'auto';
      });
      isAnimating = false;
      newRound();
  }, 1000);
}

function newRound() {
  targetColor = randomColor();
  const options = generateOptions(targetColor);
  
  const colorBox = document.getElementById("colorBox");
  colorBox.style.backgroundColor = targetColor;
  
  const buttons = document.querySelectorAll(".color-option");
  buttons.forEach((button, index) => {
      button.style.backgroundColor = options[index];
      button.style.opacity = "1";
      button.style.cursor = "pointer";
      
      // Remove old event listeners and add new ones
      button.replaceWith(button.cloneNode(true));
  });
  
  // Re-add event listeners to the new buttons
  document.querySelectorAll(".color-option").forEach((button, index) => {
      button.addEventListener('click', () => handleColorClick(options[index]));
  });
}

function startNewGame() {
  score = 0;
  updateScoreDisplay();
  document.getElementById('feedback').innerHTML = "";
  
  const buttons = document.querySelectorAll(".color-option");
  buttons.forEach(button => {
      button.style.opacity = "1";
      button.style.cursor = "pointer";
      button.classList.remove('correct-answer');
  });
  
  newRound();
}

// Add this CSS to your stylesheet
const style = document.createElement('style');
style.textContent = `
  .correct-answer {
      box-shadow: 0 0 15px #4CAF50;
      transform: scale(1.05);
      transition: all 0.3s ease;
  }
  
  .animate-feedback {
      animation: fadeInOut 0.5s ease;
  }
  
  .feedback-message {
      padding: 10px;
      border-radius: 5px;
      margin: 10px 0;
      transition: all 0.3s ease;
  }
  
  .feedback-message.correct {
      background-color: rgba(76, 175, 80, 0.2);
      color: #4CAF50;
  }
  
  .feedback-message.incorrect {
      background-color: rgba(244, 67, 54, 0.2);
      color: #F44336;
  }
  
  @keyframes fadeInOut {
      0% { opacity: 0; transform: translateY(-10px); }
      50% { opacity: 1; transform: translateY(0); }
      100% { opacity: 1; }
  }
`;
document.head.appendChild(style);

// Initialize the game
const game = document.getElementById("newGameButton");
game.addEventListener('click', startNewGame);
window.addEventListener('load', startNewGame);