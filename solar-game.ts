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
 * 畫面與隱藏答案。遊戲流程由小朋友用積木自己組出來。
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

    // ---------- 中文字型（12x12 點陣，內建常用字） ----------

    const GLYPH_CHARS = "太陽能訓練師教什麼時候該幫板充電不按開始輻射值測試說正確答案結果你對學到的門檻真大好老繼續再玩一次了錯應習中分數很棒來束完成加油池光線強弱高低決定猜"
    const GLYPH_DATA = [
        "0000000400400407fe0600600a009018834c",
        "00000000073e53e60263c52053e55a5aa76a",
        "0000001102924dc0517d145e7d04567dc451",
        "000000442f4a04af4a04af4a04af4a94a94a",
        "00000021027e41057ef7627a57ef5a134bd2",
        "00000000023e7884884aa7aa42a7aa4ae788",
        "0000001107d0150ff40b47f46d4c8838848c",
        "0000001101103102106fea10210210210210",
        "0000003fe4887de59c5dc6aa4204c85f0448",
        "00000000870857f50857f50457f524714504",
        "00000000013e2022bf6a06be2c82bf288214",
        "000000610ffe010f24008f78014f2494891c",
        "000000004784fb4314fc82c83f82487fc444",
        "00000020027c24074027c764754658a582bc",
        "0000000400607ff0801083fc090090091311",
        "0000000001fe7ff5ad5fc1e01241fc1241fd",
        "0000000007fe0400400c01d834c646040040",
        "0000002102102fefa22203fe64824823823c",
        "00000000079e79e49279e5fa4927fe492492",
        "0000000002082107a62a650053e7223222a2",
        "00000000007e700f4497cf00b7e652ffe052",
        "0000000043c42443ff2443e42547d40c4144",
        "0000001101fe21027c644e7c24424427c244",
        "0000000006f22928f24920f22922f2092492",
        "00000040cf0a07ef08008f78028f28924967",
        "000000428f28044ffe044f4407cf28928968",
        "0000000007fe02002022023e220220220220",
        "000000000f104fe4a277ed48dfed4857e748",
        "0000001083ff3144a405018c7ff0001fc104",
        "0000000407fe4827fe1a00f8744ffe0e0358",
        "0000000003082084be50833e7806be0a26a2",
        "0000000003fc3fc2443fc040ffe0f015864c",
        "00000000012012027e244690a10254252292",
        "000000204ec47847fe4842847d41147c4104",
        "00000000066c7ec46476c4e69fa0307fe020",
        "000000000fe220a48afca10afca10a10a1c2",
        "0000000001102107b24a24e279248a482482",
        "00000000079e79e49279e402402402402402",
        "0000000002f42f82982f47a46a2600a7e24a",
        "0000000203fc1f81081081f81081f87fe188",
        "000000040040040ffe0400600a009011820c",
        "00000000020020678c28808857f508308388",
        "0000000800843fc0987fe0600803b86c0082",
        "0000000e04f64ee0f6ec94ff7e68fe6f6cdd",
        "0000000102fe41057eeaa27e544f7c144d7c",
        "0000000007fc0403f82483f8248ffe208208",
        "000000000f7c200200f282282282286490c9",
        "0000000000000000000007fe000000000000",
        "00000000006044027e056190290210228468",
        "0000000007fc018020040040040040040040",
        "0000000043047fe404f0420023c32273e322",
        "0000000203ff2a82a43ff3e42a42bf250543",
        "0000000007be09229239e6a23fc2043fc204",
        "0000000400407fc4444444447fc040040040",
        "0000000000880881042027fd044044084084",
        "00000000010055055e5547f456c10cfe828c",
        "00000000037c644d7c34427c652a5c248248",
        "00000021027e2107302fe728656efca7e210",
        "0000000407fe0482503587e44e01d0348e46",
        "0000000407fe0403fc2442443fc0e015064c",
        "0000000407fe4025fa0000007fe090090111",
        "00000001c0143ff2102123d42542482585f5",
        "0000001001007de15215215215225225225e",
        "0000000106100108fe4922922fe292492492",
        "00000001021005245e6f2152152256251641",
        "000000040044248348150ffe0a0120122222",
        "00000000022047c544e44214774d3c118f54",
        "000000000f2014417e41047e75217e110116",
        "000000000fbe79e7a27be48269a1866ba082",
        "0000000600001f81081f80004025fa50a5fa",
        "00000000010c1f0290690efe2902882882ae",
        "0000004202200fc8244240242fe230450448",
        "0000000607fe4024023fe02012033c3206e0",
        "00000001097c61067ca1027c64447ca4427c"
    ]
    let cacheKeys: string[] = []
    let cacheImgs: Image[] = []

    function hexVal(c: string): number {
        return "0123456789abcdef".indexOf(c)
    }

    function glyphImage(ch: string, color: number): Image {
        let key = ch + color
        let k = cacheKeys.indexOf(key)
        if (k >= 0) return cacheImgs[k]
        let idx = GLYPH_CHARS.indexOf(ch)
        if (idx < 0) return null
        let data = GLYPH_DATA[idx]
        let img = image.create(12, 12)
        for (let r = 0; r < 12; r++) {
            let v = hexVal(data.charAt(r * 3)) * 256 + hexVal(data.charAt(r * 3 + 1)) * 16 + hexVal(data.charAt(r * 3 + 2))
            for (let c = 0; c < 12; c++) {
                if ((v >> (11 - c)) & 1) img.setPixel(c, r, color)
            }
        }
        cacheKeys.push(key)
        cacheImgs.push(img)
        return img
    }

    function textWidth(text: string): number {
        let w = 0
        for (let i = 0; i < text.length; i++) {
            w += text.charCodeAt(i) < 128 ? 6 : 12
        }
        return w
    }

    function drawText(target: Image, text: string, x: number, y: number, color: number) {
        let cx = x
        for (let i = 0; i < text.length; i++) {
            let ch = text.charAt(i)
            if (text.charCodeAt(i) < 128) {
                target.print(ch, cx, y + 2, color)
                cx += 6
            } else {
                let g = glyphImage(ch, color)
                if (g) target.drawTransparentImage(g, cx, y)
                cx += 12
            }
        }
    }

    function center(target: Image, text: string, y: number, color: number) {
        drawText(target, text, Math.idiv(160 - textWidth(text), 2), y, color)
    }

    // ---------- 畫面 ----------

    //% block="啟動遊戲畫面"
    //% group="畫面" weight=100
    export function showScreen() {
        scene.setBackgroundColor(15)
        scene.createRenderable(0, (target, camera) => {
            if (phase == 0) {
                center(target, "太陽能AI訓練師", 14, 5)
                center(target, "教AI什麼時候", 38, 1)
                center(target, "該幫太陽能板充電", 52, 1)
                center(target, "A=充電  B=不充電", 76, 9)
                center(target, "按A開始", 98, 7)
                return
            }
            if (phase == 3) {
                let t = SolarAI.getThreshold()
                center(target, "結果", 4, 5)
                center(target, "你答對 " + teacherScore + "/" + totalRounds, 22, 1)
                center(target, "AI答對 " + aiScore + "/" + totalRounds, 36, 1)
                center(target, "AI學到的門檻:" + (t < 0 ? "?" : "" + t), 54, 9)
                center(target, "真正的門檻:" + trueThreshold, 68, 9)
                if (aiScore >= 9) center(target, "太陽能大師!", 86, 5)
                else if (aiScore >= 7) center(target, "好老師", 86, 7)
                else center(target, "繼續訓練", 86, 2)
                center(target, "按A再玩一次", 104, 7)
                return
            }
            if (phase == 1) {
                center(target, "訓練 " + round + "/" + totalRounds, 2, 5)
            } else if (round > 0) {
                center(target, "AI測試 " + round + "/" + totalRounds, 2, 5)
            }
            if (phase == 2 && round == 0) {
                center(target, feedback, 54, feedbackColor)
                return
            }
            target.fillCircle(80, 34, 6 + Math.idiv(radiation, 70), 5)
            target.drawRect(10, 58, 140, 8, 1)
            target.fillRect(11, 59, Math.idiv(radiation * 138, 1000), 6, 5)
            center(target, "輻射值:" + radiation, 68, 1)
            if (phase == 1) {
                center(target, feedback, 84, feedbackColor)
                center(target, "A:充電  B:不充電", 104, 9)
            } else {
                center(target, "AI說:" + labelText(aiGuess), 82, 9)
                center(target, "正確答案:" + labelText(truth), 94, 1)
                center(target, feedback, 106, feedbackColor)
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

    //% block="答案 %label"
    //% group="隱藏答案" weight=95
    export function labelValue(label: Label): number {
        return label
    }

    //% block="正確答案 輻射值 %r"
    //% group="隱藏答案" weight=90
    export function correctLabel(r: number): number {
        return r >= trueThreshold ? 1 : 0
    }

    //% block="%label 的文字"
    //% group="隱藏答案" weight=80
    export function labelText(label: number): string {
        return label == 1 ? "充電" : "不充電"
    }

    // ---------- 分數 ----------

    //% block="畫面顯示分數 老師 %teacher AI %ai"
    //% group="分數" weight=100
    export function setScores(teacher: number, ai: number) {
        teacherScore = teacher
        aiScore = ai
    }
}
