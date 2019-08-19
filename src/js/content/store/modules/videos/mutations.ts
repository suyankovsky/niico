import Vue from 'vue';
import WatchApiDataVideo from 'js/content/store/parser/watch-api-data-video.ts';
import load_status_map from 'js/content/map/load-status.ts';
import { VideoItem, VideoStoreState, VideoStatus, VideoError, VideoBufferRange } from 'js/content/interface/Video';
import { MutationTree } from 'vuex';
import misc from 'js/content/lib/misc';

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

        video.raw = api_data;
        video.current_time = 0;
        video.ranges = [];
        video.content = WatchApiDataVideo.main(api_data);
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
};

const HTMLVideoElementEventHandleMutation: MutationTree<VideoStoreState> = {
    // 再生が開始された場合に発生
    onPlaying: (state, video_id) => {
        const video = state.videos.find(item => item.id === video_id);
        if (!video) return false;

        video.is_paused = false;
    },

    // 再生が一時停止された。pauseメソッドからの復帰後に発生する場合に発生
    onPause: (state, video_id) => {
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

    // 通常の再生が行われ現在の再生位置の変化が起こった場合に発生
    onTimeupdate: (state, event) => {
        if (!event || !event.target || !event.target.id) return;
        const el = event.target;
        const video_id = event.target.id;

        const video = state.videos.find(item => item.id === video_id);
        if (!video) return;
        const index = state.videos.indexOf(video);

        const current_time = el.currentTime;
        const duration = el.duration;
        const bf = el.buffered;
        const ranges: VideoBufferRange[] = [];

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

        Vue.set(state.videos, index, {
            ...video,
            current_time,
            ranges,
        });
    },

    onMediaError: (state, event) => {
        const video_id = event.target.id;
        const error = event.target.error;

        const video = state.videos.find(item => item.id === video_id);
        if (!video) return;

        if (error.code === MediaError.MEDIA_ERR_ABORTED) {
            videoErrorHandler(
                video,
                VideoStatus.MediaError__Aborted,
            );
        }
        if (error.code === MediaError.MEDIA_ERR_NETWORK) {
            videoErrorHandler(
                video,
                VideoStatus.MediaError__Network,
            );
        }
        if (error.code === MediaError.MEDIA_ERR_DECODE) {
            videoErrorHandler(
                video,
                VideoStatus.MediaError__Decode,
            );
        }
        if (error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
            videoErrorHandler(
                video,
                VideoStatus.MediaError__NotSupported,
            );
        }
    }
};

const videoErrorHandler = (video: VideoItem, status: VideoStatus, detail?: any) => {
    video.status = status;
    video.errors.push({
        code: status,
        detail,
    });

    /*misc.pushLog('ERROR_MEDIA_EVENT', {
        video_id,
        error_code: error.target.error.code,
    });*/
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
