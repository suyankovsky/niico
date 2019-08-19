import misc from 'js/content/lib/misc.ts';
import do_on_ended_map from 'js/content/map/do_on_ended.ts';
import { VideoItem, VideoStoreState, VideoStatus, VideoError, VideoBufferRange } from 'js/content/interface/Video';

export default {
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
