import Vue from 'vue';
import WatchApiDataVideo from 'js/content/store/parser/watch-api-data-video.ts';
import load_status_map from 'js/content/map/load-status.ts';
import { VideoItem, VideoStoreState, VideoStatus, VideoError } from 'js/content/interface/Video';

const initializeMutations = {
    // 動画読み込み開始直後に呼ばれる初期化関数
    initializeVideoOnLoadStarted: (state: VideoStoreState, video_id) => {
        state.videos.push({
            id: video_id,
            status: VideoStatus.AjaxLoadStarted,
            is_closed: false,
            errors: [],
        });
    },

    // 動画の再読み込み開始直後に呼ばれる再初期化関数
    reInitializeVideoOnReLoadStarted: (state: VideoStoreState, video_id) => {
        let video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        video = {
            id: video_id,
            status: VideoStatus.AjaxReLoadStarted,
            is_closed: false,
            errors: [],
        };
    },

    // api_dataの取得完了直後、stateに反映する
    parseWatchApiData: (state: VideoStoreState, { video_id, api_data }) => {
        let video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        console.log(api_data);

        video.status = VideoStatus.AjaxLoadSuccess;
        video.content = WatchApiDataVideo.main(api_data);
        video.raw = api_data;

        if (video.content.is_public !== true) {
            videoErrorHandler(
                video,
                VideoStatus.IsHidden,
                '非公開です。',
            );
        } else if (video.content.is_encrypted) {
            videoErrorHandler(
                video,
                VideoStatus.MediaError__Encrypted,
                'niico非対応の暗号化された動画です。ニコニコ動画で視聴してください。',
            );
        } else if (video.content.is_need_join) {
            videoErrorHandler(
                video,
                VideoStatus.UnauthorizedError__isNeedJoinChannel,
                'チャンネル会員限定動画のため視聴権限がありません。チャンネルに入会する必要があります。',
            );
        } else if (video.content.is_need_payment) {
            videoErrorHandler(
                video,
                VideoStatus.UnauthorizedError__isNeedPayment,
                '有料動画のため視聴権限がありません。動画を購入する必要があります。',
            );
        }

        console.log(video);
    },
};

const editPropertyMutations = {
    closeVideo: (state, { video_id }) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        video.is_closed = true;
    },
    uncloseVideo: (state, { video_id }) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        video.is_closed = false;
    },

    // 再生プロパティ
    setDuration: (state, { video_id, duration }) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        video.content.duration = duration;
    },
    setRanges: (state, { video_id, ranges }) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        video.content.ranges = ranges;
    },

    // setCurrentTimeの値はvideo要素へFBされない。
    // timeupdateイベントで更新しており、FBすると無限ループしてしまうため。
    // 代わりにmisc.updateActiveVideoCurrentTime()を使用のこと。
    setCurrentTime: (state, { video_id, current_time }) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        video.content.current_time = parseInt(current_time);
    },

    beginLoadingBuffer: (state, { video_id }) => {
        Vue.set(state.items[video_id], 'element_load_status', load_status_map.element.loadingbuffer);
    },
    doneLoadMetaData: (state, { video_id }) => {
        Vue.set(state.items[video_id], 'element_load_status', load_status_map.element.loadingbuffer);
    },

    togglePlay: (state, { video_id, is_paused }) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        video.is_paused = is_paused ? true : false;
    },
    onCanPlay: (state, { video_id }) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        video.status = VideoStatus.CanPlay;
    },
    onCanPlayThrough: (state, { video_id }) => {
    },
};

const videoErrorHandler = (video: VideoItem, status: VideoStatus, detail?: any) => {
    video.status = status;
    video.errors.push({
        code: status,
        detail,
    });
};
const statusChangeMutations = {
    onErrorFailAjax: (state: VideoStoreState, { video_id, detail }) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        videoErrorHandler(
            video,
            VideoStatus.AjaxLoadFailed,
            detail,
        );
    },
    onErrorNoWatchApiData: (state: VideoStoreState, { video_id, html }) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        videoErrorHandler(
            video,
            VideoStatus.NoApiData,
            html,
        );
    },
    onErrorIsNeedJoinChannel: (state: VideoStoreState, { video_id }) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        videoErrorHandler(
            video,
            VideoStatus.UnauthorizedError__isNeedJoinChannel,
            'チャンネル会員限定動画です。チャンネルに入会する必要があります。',
        );
    },
    onErrorIsNeedPayment: (state: VideoStoreState, { video_id }) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        videoErrorHandler(
            video,
            VideoStatus.UnauthorizedError__isNeedPayment,
            '有料動画です。動画を購入する必要があります。。',
        );
    },
    onErrorIsEncrypted: (state: VideoStoreState, { video_id }) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        videoErrorHandler(
            video,
            VideoStatus.MediaError__Encrypted,
            '暗号化された動画です。niico非対応のためニコニコ動画で視聴して下さい。',
        );
    },
};

export default {
    ...initializeMutations,
    ...editPropertyMutations,
    ...statusChangeMutations,
}
