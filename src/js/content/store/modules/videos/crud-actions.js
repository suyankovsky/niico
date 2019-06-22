import ajaxApi from 'js/content/lib/ajax-api.js';
import load_status_map from 'js/content/map/load-status.js';

export default {
    addVideo: ({commit, state, dispatch, getters}, video_id) => {
        const has_video = state.items.hasOwnProperty(video_id);
        if(has_video) {
            const video = state.items[video_id];

            // fetchの場合はここを抜ける必要があるのでステータスを見てあげる
            if(video.ajax_load_status === load_status_map.ajax_video.success) {
                commit('uncloseVideo', {video_id});
                commit('status/activateVideo', video_id, { root: true });
                return;
            }
        }

        commit('initializeVideo', { video_id: video_id});

        // niicoウィンドウをとりあえず起動するため、初回のみすぐにactivateVideoする
        const is_first_video = Object.keys(state.items).length == 0;
        if(is_first_video) {
            commit('status/activateVideo', video_id, { root: true });
        }

        ajaxApi.getVideoDetail(video_id).then(
            res => {
                if(!res.html) {
                    commit('loadErrorVideo', {video_id, error: 'UNKNOWN_ERR'})
                    return;
                }

                if(!res.api_data) {
                    // 流石にヒドイ判定
                    // そしてこの２つの判定の差が意味不明
                    let is_need_join_channel = false;
                    is_need_join_channel = String(res.html).indexOf('チャンネル会員専用動画') > 0 ? true : false;
                    is_need_join_channel = String(res.html).indexOf('チャンネル月額会員ならずっと見放題です') > 0 ? true : false;

                    if(is_need_join_channel) {
                        commit('loadErrorIsNeedJoinChannelVideo', {video_id});
                        return;
                    } else {
                        commit('loadErrorVideo', {video_id, error: 'UNKNOWN_ERR'})
                        return;
                    }
                }

                commit('loadSuccessVideo', {
                    video_id,
                    data: res.api_data,
                });
                commit('status/activateVideo', video_id, { root: true });
                dispatch('viewerMylist/getViewerMylistgroup', state.items[video_id].use_thread_id, {root: true});
            },
            error => {
                console.log(error);
                commit('loadErrorVideo', {video_id, error});
            }
        )
    },
    closeVideo: ({commit, state, getters, rootState}, video_id) => {
        if(video_id === rootState.status.active_video_id) {
            if(getters.next_video_id) {
                commit('status/activateVideo', getters.next_video_id, { root: true });
            }
            if(!getters.not_closed_video_ids || getters.not_closed_video_ids.length < 2) {
                commit('status/closeWindow', null, { root: true });
            }
        }
        commit('closeVideo', {video_id});
    },
    fetchVideo: ({commit, dispatch, rootState}, video_id) => {
        if(!video_id) {
            video_id = rootState.status.activve_video_id;
        }
        commit('initializeVideo', { video_id: video_id});
        dispatch('addVideo', video_id);
    }
}
