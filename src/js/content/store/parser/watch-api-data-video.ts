// watchページのapi_dataをパースする

import misc from 'js/content/lib/misc.ts';
import { VideoItemContent } from 'js/content/interface/Video';
import { ChannelUploader, UserUploader } from 'js/content/interface/Uploader.ts';
import { RawWatchApiData } from 'js/content/interface/api/RawWatchApiData';

export default class {
    static main(v: RawWatchApiData): VideoItemContent {
        return {
            title: v.video.title,
            is_channel: v.channel !== null,
            src: v.video.smileInfo.url || null,
            is_encrypted: v.video.dmcInfo !== null && v.video.dmcInfo.encryption === true,
            is_need_payment: v.context.isNeedPayment === true,
            is_need_join: v.context.isNeedAdmission === true,
            is_public: v.video.isPublic === true,
            is_deleted: v.video.isDeleted === true,
            thumbnail_src: v.video.largeThumbnailURL || v.video.thumbnailURL || null,
            count_view: v.video.viewCount || 0,
            count_comment: v.thread.commentCount || 0,
            count_mylist: v.video.mylistCount || 0,
            description: this.description(v),
            tags: v.tags,
            posted_date: v.video.postedDateTime,
            csrf_token: v.context.csrfToken,
            uploader: this.uploader(v),

            prefixed_video_id: v.video.id,

            thread: {
                thread_ids: {
                    default: v.thread.ids.default,
                    commuinty: v.thread.ids.community,
                    use: this.thread_id(v),//本来切り替えられるけど面倒なので初期値を使う
                },
                user_id: v.viewer.id,
                user_key: v.context.userkey,
                l: v.video.duration,
                optional_thread_id: this.optional_thread_id(v),
            }
        }
    }

    static thread_id(v: RawWatchApiData): number | null {
        if (v.channel !== null && v.thread.ids.community) {
            return v.thread.ids.community;
        }

        return v.thread.ids.default;
    }

    static optional_thread_id(v: RawWatchApiData): number | null {
        if (v.channel !== null && v.video.dmcInfo && v.video.dmcInfo.thread) {
            return v.video.dmcInfo.thread.optional_thread_id;
        }

        return null;
    }

    static description(v: RawWatchApiData): string {
        if (!v.video.description) return '';

        const str = String(v.video.description);
        const re = /onclick=\"seekNicoPlayer\(\'\#[0-9:]+\'\); return false;\"/g;
        return str.replace(re, '');
    }

    static uploader(v): ChannelUploader | UserUploader {
        if (v.channel !== null && v.channel.globalId) {
            return {
                is_channel: true,
                is_public: true,
                id: v.channel.id,
                global_id: v.channel.globalId,
                name: v.channel.name,
                icon_src: '//secure-dcdn.cdn.nimg.jp/comch/channel-icon/128x128/' + v.channel.globalId + '.jpg',
                href: '//ch.nicovideo.jp/' + v.channel.globalId,
            };
        }

        if (v.owner !== null && v.owner.id) {
            return {
                is_channel: false,
                is_public: true,
                is_user_my_video_public: v.owner.isUserMyVideoPublic,
                is_user_open_list_public: v.owner.isUserOpenListPublic,
                is_user_video_public: v.owner.isUserVideoPublic,
                id: v.owner.id,
                name: v.owner.nickname,
                icon_src: v.owner.iconURL,
                href: '//www.nicovideo.jp/user/' + v.owner.id
            }
        }

        return {
            is_channel: false,
            is_public: false,

            is_user_my_video_public: false,
            is_user_open_list_public: false,
            is_user_video_public: false,

            id: null,
            name: '非公開ユーザー',
            icon_src: '//secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/defaults/blank.jpg',
        }
    }
}

