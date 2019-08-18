import misc from 'js/content/lib/misc.ts';
import do_on_ended_map from 'js/content/map/do_on_ended.ts';
import { VideoItem, VideoStoreState, VideoStatus, VideoError } from 'js/content/interface/Video';

export default {
    onError({ commit }, error) {
        //commit("videos/onError", { video_id, error });
        const video_id = error.target.id;

        commit('onMediaErrorEvent', {
            video_id,
            error: error.target.error,
        });
        misc.pushLog('ERROR_MEDIA_EVENT', {
            video_id,
            error_code: error.target.error.code,
        });
    },
    onTimeUpdate: ({ commit, rootState }) => {
        const video_id = rootState.status.active_video_id;
        const el = misc.getVideoEl(video_id);
        if (!el) return;

        const current_time = el.currentTime;
        const duration = el.duration;
        const bf = el.buffered;
        const ranges: Object[] = [];

        if (!current_time || !duration || !bf || !bf.length) return;

        for (let i = 0; i < bf.length; i++) {
            const start = bf.start(i);
            const end = bf.end(i);
            const left = start ? (start / duration * 100) : 0;
            const width = ((end - start) / duration * 100);
            ranges.push({
                left,
                width,
            });
        }

        commit('setRanges', {
            video_id,
            ranges,
        });
        commit('setCurrentTime', video_id);
    },
    onEnded: ({ commit, rootState, getters }, video_id) => {
        const do_on_ended = rootState.setting.do_on_ended;

        if (do_on_ended == 'none') return;

        const el = misc.getVideoEl(video_id);
        if (!el) return;

        el.currentTime = 0;

        if (do_on_ended == 'is_next_video' && getters.next_video_id) {
            commit('status/activateVideo', getters.next_video_id, { root: true });
            return;
        }

        el.play();
    },
}
