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

function drawBasket() {
    ctx.fillStyle = "brown";
    ctx.fillRect(
        basket.x,
        basket.y,
        basket.width,
        basket.height
    );
}

function drawFruit() {
    ctx.fillStyle = "red";

    ctx.beginPath();
    ctx.arc(
        fruit.x,
        fruit.y,
        fruit.size / 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

function resetFruit() {
    fruit.x = Math.random() * (canvas.width - fruit.size);
    fruit.y = 0;
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
