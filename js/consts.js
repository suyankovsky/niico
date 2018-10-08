'use strict';

// 定数っぽいもの
const _consts = {

    // Vueに指定するdataの初期値
    dafaultVueData: {
        videos: {},
        videoHistory: [],
        logs: [],

        // 記憶しない状態の初期値
        status: {
            isLoggedIn: false,
            isPlayerActive: false,
            activeVideoId: '',
            pageVideoId: '',
            commentSort: {
                key: '',
                orderIsAsc: true,
            },
        },

        // 記憶する状態の初期値
        settings: {
            isOpenNewTab: true,
            isLoop: true,
            isBottomFit: false,
            isIncludeNiicoHashTagInTweet: true,
            isNiicoOff: false,
            isBeforeunload: false,
            activeInfo: 'videoOutlines',
            windowMode: 'default',
            commentOpacity: 1,
            commentRate: 1,
            volume: 1,
        },

        // 開発用のフラグ
        development: {
            isDev: false,
            isLogConsole: false,
            isObjectConsole: false,
        }
    },

    // 正規表現のパターン
    re: {

        // 動画IDとして正しいかどうか判定する用
        validVideoId: /(sm|so|nm)?([0-9]+)/,

        // 動画IDを取得するために先読みする用
        parseVideoId: /(?<=watch\/)(sm|so|nm)?([0-9]+)/,

        // 無理やりニコニ広告のURLから動画IDを取得する用
        parseideoIdNicoAd: /smile\?i=([0-9]{1,8})/,

        // watchページのURLとして正しいかどうか判定する用
        watchURI: /(^\/watch\/)|(^watch\/)|(^http(s?):\/\/www\.nicovideo\.jp\/watch\/)/,

        // ニコニ広告のURLとして正しいかどうか判定する用
        nicoAdURI: /^http(s?):\/\/api\.nicoad\.nicovideo\.jp/,

        // 説明文のURLを抽出する用。公式が対応したので不要だが記念に残しておく。
        url: /http(s?):\/\/([a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+)/,
        url__g: /http(s?):\/\/([a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+)/g,

        // チャンネル動画RSSパース用 ちょっとつらい。
        channel: {
            parseVideoThumbnailSrc: /https:\/\/tn\.smilevideo\.jp\/smile\?i\=[0-9]+/,
            parseVideoDuration: /\<strong class\=\"nico-info-length\"\>([0-9:]+)\<\/strong\>/,
            parseVideoPosted: /\<strong class\=\"nico-info-comdate\"\>(.+)\<\/strong\>/,
            scrapeOffPostedDate: /([0-9]{4})年([0-9]{2})月([0-9]{2})日 ([0-9]{2})：([0-9]{2})：([0-9]{2})/,
        }
    },

    // APIなどのベースURL
    base_url: {
        nicovideo: '//www.nicovideo.jp/',
        channel: [
            '//ch.nicovideo.jp/',
            '/video?rss=2.0',
        ],
        getFlv: '//www.nicovideo.jp/api/getflv/',
        getVideoInfo: '//api.ce.nicovideo.jp/nicoapi/v1/video.info?v=',
        getThumbInfo: '//ext.nicovideo.jp/api/getthumbinfo/',
        getComment: '//nmsg.nicovideo.jp/api.json/',
        getUserInfo: '//api.ce.nicovideo.jp/api/v1/user.info?user_id=',
        getUserVideo: '//api.ce.nicovideo.jp/nicoapi/v1/user.myvideo?user_id=',
        getHistory: '//www.nicovideo.jp/api/videoviewhistory/list',
        getThreadKey: '//flapi.nicovideo.jp/api/getthreadkey?thread=',
    },

    // 縦スクロールを横スクロールに変換するときのスクロールスピード
    horizonScrollSpeed: 4,

    infoTabsList: {
        videoOutlines: '動画情報',
        videoComments: 'コメント',
        contributorVideos: '投稿者動画',
        niicoSettings: '設定',
        niicoLogs: 'ログ',
        videoHistory: '視聴履歴',
    },

}
