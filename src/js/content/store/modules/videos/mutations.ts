import Vue from 'vue';
import WatchApiDataVideo from 'js/content/store/parser/watch-api-data-video.ts';
import load_status_map from 'js/content/map/load-status.ts';
import { VideoItem, VideoStoreState, VideoStatus, VideoError } from 'js/content/interface/Video';
import { MutationTree } from 'vuex';

const initializeMutations: MutationTree<VideoStoreState> = {
    // 動画読み込み開始直後に呼ばれる初期化関数
    initializeVideoOnLoadStarted: (state, video_id) => {
        state.videos.push({
            id: video_id,
            status: VideoStatus.AjaxLoadStarted,
            is_closed: false,
            errors: [],
        });
    },

    // 動画の再読み込み開始直後に呼ばれる再初期化関数
    reInitializeVideoOnReLoadStarted: (state, video_id) => {
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
    parseWatchApiData: (state, { video_id, api_data }) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        video.content = WatchApiDataVideo.main(api_data);
        video.raw = api_data;
        video.current_time = 0;
        video.ranges = [];

        video.status = VideoStatus.AjaxLoadSuccess;

        if (video.content.is_public !== true) {
            videoErrorHandler(
                video,
                VideoStatus.IsHidden,
                '非公開動画です。',
            );
        } else if (video.content.is_encrypted) {
            videoErrorHandler(
                video,
                VideoStatus.MediaError__Encrypted,
                'niico非対応の暗号化された動画です。ニコニコ動画で視聴してください。',
            );
        } else if (video.content.is_need_join && !video.content.src) {
            videoErrorHandler(
                video,
                VideoStatus.UnauthorizedError__isNeedJoinChannel,
                'チャンネル会員限定動画のため視聴権限がありません。チャンネルに入会する必要があります。',
            );
        } else if (video.content.is_need_payment && !video.content.src) {
            videoErrorHandler(
                video,
                VideoStatus.UnauthorizedError__isNeedPayment,
                '有料動画のため視聴権限がありません。動画を購入する必要があります。',
            );
        }
    },
};

const editPropertyMutations: MutationTree<VideoStoreState> = {
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

    setRanges: (state, { video_id, ranges }) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        video.ranges = ranges;
    },

    // setCurrentTimeの値はvideo要素へFBされない。
    // timeupdateイベントで更新しており、FBすると無限ループしてしまうため。
    // 代わりにmisc.updateActiveVideoCurrentTime()を使用のこと。
    setCurrentTime: (state, { video_id, current_time }) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        video.current_time = parseInt(current_time);
    },
};

const HTMLVideoElementEventHandleMutation = {
    onPlaying: (state, video_id) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        video.is_paused = false;
    },
    onPaused: (state, video_id) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        video.is_paused = true;
    },

    // ブラウザがメディアリソースの長さと寸法を判定した場合に発生
    onLoadedmetadata: (state, video_id) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        video.status = VideoStatus.ElementLoadedmetadata;
    },

    // 今すぐに再生を再開できるが、
    // バッファリングが不十分でコンテンツを最後まで表示できないと予測している場合に発生
    onCanPlay: (state, video_id) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        video.status = VideoStatus.CanPlay;
    },

    // 次のフレームが利用不可のため再生を停止したが、
    // そのフレームがやがて利用可能になると想定している場合に発生
    onWaiting: (state, video_id) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        video.status = VideoStatus.ElementWaiting;
    },

};

const videoErrorHandler = (video: VideoItem, status: VideoStatus, detail?: any) => {
    video.status = status;
    video.errors.push({
        code: status,
        detail,
    });
};
const statusChangeMutations: MutationTree<VideoStoreState> = {
    onErrorFailAjax: (state, { video_id, detail }) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        videoErrorHandler(
            video,
            VideoStatus.AjaxLoadFailed,
            detail,
        );
    },
    onErrorNoWatchApiData: (state, { video_id, html }) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        videoErrorHandler(
            video,
            VideoStatus.NoApiData,
            html,
        );
    },
    onErrorIsNeedJoinChannel: (state, { video_id }) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        videoErrorHandler(
            video,
            VideoStatus.UnauthorizedError__isNeedJoinChannel,
            'チャンネル会員限定動画です。チャンネルに入会する必要があります。',
        );
    },
    onErrorIsNeedPayment: (state, { video_id }) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        videoErrorHandler(
            video,
            VideoStatus.UnauthorizedError__isNeedPayment,
            '有料動画です。動画を購入する必要があります。。',
        );
    },
    onErrorIsEncrypted: (state, { video_id }) => {
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
    ...HTMLVideoElementEventHandleMutation,
}
