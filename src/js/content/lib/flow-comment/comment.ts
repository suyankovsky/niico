import Createjs from 'createjs';
import Collision from 'js/content/lib/flow-comment/collision.ts';

// 各種定数
// フォント
const font_family = '"游ゴシック体", "Hiragino Kaku Gothic ProN",sans-serif';

// 文字の太さ
const font_weight = 'bold';

// 行高を1としたときの文字高比
const line_height_rate = 0.8;

// デフォルト文字高を1としたときの文字サイズコマンド対応比率
const size_rate_type = {
    'small': 0.8,
    'default': 1,
    'big': 1.2, // ギリギリ行高に達しない（0.96）
}

const shadow_style_for_black = "rgba(255, 255, 255, .8)";
const shadow_style_for_default = "rgba(0, 0, 0, .8)";

export default class extends Createjs.Container {
    constructor(c, video_id) {
        super();

        // Set Received Properties
        this.no = c.no;
        this.content = c.content;
        this.vpos = c.vpos;
        this.mail = c.mail;

        // Parse And Set Command Properties
        const command = this.parseMail();
        this.color = command.color;
        this.position = command.position;
        this.size_type = command.size_type;

        // Compute And Set In-Out Timing
        const timing = this.timing();
        this.intime = timing.intime;
        this.outtime = timing.outtime;

        this.text = new Createjs.Text(c.content, '', this.color);

        const shadow = this.color == 'black' ? shadow_style_for_black : shadow_style_for_default;
        this.shadow = new Createjs.Shadow(shadow, 0, 0, 10);

        this.addChild(this.text);

        // 再計算が省略できる箇所をキャッシュしておく場所
        this._cache = {
            tpos: undefined,
        }

        // コメントが弾幕モード対象かどうか
        // danmaku.js で更新される
        this.is_danmaku = undefined;

    }

    resetTiming() {
        const timing = this.timing();
        this.intime = timing.intime;
        this.outtime = timing.outtime;
    }

    // インスタンスが描画対象かどうか
    isFlushTarget(current_time) {
        return current_time > this.intime && current_time < this.outtime;
    }

    // 位置計算などを更新する
    update(current_time) {
        this.current_time = current_time;
        this.text.font = this.genFont();
        this.x = this.computeLeft();
        this.y = this.computeTop();

        this.scaleAdjust();
    }

    // 縦横比を保ったまま、画面幅に収める
    scaleAdjust() {
        if (this.position !== 'ue' && this.position !== 'shita') return;

        const bounds = this.getBounds();
        if (this.stage.w > bounds.width) return;

        const ratio = this.stage.w / bounds.width;
        const centerd_y = this.y + (bounds.height - bounds.height * ratio) / 2;
        this.setTransform(this.x, centerd_y, ratio, ratio);
    }

    // 何行目にインスタンスを描画するか計算する
    computeTpos() {
        if (this._cache.tpos !== undefined) return;
        const childs = this.parent.children; // これをラクにするためにLayerクラスを挟んでいる

        // _cache.tposが小さい順にソートする（重要）
        const setted = childs.filter(c => {
            return c._cache.tpos !== undefined && c.no !== this.no;
        }).sort((a, b) => {
            if (a._cache.tpos < b._cache.tpos) return -1;
            if (a._cache.tpos > b._cache.tpos) return 1;
            return 0;
        });

        // 行数を初期化
        let line_num = 0;

        if (this.position == 'shita') {
            line_num = 1;
        }

        if (this.position == 'shita' || this.position == 'ue') {
            setted.forEach(c => {
                if (c._cache.tpos == line_num) line_num++;
            });
        } else {
            // 描画対象のコメントを、_cache.tposが小さい順に当たり判定して、何行目に描画するか決める
            setted.forEach(c => {
                // 同じ行でない場合はどうやっても衝突しないのでスキップ
                if (c._cache.tpos !== line_num) return;

                if (Collision.isCollisionComments(c.parallelogram(), this.parallelogram())) {
                    line_num += 1;
                }
            });
        }
        this._cache.tpos = line_num;
    }

