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

    //% blockId=solarai_version
    //% block="Solar AI 版本"
    //% group="狀態"
    //% weight=20
    export function getVersion(): string {
        return "0.2.0"
    }

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
