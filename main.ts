
namespace SolarAI {
    let weight = 0
    let bias = 0
    let learningRate = 0.2
    let trainCount = 0
    let lastPrediction = 0
    let lastError = 0

    function predictNormalized(x: number): number {
        return weight * x + bias >= 0 ? 1 : 0
    }

    //% block="重設 AI"
    //% weight=100
    export function resetAI(): void {
        weight = 0
        bias = 0
        trainCount = 0
        lastPrediction = 0
        lastError = 0
    }

    //% block="訓練 AI 輻射值 %radiation 正確答案 %label"
    //% radiation.min=0 radiation.max=1000
    //% label.min=0 label.max=1
    //% weight=90
    export function trainAI(radiation: number, label: number): void {
        let x = Math.max(0, Math.min(1000, radiation)) / 1000
        let y = label >= 1 ? 1 : 0

        lastPrediction = predictNormalized(x)
        lastError = y - lastPrediction

        if (lastError != 0) {
            weight += learningRate * lastError * x
            bias += learningRate * lastError
        }

        trainCount += 1
    }

    //% block="AI 預測輻射值 %radiation"
    //% radiation.min=0 radiation.max=1000
    //% weight=80
    export function predictAI(radiation: number): number {
        let x = Math.max(0, Math.min(1000, radiation)) / 1000
        return predictNormalized(x)
    }

    //% block="取得上次預測"
    //% weight=70
    export function getLastPrediction(): number {
        return lastPrediction
    }

    //% block="取得上次錯誤值"
    //% weight=60
    export function getLastError(): number {
        return lastError
    }

    //% block="取得訓練次數"
    //% weight=50
    export function getTrainCount(): number {
        return trainCount
    }

    //% block="取得 AI 權重"
    //% weight=40
    export function getWeight(): number {
        return weight
    }

    //% block="取得 AI 偏差值"
    //% weight=30
    export function getBias(): number {
        return bias
    }
}
