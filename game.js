const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let score = 0;
let lives = 3;
let gameOver = false; // 新增：控制遊戲結束狀態

const basket = {
    x: 200,
    y: 540,
    width: 100,
    height: 30,
    speed: 15
};

const fruits = ["🍎", "🍌", "🍇", "🍓", "🍉", "🍍", "🥝", "🍒"];

let fruit = {
    x: Math.random() * (canvas.width - 50),
    y: 0,
    size: 40,
    speed: 1.5,
    emoji: fruits[Math.floor(Math.random() * fruits.length)]
};

// 鍵盤控制
document.addEventListener("keydown", moveBasket);

function moveBasket(e) {
    if (gameOver) return; // 遊戲結束後禁止移動

    if (e.key === "ArrowLeft") {
        basket.x -= basket.speed;
    }
    if (e.key === "ArrowRight") {
        basket.x += basket.speed;
    }

    // 邊界限制
    if (basket.x < 0) basket.x = 0;
    if (basket.x > canvas.width - basket.width) {
        basket.x = canvas.width - basket.width;
    }
}

// 繪製背景（天空與草地）-> 移成獨立函式，讓 update 可以重覆繪製
function drawBackground() {
    // 天空背景
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#87CEEB");
    gradient.addColorStop(1, "#FFFACD");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 草地
    ctx.fillStyle = "#90EE90";
    ctx.fillRect(0, canvas.height - 80, canvas.width, 80);
}

function drawBasket() {
    ctx.font = "80px Arial";
    ctx.fillText("🧺", basket.x, basket.y + 60);
}

function drawFruit() {
    ctx.font = "40px Arial";
    ctx.fillText(fruit.emoji, fruit.x, fruit.y);
}

function updateLives() {
    const livesEl = document.getElementById("lives");
    if (livesEl) {
        // 使用原來的愛心圖標更美觀
        livesEl.innerHTML = "❤️".repeat(lives);
    }
}

function resetFruit() {
    fruit.x = Math.random() * (canvas.width - 50);
    fruit.y = 0;
    fruit.emoji = fruits[Math.floor(Math.random() * fruits.length)];
}

// 遊戲主迴圈
function update() {
    if (gameOver) return; // 結束後停止迴圈

    // 清除畫布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 重新繪製背景（修正黑屏問題）
    drawBackground();

    // 水果下落
    fruit.y += fruit.speed;

    // 接到水果判定
    if (
        fruit.y + fruit.size >= basket.y &&
        fruit.y <= basket.y + basket.height && // 加上下邊界判定更精準
        fruit.x >= basket.x - 20 &&             // 微調緩衝寬度
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

    // 漏接判定
    if (fruit.y > canvas.height) {
        lives--;
        updateLives();

        resetFruit();

        if (lives <= 0) {
            gameOver = true;
            // 延遲跳出視窗，確保玩家能看到最後的畫面
            setTimeout(() => {
                alert("遊戲結束！分數：" + score);
            }, 50);
            return;
        }
    }

    // 繪製物件
    drawBasket();
    drawFruit();

    requestAnimationFrame(update);
}

// 初始化啟動
updateLives();
update();
