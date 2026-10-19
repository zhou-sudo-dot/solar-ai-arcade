// 太陽能板充電訓練師 (Solar AI Trainer)
// 使用前：在 MakeCode Arcade 專案加入擴充功能
// https://github.com/zhou-sudo-dot/solar-ai-arcade
//
// 玩法：
// 1. 訓練階段：畫面出現輻射值，你當老師，按 A（充電）或 B（不充電）
//    遊戲會告訴你對不對，但「真正的門檻」是隱藏的，要靠回饋自己推測
// 2. AI 用你的答案學習
// 3. 測試階段：AI 自己判斷 10 筆新資料，看它學得好不好

const ROUNDS = 10

let phase = 0 // 0 標題, 1 訓練, 2 測試, 3 結果
let round = 0
let radiation = 0
let trueThreshold = 500
let teacherCorrect = 0
let aiCorrect = 0
let aiGuess = 0
let truth = 0
let feedback = ""
let feedbackColor = 1
let busy = false

function labelText(v: number): string {
    return v == 1 ? "CHARGE" : "SKIP"
}

function trueLabel(r: number): number {
    return r >= trueThreshold ? 1 : 0
}

function center(target: Image, text: string, y: number, color: number) {
    target.print(text, 80 - text.length * 3, y, color)
}

function startGame() {
    SolarAI.resetAI()
    trueThreshold = randint(350, 650)
    teacherCorrect = 0
    aiCorrect = 0
    round = 1
    radiation = randint(0, 1000)
    feedback = ""
    busy = false
    phase = 1
}

function runTest() {
    feedback = "AI is learning..."
    feedbackColor = 5
    phase = 2
    round = 0
    pause(800)
    SolarAI.trainAll(1000)
    for (let i = 1; i <= ROUNDS; i++) {
        round = i
        radiation = randint(0, 1000)
        aiGuess = SolarAI.predictAI(radiation)
        truth = trueLabel(radiation)
        if (aiGuess == truth) {
            aiCorrect += 1
            feedback = "AI is RIGHT"
            feedbackColor = 7
        } else {
            feedback = "AI is WRONG"
            feedbackColor = 2
        }
        pause(1300)
    }
    phase = 3
    busy = false
}

function answer(label: number) {
    if (phase != 1 || busy) return
    busy = true
    let correctLabel = trueLabel(radiation)
    SolarAI.addTrainingData(radiation, label)
    if (label == correctLabel) {
        teacherCorrect += 1
        feedback = "RIGHT!"
        feedbackColor = 7
    } else {
        feedback = "WRONG: should " + labelText(correctLabel)
        feedbackColor = 2
    }
    pause(900)
    if (round >= ROUNDS) {
        runTest()
    } else {
        round += 1
        radiation = randint(0, 1000)
        feedback = ""
        busy = false
    }
}

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (phase == 0 || phase == 3) {
        startGame()
    } else {
        answer(1)
    }
})

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    answer(0)
})

scene.setBackgroundColor(15)

scene.createRenderable(0, (target, camera) => {
    if (phase == 0) {
        center(target, "SOLAR AI TRAINER", 18, 5)
        center(target, "Teach the AI when to", 42, 1)
        center(target, "charge a solar panel", 52, 1)
        center(target, "A = CHARGE   B = SKIP", 72, 9)
        center(target, "Press A to start", 96, 7)
        return
    }

    if (phase == 3) {
        let t = SolarAI.getThreshold()
        center(target, "RESULT", 8, 5)
        center(target, "You: " + teacherCorrect + "/" + ROUNDS + " correct", 28, 1)
        center(target, "AI: " + aiCorrect + "/" + ROUNDS + " correct", 40, 1)
        center(target, "AI learned: " + (t < 0 ? "?" : "" + t), 56, 9)
        center(target, "True threshold: " + trueThreshold, 68, 9)
        if (aiCorrect >= 9) {
            center(target, "SOLAR MASTER!", 86, 5)
        } else if (aiCorrect >= 7) {
            center(target, "GOOD TEACHER", 86, 7)
        } else {
            center(target, "KEEP TRAINING", 86, 2)
        }
        center(target, "Press A to replay", 106, 7)
        return
    }

    // 訓練 / 測試畫面
    if (phase == 1) {
        center(target, "TRAIN " + round + "/" + ROUNDS, 4, 5)
    } else if (round > 0) {
        center(target, "AI TEST " + round + "/" + ROUNDS, 4, 5)
    }

    if (phase == 2 && round == 0) {
        center(target, feedback, 56, feedbackColor)
        return
    }

    // 太陽：輻射越高越大
    target.fillCircle(80, 34, 6 + Math.idiv(radiation, 50), 5)
    // 輻射條
    target.drawRect(10, 66, 140, 8, 1)
    target.fillRect(11, 67, Math.idiv(radiation * 138, 1000), 6, 5)
    center(target, "Radiation: " + radiation, 78, 1)

    if (phase == 1) {
        center(target, feedback, 92, feedbackColor)
        center(target, "A:CHARGE   B:SKIP", 108, 9)
    } else {
        center(target, "AI says: " + labelText(aiGuess), 88, 9)
        center(target, "Truth: " + labelText(truth), 98, 1)
        center(target, feedback, 110, feedbackColor)
    }
})
