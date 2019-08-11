import misc from 'js/content/lib/misc.ts';
import do_on_ended_map from 'js/content/map/do_on_ended.ts';

export default {
    onError: ({ commit }, error) => {
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
    onLoadedmetadata: ({ commit, rootState }, video_id) => {
        const el = document.getElementById(video_id);
        if (!el) return;

        commit('setDuration', {
            video_id,
            duration: el.duration || 0,
        });
        commit('doneLoadMetaData', {
            video_id,
        });
    },
    onTimeUpdate: ({ commit, rootState }) => {
        const video_id = rootState.status.active_video_id;
        const el = document.getElementById(video_id);
        if (!el) return;

        const current_time = el.currentTime;
        const duration = el.duration;
        const bf = el.buffered;
        const ranges = [];

        if (!current_time || !duration || !bf || !bf.length) return;

        for (let i = 0; i < bf.length; i++) {
            const start = bf.start(i);
            const end = bf.end(i);
            const left = start ? (start / duration * 100) : 0;
            const width = ((end - start) / duration * 100);
            ranges.push({
                left: left,
                width: width,
            });
        }

        commit('setRanges', {
            video_id,
            ranges,
        });
        commit('setCurrentTime', {
            video_id,
            current_time,
        });
    },
    onEnded: ({ commit, rootState, getters }) => {
        const do_on_ended = rootState.setting.do_on_ended;

        if (do_on_ended == 'none') return;

        const video_id = rootState.status.active_video_id;
        const video_el = document.getElementById(video_id);
        video_el.currentTime = 0;
        commit('setCurrentTime', {
            video_id,
            current_time: 0,
        });

        if (do_on_ended == 'is_next_video' && getters.next_video_id) {
            commit('status/activateVideo', getters.next_video_id, { root: true });
            return;
        }

        video_el.play();
    },
    onPlaying: ({ commit, rootState }) => {
        const video_id = rootState.status.active_video_id;
        const el = document.getElementById(video_id);

        if (!el) return;

        commit('togglePlay', {
            video_id,
            is_paused: el.paused
        });
    },
    onPlay: ({ commit, rootState }) => {
        const video_id = rootState.status.active_video_id;
        const el = document.getElementById(video_id);

        if (!el) return;


        commit('togglePlay', {
            video_id,
            is_paused: el.paused
        });
    },
    onPause: ({ commit, rootState }) => {
        const video_id = rootState.status.active_video_id;
        const el = document.getElementById(video_id);

        if (!el) return;

        commit('togglePlay', {
            video_id,
            is_paused: el.paused
        });
    },
}
