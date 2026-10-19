enum Label {
    //% block="充電"
    Charge = 1,
    //% block="不充電"
    Skip = 0
}

enum Phase {
    //% block="標題"
    Title = 0,
    //% block="訓練"
    Training = 1,
    //% block="測試"
    Testing = 2,
    //% block="結果"
    Result = 3
}

/**
 * 遊戲流程積木
 */
//% weight=90 color=#4B7BEC icon="\uf11b" block="太陽能遊戲"
//% groups='["遊戲流程","遊戲資料"]'
namespace SolarGame {
    const ROUNDS = 10
    let phase = 0
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

    function center(target: Image, text: string, y: number, color: number) {
        target.print(text, 80 - text.length * 3, y, color)
    }

    //% block="開始新遊戲"
    //% group="遊戲流程" weight=100
    export function startGame() {
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

    //% block="老師回答 %label"
    //% group="遊戲流程" weight=90
    export function teacherAnswer(label: Label) {
        if (phase != 1 || busy) return
        busy = true
        let correct = trueLabel(radiation)
        SolarAI.addTrainingData(radiation, label)
        if (label == correct) {
            teacherCorrect += 1
            feedback = "RIGHT!"
            feedbackColor = 7
        } else {
            feedback = "WRONG: should " + (correct == 1 ? "CHARGE" : "SKIP")
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

    //% block="開始 AI 測試"
    //% group="遊戲流程" weight=80
    export function runTest() {
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

    //% block="現在是 %p 階段"
    //% group="遊戲流程" weight=70
    export function isPhase(p: Phase): boolean {
        return phase == p
    }

    //% block="正確答案 輻射 %r"
    //% group="遊戲資料" weight=60
    export function trueLabel(r: number): number {
        return r >= trueThreshold ? 1 : 0
    }

    //% block="目前輻射值"
    //% group="遊戲資料" weight=50
    export function currentRadiation(): number {
        return radiation
    }

    //% block="老師答對幾題"
    //% group="遊戲資料" weight=40
    export function teacherScore(): number {
        return teacherCorrect
    }

    //% block="AI 答對幾題"
    //% group="遊戲資料" weight=30
    export function aiScore(): number {
        return aiCorrect
    }

    //% block="顯示遊戲畫面"
    //% group="遊戲流程" weight=95
    export function showScreen() {
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
                if (aiCorrect >= 9) center(target, "SOLAR MASTER!", 86, 5)
                else if (aiCorrect >= 7) center(target, "GOOD TEACHER", 86, 7)
                else center(target, "KEEP TRAINING", 86, 2)
                center(target, "Press A to replay", 106, 7)
                return
            }
            if (phase == 1) {
                center(target, "TRAIN " + round + "/" + ROUNDS, 4, 5)
            } else if (round > 0) {
                center(target, "AI TEST " + round + "/" + ROUNDS, 4, 5)
            }
            if (phase == 2 && round == 0) {
                center(target, feedback, 56, feedbackColor)
                return
            }
            target.fillCircle(80, 34, 6 + Math.idiv(radiation, 50), 5)
            target.drawRect(10, 66, 140, 8, 1)
            target.fillRect(11, 67, Math.idiv(radiation * 138, 1000), 6, 5)
            center(target, "Radiation: " + radiation, 78, 1)
            if (phase == 1) {
                center(target, feedback, 92, feedbackColor)
                center(target, "A:CHARGE   B:SKIP", 108, 9)
            } else {
                center(target, "AI says: " + (aiGuess == 1 ? "CHARGE" : "SKIP"), 88, 9)
                center(target, "Truth: " + (truth == 1 ? "CHARGE" : "SKIP"), 98, 1)
                center(target, feedback, 110, feedbackColor)
            }
        })
    }
}
