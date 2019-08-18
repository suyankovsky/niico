import misc from 'js/content/lib/misc.ts';
import do_on_ended_map from 'js/content/map/do_on_ended.ts';
import { VideoItem, VideoStoreState, VideoStatus, VideoError } from 'js/content/interface/Video';

export default {
    doTogglePlay({ commit, dispatch }, { video_id }: { video_id: string }) {
        const el = misc.getVideoEl(video_id);
        if (!el) return;

        el.paused ? dispatch("doPlay", { video_id }) : dispatch("doPause", { video_id });
    },
    doPlay({ commit, rootState, state }, { video_id }: { video_id: string }) {
        // if (rootState.status.active_video_id !== video_id) return;

        const el = misc.getVideoEl(video_id);
        const video = misc.getVideoItem(video_id);
        console.log(el, video);
        if (!el || !video || !video.content) return;

        if (video.content.current_time) {
            el.currentTime = video.content.current_time;
        }
        el.play();
    },
    doPause({ commit, rootState, state }, { video_id }: { video_id: string }) {
        const el = misc.getVideoEl(video_id);
        if (!el) return;

        el.pause();
    },
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
    onLoadedmetadata: ({ commit, rootGetters, dispatch }, video_id) => {
        const el = misc.getVideoEl(video_id);
        if (!el) return;

        commit('setDuration', {
            video_id,
            duration: el.duration || 0,
        });
        commit('onLoadedmetadata', {
            video_id,
        });

        el.volume = rootGetters["setting/volume"] || 1;
        console.log('doplay')
        dispatch('doPlay', { video_id });
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
        commit('setCurrentTime', {
            video_id,
            current_time,
        });
    },
    onEnded: ({ commit, rootState, getters }) => {
        const do_on_ended = rootState.setting.do_on_ended;

        if (do_on_ended == 'none') return;

        const video_id = rootState.status.active_video_id;
        const video_el = misc.getVideoEl(video_id);
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
        const el = misc.getVideoEl(video_id);

        if (!el) return;

        commit('togglePlay', {
            video_id,
            is_paused: el.paused
        });
    },
    onPlay: ({ commit, rootState }) => {
        const video_id = rootState.status.active_video_id;
        const el = misc.getVideoEl(video_id);

        if (!el) return;


        commit('togglePlay', {
            video_id,
            is_paused: el.paused
        });
    },
    onPause: ({ commit, rootState }) => {
        const video_id = rootState.status.active_video_id;
        const el = <HTMLVideoElement>document.getElementById(video_id);

        if (!el) return;

        commit('togglePlay', {
            video_id,
            is_paused: el.paused
        });
    },
}
