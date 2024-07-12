const board = document.getElementById("game-board");
const instrText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score_text = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const level_text = document.getElementsByClassName("level-text")


let snake = [{
    x: 10,
    y: 10,
}];
let level = 1;
let score = 0;
let isGameStart = false;
let gameSpeed = 200;
let gridSize = 20;
let wall = [];
let food = generateFood();
let direction = "left";
let highScore = 0;
let gameIntervalId;
let sounds_food = new Audio("food.mp3");
let sounds_music = new Audio("music.mp3")

function draw() {
    board.innerHTML = "";
    drawWall();
    drawSnake();
    drawFood();
    updateScore()
}

function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createElement("div", "snake");
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement)
    });
}

function createElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

function drawWall() {
    wall.forEach(el => {
        const wallElement = createElement("div", "wall");
        setPosition(wallElement, el);
        board.appendChild(wallElement)
    })
}

function drawFood() {
    let foodElement = createElement("div", "food");
    setPosition(foodElement, food);
    board.appendChild(foodElement)
}

function generateFood() {
    let isFoodOnObj = true;
    let x, y;
    while (isFoodOnObj) {
        isFoodOnObj = false;
        x = Math.floor(Math.random() * gridSize) + 1;
        y = Math.floor(Math.random() * gridSize) + 1;
        snake.forEach(el => {
            if (el.x == x && el.y == y) {
                isFoodOnObj = true;
            }
        });
        wall.forEach(el => {
            if (y == el.y && x == el.x) {
                isFoodOnObj = true;
            }
        })
    }
    return { x, y };
}

function generateWall() {
    let isWallOnObj = true;
    let x, y;
    let attempts = 0;
    const maxAttempts = 100;

    while (isWallOnObj && attempts < maxAttempts) {
        isWallOnObj = false;
        x = Math.floor(Math.random() * gridSize) + 1;
        y = Math.floor(Math.random() * gridSize) + 1;
        snake.forEach(el => {
            if (el.x == x && el.y == y) {
                isWallOnObj = true;
            }
        });
        if (food.x == x && food.y == y) {
            isWallOnObj = true;
        }
        attempts++;
    }
    if (attempts >= maxAttempts) {
        return null;
    }

    return { x, y };
}


function checkCollision() {
    let head = { ...snake[0] };
    if (head.x > gridSize || head.x < 1 || head.y > gridSize || head.y < 1) {
        resetGame();
    }
    wall.forEach(el => {
        if (el.y == head.y && el.x == head.x) {
            resetGame();
        }
    })
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
            break;
        }
    }
}

function resetGame() {
    updateHighScore();
    clearInterval(gameIntervalId);
    wall = [];
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = "right";
    updateScore()
    score = 0;
    startGame();
}

function updateScore() {
    score_text.textContent = score.toString().padStart(3, "0");
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
    }
    highScoreText.textContent = highScore.toString().padStart(3, "0");
    highScoreText.style.display = "block";
}

function startGame() {
    isGameStart = true;
    logo.style.display = "none";
    instrText.style.display = "none";
    score = 0;
    switch (level) {
        case 1:
            level_text[0].textContent = "level " + level;
            setOpacity(level_text[0]).then(() => {
                gameIntervalId = setInterval(() => {
                    move();
                    checkCollision();
                    draw();
                }, gameSpeed);
            });
            break;
        case 2:
            level_text[0].textContent = "level " + level;
            gameSpeed = 150;
            setOpacity(level_text[0]).then(() => {
                clearInterval(gameIntervalId);
                gameIntervalId = setInterval(() => {
                    move();
                    checkCollision();
                    draw();
                }, gameSpeed);
            });
            break;
        case 3:
            level_text[0].textContent = "level " + level;
            gameSpeed = 170;
            setOpacity(level_text[0]).then(() => {
                clearInterval(gameIntervalId);
                gameIntervalId = setInterval(() => {
                    move();
                    checkCollision();
                    draw();
                }, gameSpeed);
            });
            break;
        case 4:
            level_text[0].textContent = "level " + level;
            gameSpeed = 165;
            board.style.gridTemplateColumns = "repeat(25, 18px)";
            board.style.gridTemplateRows = "repeat(25, 18px)";
            gridSize = 25;
            setOpacity(level_text[0]).then(() => {
                clearInterval(gameIntervalId);
                gameIntervalId = setInterval(() => {
                    move();
                    checkCollision();
                    draw();
                }, gameSpeed);
            });
            break;
        case 5:
            clearInterval(gameIntervalId);
            snake = [];
            food = [];
            wall = [];
            sounds_music.play();
            level_text[0].textContent = "You won...";
            let op = 0;
            level_text[0].style.display = "block";
            let id = setInterval(() => {
                level_text[0].style.opacity = op;
                op += 0.1;
                if (op >= 1) {
                    clearInterval(id);
                }
            }, 150);
            score = 0;
            break;
    }
}

function move() {
    let head = { ...snake[0] };
    switch (direction) {
        case "up":
            head.y--;
            break;
        case "down":
            head.y++;
            break;
        case "left":
            head.x--;
            break;
        case "right":
            head.x++;
            break;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score += 1;
        sounds_food.play()
        if (score == level * 10) {
            level += 1;
            resetGame();
            startGame();
            return;
        }
        if (level == 3) {
            const newWall = generateWall();
            if (newWall) {
                wall.push(newWall);
            }
        }
        if (level == 4) {
            let newWall
            for (let i = 0; i < 2; i++) {
                newWall = generateWall();
                if (newWall) {
                    wall.push(newWall);
                }
            }
        }
        food = generateFood();
    } else {
        snake.pop();
    }
}


function setOpacity(el) {
    return new Promise((resolve) => {
        let op = 0;
        el.style.display = "block";
        let id = setInterval(() => {
            el.style.opacity = op;
            op += 0.1;
            if (op >= 1) {
                clearInterval(id);
                reduceOpacity(el);
                resolve();
            }
        }, 150);
    });
}


function reduceOpacity(el) {
    let op = 1;
    let id = setInterval(() => {
        el.style.opacity = op;
        op -= 0.1;
        if (op <= 0) {
            clearInterval(id);
        }
    }, 150)
}


document.addEventListener("keydown", handKeyPress);
function handKeyPress(event) {
    if ((!isGameStart && event.code === "Space") ||
        (!isGameStart && event.key === " ")) {
        startGame();
    } else {
        switch (event.key) {
            case "ArrowUp":
                if (direction != "down" || snake.length == 1) {
                    direction = "up";
                }
                break;
            case "ArrowDown":
                if (direction != "up" || snake.length == 1) {
                    direction = "down";
                }
                break;
            case "ArrowLeft":
                if (direction != "right" || snake.length == 1) {
                    direction = "left"
                }
                break;
            case "ArrowRight":
                if (direction != "left" || snake.length == 1) {
                    direction = "right";
                }
                break;
        }
    }
}