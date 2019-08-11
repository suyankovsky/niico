// 1フレームで何コメントを超えたら弾幕モードにするかの初期値
const threshold_danmaku_mode = 100

export default class {
    constructor(stage, is_always_danmaku_mode = false) {
        this.stage = stage

        //1フレームで何コメントを超えたら弾幕モードにするか
        this.threshold_danmaku_mode = threshold_danmaku_mode
    }

    isAlwaysDanmakuMode() {
        if (
            window.niico.$store.state.setting
            && window.niico.$store.state.setting.hasOwnProperty('is_always_danmaku_mode')
        ) {
            return window.niico.$store.state.setting.is_always_danmaku_mode
        }
        return false;
    }

    update() {
        const comment_count = this.stage.children
            .map(layer => layer.children.length)
            .reduce((amount, count) => amount + count);

        let value = false;
        if (comment_count > this.threshold_danmaku_mode || this.isAlwaysDanmakuMode()) {
            value = true;
        }

        this.stage.children.forEach(layer => {
            layer.children.forEach(c => {
                if (c.is_danmaku === false) return;
                c.is_danmaku = value;
            })
        })
    }
}
