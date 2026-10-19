//% color=#FF8000 weight=100 icon="\uf185" block="Solar AI"
namespace SolarAI {
    let weight = 0
    let bias = 0
    let learningRate = 0.2
    let trainCount = 0
    let lastPrediction = 0
    let lastError = 0
    let lastEpochsUsed = 0

    // 訓練資料集（已正規化前的原始輻射值）
    let dataRadiation: number[] = []
    let dataLabel: number[] = []

    // ---------- 內部工具 ----------

    function normalize(radiation: number): number {
        return Math.max(0, Math.min(1000, radiation)) / 1000
    }

    function predictNormalized(x: number): number {
        return weight * x + bias > 0 ? 1 : 0
    }

    // 訓練一筆資料，回傳這筆是否預測錯誤
    function trainStep(radiation: number, label: number): boolean {
        let x = normalize(radiation)
        let y = label >= 1 ? 1 : 0

        lastPrediction = predictNormalized(x)
        lastError = y - lastPrediction

        if (lastError != 0) {
            weight += learningRate * lastError * x
            bias += learningRate * lastError
        }

        trainCount += 1
        return lastError != 0
    }

    // ---------- 基本訓練 ----------

    //% blockId=solarai_reset
    //% block="重設 AI"
    //% group="訓練"
    //% weight=100
    export function resetAI(): void {
        weight = 0
        bias = 0
        trainCount = 0
        lastPrediction = 0
        lastError = 0
        lastEpochsUsed = 0
        dataRadiation = []
        dataLabel = []
    }

    //% blockId=solarai_train
    //% block="訓練 AI 輻射值 %radiation 正確答案 %label"
    //% radiation.min=0 radiation.max=1000 radiation.defl=500
    //% label.min=0 label.max=1 label.defl=1
    //% group="訓練"
    //% weight=90
    export function trainAI(radiation: number, label: number): void {
        trainStep(radiation, label)
    }

    // ---------- 資料集訓練（自動跑多輪）----------

    //% blockId=solarai_add_data
    //% block="加入訓練資料 輻射值 %radiation 正確答案 %label"
    //% radiation.min=0 radiation.max=1000 radiation.defl=500
    //% label.min=0 label.max=1 label.defl=1
    //% group="資料集"
    //% weight=85
    export function addTrainingData(radiation: number, label: number): void {
        dataRadiation.push(radiation)
        dataLabel.push(label >= 1 ? 1 : 0)
    }

    //% blockId=solarai_clear_data
    //% block="清除訓練資料"
    //% group="資料集"
    //% weight=84
    export function clearTrainingData(): void {
        dataRadiation = []
        dataLabel = []
    }

    //% blockId=solarai_train_all
    //% block="用資料集訓練 AI 最多 %epochs 輪"
    //% epochs.min=1 epochs.max=1000 epochs.defl=100
    //% group="資料集"
    //% weight=83
    export function trainAll(epochs: number): void {
        lastEpochsUsed = 0
        if (dataRadiation.length == 0) return

        for (let e = 0; e < epochs; e++) {
            let errors = 0
            for (let i = 0; i < dataRadiation.length; i++) {
                if (trainStep(dataRadiation[i], dataLabel[i])) {
                    errors += 1
                }
            }
            lastEpochsUsed = e + 1
            // 整輪都沒有錯，代表已收斂，提早結束
            if (errors == 0) break
        }
    }

    //% blockId=solarai_accuracy
    //% block="AI 在資料集上的正確率 (%)"
    //% group="資料集"
    //% weight=82
    export function getAccuracy(): number {
        if (dataRadiation.length == 0) return 0
        let correct = 0
        for (let i = 0; i < dataRadiation.length; i++) {
            if (predictNormalized(normalize(dataRadiation[i])) == dataLabel[i]) {
                correct += 1
            }
        }
        return Math.round(correct * 100 / dataRadiation.length)
    }

    //% blockId=solarai_epochs_used
    //% block="上次實際訓練輪數"
    //% group="資料集"
    //% weight=81
    export function getEpochsUsed(): number {
        return lastEpochsUsed
    }

    // ---------- 預測 ----------

    //% blockId=solarai_predict
    //% block="AI 預測輻射值 %radiation"
    //% radiation.min=0 radiation.max=1000 radiation.defl=500
    //% group="預測"
    //% weight=80
    export function predictAI(radiation: number): number {
        return predictNormalized(normalize(radiation))
    }

    //% blockId=solarai_threshold
    //% block="AI 學到的門檻值"
    //% group="預測"
    //% weight=75
    export function getThreshold(): number {
        // 權重為 0 代表還沒學到東西
        if (weight == 0) return -1
        return Math.round(-bias / weight * 1000)
    }

    // ---------- 狀態查詢 ----------

    //% blockId=solarai_last_prediction
    //% block="取得上次預測"
    //% group="狀態"
    //% weight=70
    export function getLastPrediction(): number {
        return lastPrediction
    }

    //% blockId=solarai_last_error
    //% block="取得上次錯誤值"
    //% group="狀態"
    //% weight=60
    export function getLastError(): number {
        return lastError
    }

    //% blockId=solarai_train_count
    //% block="取得訓練次數"
    //% group="狀態"
    //% weight=50
    export function getTrainCount(): number {
        return trainCount
    }

    //% blockId=solarai_weight
    //% block="取得 AI 權重"
    //% group="狀態"
    //% weight=40
    export function getWeight(): number {
        return weight
    }

    //% blockId=solarai_bias
    //% block="取得 AI 偏差值"
    //% group="狀態"
    //% weight=30
    export function getBias(): number {
        return bias
    }
}
