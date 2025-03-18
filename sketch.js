// ✅ 배경음악 설정 (Howler.js) → `index.html`에서만 실행
var bgMusic = new Howl({
    src: ["sounds/page1.mp3"], // 배경음악 파일
    loop: true, // 반복 재생
    volume: 0.3
});

// ✅ 시계(타이머) 효과음 설정 (Howler.js) → `oven.html`에서 타이머 시작 시 실행
var clockSound = new Howl({
    src: ["sounds/clock.mp3"], // 시계 소리 파일
    loop: true, // 타이머 동안 반복 재생
    volume: 0.5
});

// ✅ 타이머 종료 알림음 (벨 소리) 추가
var ringSound = new Howl({
    src: ["sounds/ring.mp3"], // 벨 소리 파일 (타이머 끝났을 때 재생)
    volume: 0.8
});

// ✅ 각 페이지마다 다른 설정 적용
document.addEventListener("DOMContentLoaded", function () {
    let textToShow = "";
    let gameTextElement = document.getElementById("gameText");

    // 현재 페이지 파일명 추출
    let page = window.location.pathname.split("/").pop() || "index.html";

    if (page === "index.html") {
        textToShow = "Good morning!<br>How about making some bread today?<br>Try clicking on the ingredients!";

        // ✅ `index.html`에서만 배경음악 실행 (페이지가 로드될 때)
        setTimeout(() => {
            if (!bgMusic.playing()) {
                bgMusic.play();
            }
        }, 500);

        // ✅ 사용자가 첫 클릭하면 배경음 실행 (일부 브라우저에서 필요)
        document.addEventListener("click", function () {
            if (!bgMusic.playing()) {
                bgMusic.play();
            }
        });

    } else if (page === "page2.html") {
        textToShow = "Put the ingredients into the bowl and make the dough!<br>Then, divide it into portions and get it ready for the oven.";

    } else if (page === "oven.html") {
        textToShow = "Now let's bake the bread!<br>Place it in the oven and wait.";
        setupOvenDragDrop(); // ✅ 오븐 드래그앤드롭 기능 설정

    } else if (page === "final.html") {
        textToShow = "Oh... it’s already night?";
    }

    // ✅ `gameText` 요소가 있는 경우에만 타자기 효과 실행
    if (gameTextElement && textToShow !== "") {
        gameTextElement.style.display = "block";
        typeWriterEffect(textToShow, "gameText", 80);
    }

    // ✅ Grain 효과 추가
    addGrainEffect();
});

// ✅ 빵을 오븐에 넣으면 타이머 시작하도록 설정
function setupOvenDragDrop() {
    let bread = document.getElementById("bread6");
    let oven = document.getElementById("oven");

    if (!bread || !oven) return;

    // ✅ 빵 드래그 시작
    bread.addEventListener("dragstart", function (event) {
        event.dataTransfer.setData("text", event.target.id);
    });

    // ✅ 오븐 위에서 드롭 가능
    oven.addEventListener("dragover", function (event) {
        event.preventDefault();
    });

    // ✅ 빵을 오븐에 드롭하면 타이머 시작
    oven.addEventListener("drop", function (event) {
        event.preventDefault();

        if (bread.src.includes("bread6.gif")) {
            oven.src = "oven2.gif"; // 오븐 문 열림
            bread.style.display = "none"; // 빵 사라짐

            // ✅ 1초 후 오븐 문 닫히면서 타이머 시작
            setTimeout(() => {
                oven.src = "oven3.gif"; // 오븐 닫힘
                startOvenTimer(); // 타이머 시작
            }, 1000);
        }
    });
}

// ✅ 타이머 시작 (oven.html에서만 실행, 사용자가 빵을 넣었을 때 실행됨)
function startOvenTimer() {
    let countdownElement = document.getElementById("countdown");
    let countdown = 30; // 30초 카운트다운

    if (!countdownElement) return;

    countdownElement.style.display = "block";
    countdownElement.innerText = countdown;

    // ✅ 타이머 시작 시 시계 소리 재생
    clockSound.play();

    let timer = setInterval(() => {
        countdown--;
        countdownElement.innerText = countdown;

        if (countdown <= 0) {
            clearInterval(timer);
            countdownElement.style.display = "none";

            // ✅ 타이머 끝나면 시계 소리 정지 + 벨 소리 재생
            clockSound.stop();
            ringSound.play(); // 🔥 타이머 끝나면 'ring.mp3' 재생!
        }
    }, 1000);
}

// ✅ 타자기 효과 적용 함수
function typeWriterEffect(text, elementId, speed, callback) {
    let i = 0;
    let targetElement = document.getElementById(elementId);

    if (!targetElement) return;

    targetElement.innerHTML = ""; // 기존 텍스트 비우기

    function type() {
        if (i < text.length) {
            if (text.substring(i, i + 4) === "<br>") {
                targetElement.innerHTML += "<br>";
                i += 4;
            } else {
                targetElement.innerHTML += text.charAt(i);
                i++;
            }
            setTimeout(type, speed);
        } else if (callback) {
            setTimeout(callback, 1000);
        }
    }
    type();
}

// ✅ Grain 효과를 추가하는 함수 (움직이지 않음)
function addGrainEffect() {
    let canvas = document.createElement("canvas");
    canvas.classList.add("grain-canvas");
    document.body.appendChild(canvas);

    let ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        generateNoise();
    }

    function generateNoise() {
        let imageData = ctx.createImageData(canvas.width, canvas.height);
        let pixels = imageData.data;

        for (let i = 0; i < pixels.length; i += 4) {
            let value = Math.random() * 200 + 50;
            pixels[i] = pixels[i + 1] = pixels[i + 2] = value;
            pixels[i + 3] = 60;
        }

        ctx.putImageData(imageData, 0, 0);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
}
