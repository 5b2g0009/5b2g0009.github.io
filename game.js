const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let score = 0;

// 籃子
const basket = {
    x: 200,
    y: 540,
    width: 100,
    height: 30,
    speed: 20
};

// 水果
let fruit = {
    x: Math.random() * 450,
    y: 0,
    size: 30,
    speed: 4
};

document.addEventListener("keydown", moveBasket);

function moveBasket(e){
    if(e.key === "ArrowLeft"){
        basket.x -= basket.speed;
    }

    if(e.key === "ArrowRight"){
        basket.x += basket.speed;
    }
}

function drawBasket(){
    ctx.fillStyle = "brown";
    ctx.fillRect(
        basket.x,
        basket.y,
        basket.width,
        basket.height
    );
}

function drawFruit(){
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(
        fruit.x,
        fruit.y,
        fruit.size/2,
        0,
        Math.PI*2
    );
    ctx.fill();
}

function update(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    fruit.y += fruit.speed;

    // 接到水果
    if(
        fruit.y + fruit.size >= basket.y &&
        fruit.x >= basket.x &&
        fruit.x <= basket.x + basket.width
    ){

        score++;

        document.getElementById("score")
        .textContent = score;

        fruit.x = Math.random() * 450;
        fruit.y = 0;
    }

    // 掉到底部
    if(fruit.y > canvas.height){

        fruit.x = Math.random() * 450;
        fruit.y = 0;
    }

    let time = 60;

    let lives = 3;

    ["🍎","🍌","🍇","🍓"]

    fruit.speed += 1;


    drawBasket();
    drawFruit();

    requestAnimationFrame(update);
}

update();