    getMaxLineNum() {
        if (
            window.niico.$store.state.setting
            && window.niico.$store.state.setting.hasOwnProperty('comment_max_line_num')
        ) {
            return parseInt(window.niico.$store.state.setting.comment_max_line_num);
        }
        return 11;
    }

    // コメントアニメーションの長さ
    // コメントした再生時間を起点とし、前後に足されるため2倍した数値が表示秒数
    getFlowDurationSeconds() {
        let computed = 0;

        if (
            window.niico.$store.state.setting
            && window.niico.$store.state.setting.hasOwnProperty('flow_duration_seconds')
        ) {
            computed = (4 * window.niico.$store.state.setting.flow_duration_seconds);
        }

        if (computed >= 1) {
            return parseInt(computed);
        }

        // 0<computed<1を満たすときに計算がなんかヘンになるので1にする
        if (computed > 0) {
            return 1;
        }

        return 4;
    }

    // インスタンスのy座標を計算する
    computeTop() {
        this.computeTpos();

        const line_height = this.stage.h / this.getMaxLineNum()

        let top = 0;
        if (this.position === 'shita') {
            top = this.stage.h - line_height * this._cache.tpos;
        } else if (this._cache.tpos > this.getMaxLineNum() && this.is_danmaku) {
            // どうやっても収まらないコメントが出てくる
            // そういう場合は0.5行足して間にねじ込む
            top = line_height * (this._cache.tpos % (this.getMaxLineNum() - 1) + 0.5);
        } else {
            top = line_height * this._cache.tpos;
        }
        this._cache.top = top;
        return top;
    }

    // インスタンスのx座標を計算する
    computeLeft() {
        const x = this.text.getMeasuredWidth();
        const w = this.stage.w;
        const d = this.getFlowDurationSeconds()
        const t = this.current_time - this.vpos;

        if (this.position) {
            // 位置コマンドがある場合、中央に配置
            return w > x ? (w - x) / 2 : 0;
        }

        return -(w + x) / d * t + (w - 2 * x) / 2;
    }

    // 文字サイズや書体などのスタイルを返す
    // 文字サイズがプレイヤーサイズに応じて都度変わる可能性があるため都度計算する
    genFont() {
        const stage_h = this.stage.h || 360;

        const size_rate = size_rate_type.hasOwnProperty(this.size_type) ? size_rate_type[this.size_type] : 1;

        this.line_height = stage_h / this.getMaxLineNum();
        this.font_size = this.line_height * line_height_rate * size_rate;

        return `${font_weight} ${this.font_size}px/${this.line_height}px ${font_family}`;
    }

    // アニメーションの開始/終了時間を返す
    timing() {
        const flow_duration_seconds = this.getFlowDurationSeconds();
        let intime = this.vpos - flow_duration_seconds;
        let outtime = this.vpos + flow_duration_seconds;

        if (this.position !== null) {
            intime = this.vpos;
            outtime = this.vpos + 3;
        }

        return {
            intime,
            outtime,
        }
    }

    // コマンドをパースする
    parseMail() {
        const command = String(this.mail);

        const _color = command.match(/white|red|pink|orange|yellow|green|cyan|blue|purple|black/);
        const color = _color ? _color[0] : 'white';

        const _position = command.match(/ue|shita/);
        const position = _position ? _position[0] : null;

        const size_type = command.match(/midium|small|big/);

        return {
            color,
            position,
            size_type,
        }
    }

    // 当たり判定計算のための平行四辺形の座標を返す
    parallelogram() {
        const x = this.text.getMeasuredWidth();
        const w = this.stage.w;

        return [
            {
                x: w,
                y: this.intime,
            },
            {
                x: w + x,
                y: this.intime,
            },
            {
                x: -x,
                y: this.outtime,
            },
            {
                x: 0,
                y: this.outtime,
            }
        ];
    }

    // xがゼロになる再生時間を計算する
    computeLeftEndTime() {
        const x = this.text.getMeasuredWidth();
        const w = this.stage.w;
        const d = this.getFlowDurationSeconds();
        const t = this.current_time - this.vpos;

        let time = 0;
        if (!this.position) {
            time = (w - 2 * x) / 2 * d / (w + x) + this.vpos;
        }

        return time;
    }
}
