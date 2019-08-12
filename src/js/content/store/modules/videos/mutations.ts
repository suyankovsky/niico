import Vue from 'vue';
import WatchApiDataVideo from 'js/content/store/parser/watch-api-data-video.ts';
import load_status_map from 'js/content/map/load-status.ts';
import { VideoStoreState, VideoStatus } from 'js/content/store/modules/videos/interface.ts';

// ここだけTSで書きたい。つらい。

export default {
    // 動画読み込みイベント
    addVideo: (state: VideoStoreState, video_id) => {
        console.log('addVideo is called');
        state.videos.push({
            id: video_id,
            status: VideoStatus.AjaxLoadStarted,
            is_closed: false,
            content: undefined,
            errors: [],
        });
    },
    successAjaxVideo: (state: VideoStoreState, { video_id, api_data }) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        video.status = VideoStatus.AjaxLoadSuccess;
        video.content = new WatchApiDataVideo(api_data);
    },
    failAjaxVideo: (state: VideoStoreState, { video_id, error }) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        video.status = VideoStatus.AjaxLoadFailed;
        video.errors.push({
            code: VideoStatus.AjaxLoadFailed,
            content: error,
        })
    },
    successAjaxVideoButNoHtml: (state: VideoStoreState, { video_id, responce }) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        video.status = VideoStatus.NoHtml;
        video.errors.push({
            code: VideoStatus.NoHtml,
            content: responce,
        })
    },
    successAjaxVideoButNoApiData: (state: VideoStoreState, { video_id, html }) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        const is_need_join_channel = (html: string) => {
            if (html.indexOf('チャンネル会員専用動画') > 0) return true;
            if (html.indexOf('チャンネル月額会員ならずっと見放題です') > 0) return true;
            return false;
        }

        if (is_need_join_channel(String(html))) {
            video.status = VideoStatus.NoApiData__IsNeedJoinChannel;
            video.errors.push({
                code: VideoStatus.NoApiData__IsNeedJoinChannel,
            })
        }

        video.status = VideoStatus.NoApiData__Unknown;
        video.errors.push({
            code: VideoStatus.NoApiData__Unknown,
        })
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
