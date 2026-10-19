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
 * 遊戲畫面與隱藏答案。遊戲流程由小朋友用積木自己組出來。
 */
//% weight=90 color=#4B7BEC icon="\uf11b" block="太陽能遊戲"
//% groups='["畫面","回合","隱藏答案","分數"]'
namespace SolarGame {
    let phase = 0
    let round = 0
    let totalRounds = 10
    let radiation = 0
    let trueThreshold = 500
    let teacherScore = 0
    let aiScore = 0
    let aiGuess = 0
    let truth = 0
    let feedback = ""
    let feedbackColor = 1

    function center(target: Image, text: string, y: number, color: number) {
        target.print(text, 80 - text.length * 3, y, color)
    }

    // ---------- 畫面 ----------

    //% block="啟動遊戲畫面"
    //% group="畫面" weight=100
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
                center(target, "You: " + teacherScore + "/" + totalRounds + " correct", 28, 1)
                center(target, "AI: " + aiScore + "/" + totalRounds + " correct", 40, 1)
                center(target, "AI learned: " + (t < 0 ? "?" : "" + t), 56, 9)
                center(target, "True threshold: " + trueThreshold, 68, 9)
                if (aiScore >= 9) center(target, "SOLAR MASTER!", 86, 5)
                else if (aiScore >= 7) center(target, "GOOD TEACHER", 86, 7)
                else center(target, "KEEP TRAINING", 86, 2)
                center(target, "Press A to replay", 106, 7)
                return
            }
            if (phase == 1) {
                center(target, "TRAIN " + round + "/" + totalRounds, 4, 5)
            } else if (round > 0) {
                center(target, "AI TEST " + round + "/" + totalRounds, 4, 5)
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
                center(target, "AI says: " + labelText(aiGuess), 88, 9)
                center(target, "Truth: " + labelText(truth), 98, 1)
                center(target, feedback, 110, feedbackColor)
            }
        })
    }

    //% block="設定階段為 %p"
    //% group="畫面" weight=90
    export function setPhase(p: Phase) {
        phase = p
    }

    //% block="現在是 %p 階段"
    //% group="畫面" weight=89
    export function isPhase(p: Phase): boolean {
        return phase == p
    }

    //% block="畫面顯示輻射值 %value"
    //% group="畫面" weight=80
    export function setRadiation(value: number) {
        radiation = value
    }

    //% block="畫面提示 %text 顏色 %color"
    //% color.shadow="colorindexpicker" color.defl=1
    //% group="畫面" weight=70
    export function setFeedback(text: string, color: number) {
        feedback = text
        feedbackColor = color
    }

    //% block="畫面顯示 AI 說 %guess 正確答案 %answer"
    //% group="畫面" weight=60
    export function setAIResult(guess: number, answer: number) {
        aiGuess = guess
        truth = answer
    }

    // ---------- 回合 ----------

    //% block="畫面顯示第 %current 回合 共 %total 回合"
    //% group="回合" weight=100
    export function setRound(current: number, total: number) {
        round = current
        totalRounds = total
    }

    // ---------- 隱藏答案 ----------

    //% block="隨機決定隱藏門檻"
    //% group="隱藏答案" weight=100
    export function pickHiddenThreshold() {
        trueThreshold = randint(350, 650)
    }

    //% block="正確答案 輻射值 %r"
    //% group="隱藏答案" weight=90
    export function correctLabel(r: number): number {
        return r >= trueThreshold ? 1 : 0
    }

    //% block="%label 的文字"
    //% group="隱藏答案" weight=80
    export function labelText(label: number): string {
        return label == 1 ? "CHARGE" : "SKIP"
    }
    //% block="%label 的文字"
    //% group="隱藏答案" weight=80
    export function labelText(label: number): string {
        return label == 1 ? "CHARGE" : "SKIP"
    }

    //% block="標籤 %l"
    //% group="隱藏答案" weight=70
    export function labelValue(l: Label): number {
        return l
    }

    // ---------- 分數 ----------

    //% block="畫面顯示分數 老師 %teacher AI %ai"
    //% group="分數" weight=100
    export function setScores(teacher: number, ai: number) {
        teacherScore = teacher
        aiScore = ai
    }
}
