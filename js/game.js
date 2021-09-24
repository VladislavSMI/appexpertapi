const canvas = document.getElementById("canvas");
const won = document.getElementById("won");
const ctx = canvas.getContext("2d");

const btnLeft = document.getElementById("btn-left");
const btnRight = document.getElementById("btn-right");
const btnControllers = document.getElementById("btn-controllers");

const speedOfBall = document.getElementById("speed");
const widthOfPaddle = document.getElementById("width");

// adding btn left and right for mobile versions
let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (!isMobile) {
  btnControllers.classList.add("invisible");
}

let score = 0;
const delay = 5000;

// Game properties
const brickCounts = {
  brickRowCount: 9,
  brickColumnCount: 5,
};

const ball = {
  x: 400,
  y: 300,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
  visible: true,
};

const paddle = {
  x: 360,
  y: 580,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
  visible: true,
};

const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

// Create bricks
let bricks = [];
function bricksUpdate() {
  bricks = [];
  for (let i = 0; i < brickCounts.brickRowCount; i++) {
    bricks[i] = []; // Array for each row
    for (let j = 0; j < brickCounts.brickColumnCount; j++) {
      const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
      const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
      bricks[i][j] = { x, y, ...brickInfo };
    }
  }
}

// Draw ball on canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = ball.visible ? "#095d86" : "transparent";
  ctx.fill();
  ctx.closePath();
}

// Draw paddle on canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = paddle.visible ? "#095d86" : "transparent";
  ctx.fill();
  ctx.closePath();
}

// Draw score on canvas
function drawScore() {
  ctx.font = "20px Roboto";
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

// Draw bricks on canvas
function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#1175a8" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}

// Move paddle on canvas
function movePaddle() {
  paddle.x += paddle.dx;

  // Wall detection
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

// Move ball on canvas
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision (x => right/left)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }

  // Wall collison (y => top/bottom)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  // Paddle collision
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  // Brick collision
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && //left brick side check
          ball.x + ball.size < brick.x + brick.w && // right brick side check
          ball.y + ball.size > brick.y && // top brick side check
          ball.y - ball.size < brick.y + brick.h // bottom brick side check
        ) {
          ball.dy *= -1;
          brick.visible = false;

          increaseScore();
        }
      }
    });
  });

  // Hit bottom wall - Lose
  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }
}

// Increase score
function increaseScore() {
  score++;

  if (
    score % (brickCounts.brickRowCount * brickCounts.brickColumnCount) ===
    0
  ) {
    ball.visible = false;
    paddle.visible = false;
    won.style.visibility = "visible";

    //After 5 sec restart the game
    setTimeout(function () {
      showAllBricks();
      won.style.visibility = "hidden";

      score = 0;
      paddle.x = canvas.width / 2 - 40;
      paddle.y = canvas.height - 20;
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.visible = true;
      paddle.visible = true;
    }, delay);
  }
}

function showAllBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => (brick.visible = true));
  });
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

// Update canvas drawing and animation
function update() {
  movePaddle();
  moveBall();

  // Draw everything
  draw();

  requestAnimationFrame(update);
}

// Keyddown event
function keyDown(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.target.id === "btn-right"
  ) {
    paddle.dx = paddle.speed;
  } else if (
    e.key === "Left" ||
    e.key === "ArrowLeft" ||
    e.target.id === "btn-left"
  ) {
    paddle.dx = -paddle.speed;
  }
}

// Keyup event
function keyUp(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft" ||
    e.target.id === "btn-right" ||
    e.target.id === "btn-left"
  ) {
    paddle.dx = 0;
  }
}

// Keyboard event handlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
btnLeft.addEventListener("mousedown", keyDown);
// btnLeft.addEventListener("mouseup", keyUp);
btnRight.addEventListener("mouseup", keyDown);
// btnRight.addEventListener("mouseup", keyUp);

// Input and resize event handlers
speedOfBall.addEventListener("change", () => {
  let speedOfBallValue = +speedOfBall.value;
  ball.speed = speedOfBallValue;
  ball.dx = speedOfBallValue;
  ball.dy = -Math.abs(speedOfBallValue);
});

widthOfPaddle.addEventListener("change", () => {
  let widthOfPaddleValue = +widthOfPaddle.value;
  paddle.w = widthOfPaddleValue;
});

window.addEventListener("resize", () => {
  changingGameProps();
});

// Responsively changing game props
function changingGameProps() {
  if (window.innerWidth > 850) {
    canvas.width = 800;
    canvas.height = 600;
    brickCounts.brickRowCount = 9;
    brickCounts.brickColumnCount = 5;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.size = 10;
    ball.speed = 4;
    ball.dx = 4;
    ball.dy = -4;
    brickInfo.w = 70;
    brickInfo.h = 20;
    brickInfo.padding = 10;
    brickInfo.offsetX = 45;
    paddle.x = canvas.width / 2 - 40;
    paddle.y = canvas.height - 20;
    paddle.w = 80;
    widthOfPaddle.value = 80;
    speedOfBall.value = 4;
  } else if (window.innerWidth > 650) {
    canvas.width = 600;
    canvas.height = 400;
    brickCounts.brickRowCount = 7;
    brickCounts.brickColumnCount = 4;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.size = 8;
    ball.speed = 3;
    ball.dx = 3;
    ball.dy = -3;
    brickInfo.w = 64;
    brickInfo.h = 18;
    brickInfo.padding = 10;
    brickInfo.offsetX = 45;
    paddle.x = canvas.width / 2 - 35;
    paddle.y = canvas.height - 20;
    paddle.w = 70;
    widthOfPaddle.value = 70;
    speedOfBall.value = 3;
  } else if (window.innerWidth > 550) {
    canvas.width = 500;
    canvas.height = 350;
    brickCounts.brickRowCount = 6;
    brickCounts.brickColumnCount = 4;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.size = 7;
    ball.speed = 2;
    ball.dx = 2;
    ball.dy = -2;
    brickInfo.w = 60;
    brickInfo.h = 15;
    brickInfo.padding = 10;
    brickInfo.offsetX = 45;
    paddle.x = canvas.width / 2 - 35;
    paddle.y = canvas.height - 20;
    paddle.w = 70;
    widthOfPaddle.value = 70;
    speedOfBall.value = 2;
  } else {
    canvas.width = 300;
    canvas.height = 200;
    brickCounts.brickRowCount = 5;
    brickCounts.brickColumnCount = 3;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.size = 6;
    ball.speed = 2;
    brickInfo.w = 40;
    brickInfo.h = 15;
    brickInfo.padding = 5;
    brickInfo.offsetX = 40;
    paddle.x = canvas.width / 2 - 30;
    paddle.y = canvas.height - 20;
    paddle.w = 60;
    widthOfPaddle.value = 60;
    speedOfBall.value = 2;
  }
  bricksUpdate();
}

// Function calls on reload
update();
changingGameProps();
