// 測試：訓練 AI 判斷「輻射值是否夠高（>= 500）」
SolarAI.resetAI()

let samples = [100, 300, 700, 900, 200, 800, 450, 550]
let answers = [0, 0, 1, 1, 0, 1, 0, 1]

for (let i = 0; i < samples.length; i++) {
    SolarAI.addTrainingData(samples[i], answers[i])
}

SolarAI.trainAll(1000)

game.splash("正確率 " + SolarAI.getAccuracy() + "%")
game.splash("門檻 " + SolarAI.getThreshold())
game.splash("訓練輪數 " + SolarAI.getEpochsUsed())

// 預測新資料
game.splash("350 -> " + SolarAI.predictAI(350))
game.splash("850 -> " + SolarAI.predictAI(850))
