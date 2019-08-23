import ajaxApi from 'js/content/lib/ajax/ajax-api';
import load_status_map from 'js/content/map/load-status.ts';
import { VideoStoreState, VideoStatus, VideoError } from 'js/content/interface/Video';
import misc from 'js/content/lib/misc.ts';
import $ from 'jquery';
import { ActionTree } from 'vuex';


const actions: ActionTree<VideoStoreState, any> = {

    // 動画を再読み込み
    reLoadVideo: ({ commit, dispatch }, video_id) => {
        commit('reInitializeVideoOnReLoadStarted', { video_id });
        dispatch('addVideo', video_id);
    },

    // 動画を読み込み
    addVideo: ({ commit, state, dispatch, getters }, video_id) => {
        const has_video = state.videos.find(item => item.id === video_id);
        if (has_video) {
            const video = has_video;

            // リロード時以外はタブをアクティブにしてreturn
            if (video.status !== VideoStatus.AjaxReLoadStarted) {
                commit('uncloseVideo', { video_id });
                commit('status/activateVideo', video_id, { root: true });
                return;
            }
        }

        commit('initializeVideoOnLoadStarted', video_id);

        // niicoウィンドウをとりあえず起動するため、初回のみすぐにactivateVideoする
        const is_first_video = state.videos.length === 0;
        if (is_first_video) {
            commit('status/activateVideo', video_id, { root: true });
        }

        ajaxApi.getVideoDetail(video_id).then(
            res => {
                const api_data_raw = $(res).filter('#js-initial-watch-data').attr('data-api-data');

                // JSON.parseは空文字だと失敗する
                if (!api_data_raw) {
                    commit('onErrorNoWatchApiData', { video_id, res });
                    return;
                }

                const api_data = JSON.parse(api_data_raw);
                commit('parseWatchApiData', {
                    video_id,
                    api_data,
                });

                const video = state.videos.find(item => item.id === video_id);
                if (!video || !video.content) return;

                commit('status/setUserId', api_data.viewer.id, { root: true });
                commit('status/activateVideo', video_id, { root: true });
                dispatch('viewerMylist/getViewerMylistgroup', video.content.thread.thread_ids.use, { root: true });
            },
            error => {
                commit('onErrorFailAjaxr', {
                    video_id,
                    detail: error,
                });
            }
        )
    },

    // 動画を閉じ、次の動画をアクティブにする
    closeVideo: ({ commit, getters, rootState }, video_id) => {
        if (video_id === rootState.status.active_video_id) {
            if (getters.next_video_id) {
                commit('status/activateVideo', getters.next_video_id, { root: true });
            }
            if (!getters.not_closed_video_ids || getters.not_closed_video_ids.length < 2) {
                commit('status/closeWindow', null, { root: true });
            }
        }
        commit('closeVideo', { video_id });
    },
}

export default actions;
