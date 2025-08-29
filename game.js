const canvas = document.getElementById('pong-canvas');
const ctx = canvas.getContext('2d');

// Paddle settings
const paddleWidth = 12;
const paddleHeight = 80;
const playerX = 20;
const aiX = canvas.width - paddleWidth - 20;

// Ball settings
const ballSize = 16;

// State
let playerY = canvas.height / 2 - paddleHeight / 2;
let aiY = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2 - ballSize / 2;
let ballY = canvas.height / 2 - ballSize / 2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);

let playerScore = 0;
let aiScore = 0;

// Mouse event for player paddle control
canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - paddleHeight / 2;

    // Clamp paddle inside the canvas
    if (playerY < 0) playerY = 0;
    if (playerY + paddleHeight > canvas.height) playerY = canvas.height - paddleHeight;
});

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top/bottom walls
    if (ballY <= 0 || ballY + ballSize >= canvas.height) {
        ballSpeedY *= -1;
        ballY = Math.max(Math.min(ballY, canvas.height - ballSize), 0);
    }

    // Ball collision with player paddle
    if (
        ballX <= playerX + paddleWidth &&
        ballY + ballSize >= playerY &&
        ballY <= playerY + paddleHeight
    ) {
        ballSpeedX *= -1;
        // Add a little randomness to ball Y speed
        ballSpeedY += (Math.random() - 0.5) * 2;
        ballX = playerX + paddleWidth;
    }

    // Ball collision with AI paddle
    if (
        ballX + ballSize >= aiX &&
        ballY + ballSize >= aiY &&
        ballY <= aiY + paddleHeight
    ) {
        ballSpeedX *= -1;
        // Add a little randomness to ball Y speed
        ballSpeedY += (Math.random() - 0.5) * 2;
        ballX = aiX - ballSize;
    }

    // Score for player or AI
    if (ballX < 0) {
        aiScore++;
        resetBall(-1);
    } else if (ballX + ballSize > canvas.width) {
        playerScore++;
        resetBall(1);
    }

    // AI paddle movement: Simple follows ball
    const aiCenter = aiY + paddleHeight / 2;
    // Add a little delay for more fun
    if (aiCenter < ballY + ballSize / 2) {
        aiY += 5;
    } else {
        aiY -= 5;
    }
    // Clamp AI paddle inside canvas
    if (aiY < 0) aiY = 0;
    if (aiY + paddleHeight > canvas.height) aiY = canvas.height - paddleHeight;
}

function resetBall(direction) {
    ballX = canvas.width / 2 - ballSize / 2;
    ballY = canvas.height / 2 - ballSize / 2;
    ballSpeedX = 5 * direction * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw middle dashed line
    ctx.setLineDash([12, 18]);
    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(playerX, playerY, paddleWidth, paddleHeight);
    ctx.fillRect(aiX, aiY, paddleWidth, paddleHeight);

    // Draw ball
    ctx.fillStyle = "#fff";
    ctx.fillRect(ballX, ballY, ballSize, ballSize);

    // Draw scores
    ctx.font = "36px Arial";
    ctx.textAlign = "center";
    ctx.fillText(playerScore, canvas.width / 4, 50);
    ctx.fillText(aiScore, canvas.width * 3 / 4, 50);
}

// Start the game
gameLoop();
