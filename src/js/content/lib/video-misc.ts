import misc from 'js/content/lib/misc.ts';

export default class {
    static el(video_id) {
        const el = <HTMLVideoElement>document.getElementById(video_id);
        if (!el) {
            misc.pushLog('ERROR_GET_ELEMENT_BY_ID', {
                video_id,
            });
        }
        return el;
    }

    static doTogglePlay(video_id) {
        const el = this.el(video_id);
        if (!el) return;

        el.paused ? this.doPlay(video_id) : this.doPause(video_id);
    }

    static doPlay(video_id) {
        const el = this.el(video_id);
        if (!el) return;

        el.play();
    }

    static doPause(video_id) {
        const el = this.el(video_id);
        if (!el) return;

        el.pause();
    }

    static isPaused(video_id) {
        const el = this.el(video_id);
        if (!el) return;

        return el.paused;
    }
}
