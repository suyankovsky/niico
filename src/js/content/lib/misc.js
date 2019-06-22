import codes from 'js/content/map/log-code-map.js';
import FormatHelper from 'js/content/lib/format-helper.js';

export default class {
    static pushLog(code, detail) {
        // supplementを多重追加してしまうのでディープコピー
        const log = this.deepCopy(codes[code]);

        if(log) {
            log.detail = detail;
        } else {
            log.type = 'error';
            log.title = 'ログの出力に失敗しました。';
        }

        if(detail && detail.supplement) {
            log.title += detail.supplement;
        }

        window.niico.$store.dispatch('logs/push', log);
    }

    // オブジェクトのディープコピー
    static deepCopy(object) {
        return JSON.parse(JSON.stringify(object));
    }

    // ランダムな文字列を返す
    static generateRandomString(length = 32) {
        const str = "abcdefghijklmnopqrstuvwxyz0123456789";

        let result = '';

        for(let i = 0; i<length; i++) {
          result += str[Math.floor(Math.random() * str.length)];
        }
        return result;
    }

    // 現在有効な動画のvideo要素を返す
    static activeVideoElement() {
        const video_id = window.niico.$store.state.status.active_video_id;
        return document.getElementById(video_id);
    }

    // 現在有効な動画の再生時間を変更する
    static updateActiveVideoCurrentTime(t) {
        const video_el = this.activeVideoElement();
        if(!video_el) return false;

        const current_time = FormatHelper.convertPlayTimeToSeconds(t);
        if(!t) t = 0;
        video_el.currentTime = current_time;
    }
}
