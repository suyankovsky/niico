import ajaxApi from 'js/content/lib/ajax-api.ts';
import load_status_map from 'js/content/map/load-status.ts';
import { VideoActionContext, VideoStoreState, VideoStatus } from 'js/content/store/modules/videos/interface.ts';

export default {
    addVideo: ({ commit, state, dispatch, getters }: VideoActionContext, video_id) => {
        const has_video = state.videos.find(item => item.id === video_id);
        if (has_video) {
            const video = has_video;

            // fetchの場合はここを抜ける必要があるのでステータスを見てあげる
            if (video.status === VideoStatus.AjaxReLoadStarted) {
                commit('uncloseVideo', { video_id });
                commit('status/activateVideo', video_id, { root: true });
                return;
            }
        }

        commit('addVideo', video_id);

        // niicoウィンドウをとりあえず起動するため、初回のみすぐにactivateVideoする
        const is_first_video = state.videos.length === 0;
        if (is_first_video) {
            commit('status/activateVideo', video_id, { root: true });
        }

        ajaxApi.getVideoDetail(video_id).then(
            res => {
                if (!res.html) {
                    commit('successAjaxVideoButNoHtml', { video_id, res });
                    return;
                }

                if (!res.api_data) {
                    commit('successAjaxVideoButNoApiData', { video_id, res });
                    return;
                }

                commit('successAjaxVideo', {
                    video_id,
                    api_data: res.api_data,
                });

                commit('status/setUserId', res.api_data.viewer.id, { root: true });
                commit('status/activateVideo', video_id, { root: true });
                dispatch('viewerMylist/getViewerMylistgroup', state.items[video_id].use_thread_id, { root: true });
            },
            error => {
                console.log(error);
                commit('failAjaxVideo', { video_id, error });
            }
        )
    },
    closeVideo: ({ commit, getters, rootState }: VideoActionContext, video_id) => {
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
    fetchVideo: ({ commit, dispatch }: VideoActionContext, video_id) => {
        commit('resetVideo', { video_id });
        dispatch('addVideo', video_id);
    }
}
