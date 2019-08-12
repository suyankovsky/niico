import Vue from 'vue';
import WatchApiDataVideo from 'js/content/store/parser/watch-api-data-video.ts';
import load_status_map from 'js/content/map/load-status.ts';

// ここだけTSで書きたい。つらい。

export default {
    // 動画読み込みイベント
    initializeVideo: (state, { video_id }) => {
        Vue.set(state.items, video_id, {
            id: video_id,
            ajax_load_status: load_status_map.ajax_video.loading,
            is_closed: false,
        })
    },
    loadSuccessVideo: (state, { video_id, data }) => {
        Vue.set(state.items, video_id, {
            ...state.items[video_id],
            ajax_load_status: load_status_map.ajax_video.success,
            element_load_status: load_status_map.element.loadingmetadata,
            is_loaded_metadata: false,
            ...new WatchApiDataVideo(data),
        });
    },
    loadErrorVideo: (state, { video_id, error }) => {
        Vue.set(state.items, video_id, {
            ...state.items[video_id],
            ajax_load_status: load_status_map.ajax_video.failed,
            error: error,
        });
    },
    loadErrorIsNeedJoinChannelVideo: (state, { video_id }) => {
        Vue.set(state.items, video_id, {
            ...state.items[video_id],
            ajax_load_status: load_status_map.ajax_video.failed,
            is_need_join_channel: true,
        });
    },

    // 閉じる
    closeVideo: (state, { video_id }) => {
        Vue.set(state.items[video_id], 'is_closed', true);
    },
    uncloseVideo: (state, { video_id }) => {
        Vue.set(state.items[video_id], 'is_closed', false);
    },

    // 再生プロパティ
    setDuration: (state, { video_id, duration }) => {
        Vue.set(state.items[video_id], 'duration', parseInt(duration));
    },
    setRanges: (state, { video_id, ranges }) => {
        Vue.set(state.items[video_id], 'ranges', ranges);
    },

    // setCurrentTimeの値はvideo要素へFBされない。
    // timeupdateイベントで更新しており、FBすると無限ループしてしまうため。
    // 代わりにmisc.updateActiveVideoCurrentTime()を使用のこと。
    setCurrentTime: (state, { video_id, current_time }) => {
        Vue.set(state.items[video_id], 'current_time', parseInt(current_time));
    },

    // エラーイベントが発生したら
    onMediaErrorEvent: (state, { video_id, error }) => {
        Vue.set(state.items[video_id], 'media_error_code', error.code);
    },
    onCanPlay: (state, { video_id }) => {
        Vue.set(state.items[video_id], 'element_load_status', load_status_map.element.canplay);
    },
    onCanPlayThrough: (state, { video_id }) => {
        Vue.set(state.items[video_id], 'element_load_status', load_status_map.element.canplaythrough);
    },

    beginLoadingBuffer: (state, { video_id }) => {
        Vue.set(state.items[video_id], 'element_load_status', load_status_map.element.loadingbuffer);
    },
    doneLoadMetaData: (state, { video_id }) => {
        Vue.set(state.items[video_id], 'element_load_status', load_status_map.element.loadingbuffer);
    },

    togglePlay: (state, { video_id, is_paused }) => {
        Vue.set(state.items[video_id], 'is_paused', is_paused ? true : false);
    },
}
