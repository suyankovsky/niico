// watchページのapi_dataをパースする

import misc from 'js/content/lib/misc.js';

export default class {
    constructor(api_data) {
        this.v = api_data;

        const keys = [
            'is_channel',
            'src',
            'thumbnail_src',
            'title',
            'original_data',
            'viewCount',
            'commentCount',
            'mylistCount',
            'description',
            'tags',
            'posted_date',
            'csrfToken',
            'uploader',
            'use_thread_id',
            'current_time',
            'is_encrypted',
            'is_need_payment',
        ];

        const parsed = [];

        keys.forEach(
            key => {
                const val = this[key]();
                parsed[key] = val;
            }
        )

        if(parsed.is_encrypted) {
            misc.pushLog('UNDEFINED_VIDEO_SRC_IS_ENCRYPTED_VIDEO', {
                video_id: this.v.video.id
            });
        } else if(parsed.is_need_payment) {
            misc.pushLog('UNDEFINED_VIDEO_SRC_IS_NEED_PAYMENT', {
                video_id: this.v.video.id
            });
        } else if(parsed.src) {
            misc.pushLog('UNDEFINED_VIDEO_SRC', {
                video_id: this.v.video.id
            });
        }

        return parsed;
    }

    current_time() {
        return 0;
    }

    is_channel() {
        return this.v.channel !== null;
    }

    src() {
        return this.v.video.smileInfo.url;
    }

    is_encrypted() {
        if(!this.v.video) return false;
        if(!this.v.video.dmcInfo) return false;
        if(!this.v.video.dmcInfo.encryption) return false;

        return true;
    }

    is_need_payment() {
        if(!this.v.context) return false;
        if(!this.v.context.isNeedPayment) return false;

        return true;
    }

    thumbnail_src() {
        return this.v.video.largeThumbnailURL || this.v.video.thumbnailURL;
    }
    title() {
        return this.v.video.title;
    }
    original_data() {
        return this.v;
    }
    viewCount() {
        return this.v.video.viewCount;
    }
    commentCount() {
        return this.v.thread.commentCount;
    }
    mylistCount() {
        return this.v.video.mylistCount;
    }
    description() {
        return String(this.v.video.description).replace(/onclick=\"seekNicoPlayer\(\'\#[0-9:]+\'\); return false;\"/g, '')
    }
    tags() {
        return this.v.tags;
    }
    posted_date() {
        return this.v.video.postedDateTime;
    }

    csrfToken() {
        return this.v.context.csrfToken;
    }

    uploader() {
        let uploader;
        if(this.is_channel()) {
            uploader = {
                is_channel: true,
                is_public: true,
                id: this.v.channel.id,
                global_id: this.v.channel.globalId,
                name: this.v.channel.name,
                icon_src: '//secure-dcdn.cdn.nimg.jp/comch/channel-icon/128x128/' + this.v.channel.globalId + '.jpg',
                href: '//ch.nicovideo.jp/' + this.v.channel.globalId,
            };
        } else if(this.v.owner !== null) {
            uploader = {
                is_channel: false,
                is_public: true,

                // 投稿動画の公開状況
                is_user_my_video_public: this.v.owner.isUserMyVideoPublic,
                is_user_open_list_public: this.v.owner.isUserOpenListPublic,
                is_user_video_public: this.v.owner.isUserVideoPublic,
                id: this.v.owner.id,
                name: this.v.owner.nickname,
                icon_src: this.v.owner.iconURL,
                href: '//www.nicovideo.jp/user/' + this.v.owner.id
            }
        } else {
            uploader = {
                is_channel: false,
                is_public: false,

                is_user_my_video_public: false,
                is_user_open_list_public: false,
                is_user_video_public: false,

                id: false,
                name: '非公開ユーザー',
                icon_src: '//secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/defaults/blank.jpg',
                href: '',
            }
        }

        return uploader;
    }

    use_thread_id() {
        try {
            return this.v.thread.ids.default;
        } catch(e) {
            misc.pushLog('UNDEFINED_THREAD_ID');
            return null;
        }
    }
}
