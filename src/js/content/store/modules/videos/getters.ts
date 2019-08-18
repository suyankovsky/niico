import load_status_map from 'js/content/map/load-status.ts';
import cannot_render_video_html_reasons_map from 'js/content/map/cannot_render_video_html_reasons.ts';
import { VideoStoreState, VideoStatus, VideoItem } from 'js/content/interface/Video';

export default {
    // 閉じられていない動画ID郡を返す
    not_closed_video_ids: (state) => {
        const video_ids = Object.keys(state.items);
        return video_ids.filter((key, index) => {
            return !state.items[key]['is_closed'];
        });
    },

    // 再生中の動画が閉じられた場合に次の動画IDを返す的な関数
    next_video_id: (state, getters, rootState) => {
        const video_ids = Object.keys(state.items);
        const candidate = video_ids.filter((key, index) => {
            if (rootState.status.active_video_id === key) return true;
            return !state.items[key]['is_closed'];
        });

        const length = candidate.length;
        const index = candidate.indexOf(rootState.status.active_video_id);

        if (length < 2 || index === -1) return false;

        let next_index = index;

        if (index === length - 1) {
            next_index = 0;
        } else if (index < length) {
            next_index++
        } else {
            next_index--;
        }

        if (next_index >= 0 && candidate[next_index]) {
            return candidate[next_index];
        } else {
            console.error('Error on next_video_id');
            return false;
        }
    },

    is_loading_watch: (state, getters, rootState) => (video: VideoItem) => {
        if (video.status === VideoStatus.AjaxLoadStarted || video.status === VideoStatus.AjaxReLoadStarted) {
            return true;
        }
        return false;
    },

    is_loading_buffer: (state) => (video: VideoItem) => {
        if (video.status > 1100) return true;
        return false;
    },

    is_error: (state) => (video: VideoItem) => {
        if (video.status < 1000) return true;
        return false;
    },

    is_can_play: (state) => (video: VideoItem) => {
        if (video.status === 2525 && video.content && video.content.src !== "") return true;
        return false;
    },

    // video要素を描画しない理由があれば配列で返す
    cannot_render_video_html_reasons: (state) => (video_id) => {
        return [];
        const video = state.videos.find(item => item.id === video_id);

        const conditions = [
            {
                condition: video.status === VideoStatus.AjaxLoadFailed,
                code: 'PARSE_ERR_FAILED_LOAD_VIDEO',
            },
            {
                condition: video.status === VideoStatus.NoApiData__IsNeedJoinChannel,
                code: 'CONTEXT_ERR_NEED_JOIN_CHANNEL',
            },
            {
                condition: video.src == "" && video.is_encrypted,
                code: 'CONTEXT_ERR_ENCRYPTED_VIDEO',
            },
            {
                condition: video.src == "" && video.is_need_payment,
                code: 'CONTEXT_ERR_NEED_PAYMENT',
            },
            {
                condition: video.src == "",
                code: 'PARSE_ERR_NO_VIDEO_URL',
            },
            {
                condition: video.ajax_load_status !== load_status_map.ajax_video.success && video.load_status !== load_status_map.ajax_video.failed,
                code: 'UNKNOWN',
            },
            {
                condition: video.hasOwnProperty('media_error_code') && video.media_error_code === MediaError.MEDIA_ERR_ABORTED,
                code: 'MEDIA_ERR_ABORTED',
            },
            {
                condition: video.hasOwnProperty('media_error_code') && video.media_error_code === MediaError.MEDIA_ERR_NETWORK,
                code: 'MEDIA_ERR_NETWORK',
            },
            {
                condition: video.hasOwnProperty('media_error_code') && video.media_error_code === MediaError.MEDIA_ERR_DECODE,
                code: 'MEDIA_ERR_DECODE',
            },
            {
                condition: video.hasOwnProperty('media_error_code') && video.media_error_code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED,
                code: 'MEDIA_ERR_SRC_NOT_SUPPORTED',
            },
        ];

        return conditions
            .filter((item: Item) => item.condition === true)
            .map((item: Item) => {
                item.message = cannot_render_video_html_reasons_map[item.code];
                return item;
            });
    },
}

interface Item {
    condition: boolean,
    code: string,
    message?: string,
}
