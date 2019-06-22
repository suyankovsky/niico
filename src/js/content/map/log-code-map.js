export default {
    // watchの読み込みエラー
    SUCCESS_GET_WATCH: {
        type: 'info',
        title: '動画watchの読み込みに成功しました。',
    },
    ERROR_GET_WATCH: {
        type: 'error',
        title: '動画watchの読み込みに失敗しました。',
    },

    /*
    **   watchのパースエラー
    **/
    ERROR_PARSE_VIDEO_DATA: {
        type: 'error',
        title: '動画データのパースに失敗しました',
    },
    UNDEFINED_VIDEO_SRC: {
        type: 'warn',
        title: '動画のURLが見つかりません。'
    },
    UNDEFINED_VIDEO_SRC_IS_ENCRYPTED_VIDEO: {
        type: 'warn',
        title: '動画のURLが見つかりません。niico非対応の暗号化動画です。',
    },
    UNDEFINED_VIDEO_SRC_IS_NEED_PAYMENT: {
        type: 'warn',
        title: '動画のURLが見つかりません。未購入の有料動画です。',
    },
    ERROR_PARSE_VIDEO_DATA: {
        type: 'error',
        title: '動画情報のパースに失敗しました。'
    },
    ERROR_PARSE_NICOAD_VIDEO_ID: {
        type: 'error',
        title: 'ニコニ広告のリンクから動画IDをパースできませんでした',
    },
    ERROR_GET_ELEMENT_BY_ID: {
        type: 'error',
        title: '動画のvideo要素の取得に失敗しました。'
    },

    /*
    **   再生エラー
    **/
    ERROR_MEDIA_EVENT: {
        type: 'error',
        title: '動画の再生中にエラーが発生しました。（メディアエラーイベント）',
    },

    /*
    **   コメントの取得
    **/
    UNDEFINED_THREAD_ID: {
        title: 'スレッドIDがいつもの所にいなかったです。',
        type: 'error',
    },
    SUCCESS_GET_COMMENT: {
        type: 'info',
        title: 'コメントの取得に成功しました。',
    },
    ERROR_GET_COMMENT: {
        type: 'error',
        title: 'コメントの取得に失敗しました。',
    },

    /*
    **   スレッドキー
    **/
    SUCCESS_GET_THREAD_KEY: {
        type: 'info',
        title: 'スレッドキーの取得に成功しました。',
    },
    ERROR_GET_THREAD_KEY: {
        type: 'error',
        title: 'スレッドキーの取得に失敗しました。',
    },

    /*
    **   ユーザー情報
    **/
    SUCCESS_GET_USER_DETAIL: {
        type: 'info',
        title: 'ユーザー基本情報の取得に成功しました。',
    },
    ERROR_GET_USER_DETAIL: {
        type: 'error',
        title: 'ユーザー基本情報の取得に失敗しました。',
    },

    /*
    **   ユーザーの投稿動画
    **/
    SUCCESS_GET_USER_POSTED_VIDEO: {
        type: 'info',
        title: 'ユーザーの投稿動画の取得に成功しました。',
    },
    ERROR_GET_USER_POSTED_VIDEO: {
        type: 'error',
        title: 'ユーザーの投稿動画の取得に失敗しました。',
    },

    /*
    **   チャンネルの投稿動画
    **/
    SUCCESS_GET_CHANNEL_POSTED_VIDEO: {
        type: 'info',
        title: 'チャンネルの投稿動画の取得に成功しました。',
    },
    ERROR_GET_CHANNEL_POSTED_VIDEO: {
        type: 'error',
        title: 'チャンネルの投稿動画の取得に失敗しました。',
    },

    /*
    **   ニコレポ
    **/
    SUCCESS_GET_NICOREPO: {
        type: 'info',
        title: 'ニコレポの取得に成功しました。',
    },
    ERROR_GET_NICOREPO: {
        type: 'error',
        title: 'ニコレポの取得に失敗しました。',
    },

    /*
    **   投稿者の公開マイリスト一覧の取得
    **/
    SUCCESS_GET_USER_MYLIST_GROUP_LIST: {
        type: 'info',
        title: '投稿者の公開マイリストの一覧の取得に成功しました。',
    },
    ERROR_GET_USER_MYLIST_GROUP_LIST: {
        type: 'error',
        title: '投稿者の公開マイリストの一覧の取得に失敗しました。',
    },

    /*
    **   公開マイリストのコンテンツ一覧の取得
    **/
    SUCCESS_GET_MYLIST_DETAIL: {
        type: 'info',
        title: '公開マイリストの登録コンテンツ一覧の取得に成功しました。',
    },
    ERROR_GET_MYLIST_DETAIL: {
        type: 'error',
        title: '公開マイリストの登録コンテンツ一覧の取得に失敗しました。',
    },

    /*
    **   視聴者のマイリスト一覧の取得
    **/
    SUCCESS_LOAD_VIEWER_MYLIST_GROUP: {
        type: 'info',
        title: 'あなたのマイリスト一覧の取得に成功しました。',
    },
    ERROR_LOAD_VIEWER_MYLIST_GROUP: {
        type: 'error',
        title: 'あなたのマイリスト一覧の取得に失敗しました。',
    },

    /*
    **   とりマイ登録
    **/
    SUCCESS_ADD_DEFAULT_MYLIST: {
        type: 'success',
        title: 'とりあえずマイリストに登録しました。'
    },
    ERROR_ADD_DEFAULT_MYLIST: {
        type: 'error',
        title: 'とりあえずマイリスト登録に失敗しました。'
    },

    /*
    **   マイリス登録
    **/
    SUCCESS_ADD_SOME_MYLIST: {
        type: 'success',
        title: 'マイリストに登録しました。'
    },
    ERROR_ADD_SOME_MYLIST: {
        type: 'error',
        title: 'マイリスト登録に失敗しました。'
    },

    /*
    **   視聴者の履歴を取得
    **/
    SUCCESS_LOAD_VIEWER_HISTORY: {
        type: 'info',
        title: '視聴履歴の取得に成功しました。'
    },
    ERROR_LOAD_VIEWER_HISTORY: {
        type: 'error',
        title: '視聴履歴の取得に失敗しました。'
    },
}
