const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let score = 0;
let lives = 3;

const basket = {
    x: 200,
    y: 540,
    width: 100,
    height: 30,
    speed: 15
};

const fruits = [
    "🍎",
    "🍌",
    "🍇",
    "🍓",
    "🍉",
    "🍍",
    "🥝",
    "🍒"
];

function drawBasket() {
    ctx.font = "80px Arial";
    ctx.fillText(
        "🧺",
        basket.x,
        basket.y + 60
    );
}

function updateLives() {
    document.getElementById("lives").innerHTML =
        "❤️".repeat(lives);
}

let fruit = {
    x: Math.random() * 470,
    y: 0,
    size: 40,
    speed: 1.5,
    emoji: fruits[Math.floor(Math.random() * fruits.length)]
};

document.addEventListener("keydown", moveBasket);

function moveBasket(e) {
    if (e.key === "ArrowLeft") {
        basket.x -= basket.speed;
    }

    if (e.key === "ArrowRight") {
        basket.x += basket.speed;
    }

    if (basket.x < 0) basket.x = 0;

    if (basket.x > canvas.width - basket.width) {
        basket.x = canvas.width - basket.width;
    }
}

ctx.font = "80px Arial";

// 天空背景
const gradient =
    ctx.createLinearGradient(
        0, 0,
        0, canvas.height
    );

gradient.addColorStop(0, "#87CEEB");
gradient.addColorStop(1, "#FFFACD");

ctx.fillStyle = gradient;
ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
);

// 草地
ctx.fillStyle = "#90EE90";
ctx.fillRect(
    0,
    canvas.height - 80,
    canvas.width,
    80
);

function drawFruit(){

    ctx.font = "40px Arial";

    ctx.fillText(
        fruit.emoji,
        fruit.x,
        fruit.y
    );

}

function resetFruit(){

    fruit.x = Math.random() * (canvas.width - 50);
    fruit.y = 0;

    fruit.emoji =
        fruits[Math.floor(Math.random() * fruits.length)];

}

function update() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    fruit.y += fruit.speed;

    // 接到水果
    if (
        fruit.y + fruit.size >= basket.y &&
        fruit.x >= basket.x &&
        fruit.x <= basket.x + basket.width
    ) {

        score++;

        document.getElementById("score").textContent = score;

        // 每10分加速
        if (score % 10 === 0) {
            fruit.speed += 0.3;
        }

        resetFruit();
    }

    // 漏接
    if (fruit.y > canvas.height) {

        lives--;

        document.getElementById("lives").textContent = lives;

        resetFruit();

        if (lives <= 0) {
            alert("遊戲結束！分數：" + score);
            return;
        }
    }

    drawBasket();
    drawFruit();

    requestAnimationFrame(update);
}

update();
