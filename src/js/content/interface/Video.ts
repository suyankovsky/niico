import { ActionContext } from 'js/content/interface/Context.ts';
import { ChannelUploader, UserUploader } from 'js/content/interface/Uploader';

export interface VideoActionContext extends ActionContext {
    state: VideoStoreState;
}

export interface VideoStoreState {
    videos: VideoItem[];
}

export interface VideoItem {
    id: string;
    status: VideoStatus;
    errors: VideoError[];
    is_closed: boolean;
    content?: VideoItemContent;
    raw?: any;

    is_paused?: boolean;
}

export interface VideoItemContent {
    is_encrypted: boolean;
    is_need_payment: boolean;
    is_need_join: boolean;
    is_channel: boolean;
    is_public: boolean;
    is_deleted: boolean;

    prefixed_video_id: string;
    thread: {
        thread_ids: {
            default: number | null;
            commuinty: number | null;
            use: number | null;
        }
        user_id: number | null;
        user_key: string | null;
        l: number;
        optional_thread_id: number | null;
    }

    title: string;
    current_time: number;
    src: string | null;
    thumbnail_src: string | null;
    count_view: number;
    count_comment: number;
    count_mylist: number;
    description: string;
    tags: {}[];
    posted_date: string;
    csrf_token: string;
    uploader: ChannelUploader | UserUploader;

    ranges: [];
}

export interface VideoError {
    code: VideoStatus;
    detail?: any;
}

// 異常    < 1000
// 正常    > 1000
// 再生可 === 2525
export enum VideoStatus {
    //
    // 異常系1（データなし）
    // プレイヤー：エラー
    // 動画情報パネル：エラー
    // コメントパネル：エラー
    //
    Unknown = 101,
    AjaxLoadFailed = 102,
    NoApiData = 103,

    //
    // 異常系2（メディアエラー）
    // プレイヤー：エラー
    // 動画情報パネル：通常
    // コメントパネル：コメントステータスに応じる
    //
    MediaError__Aborted = 201,
    MediaError__Network = 202,
    MediaError__Decode = 203,
    MediaError__NotSupported = 204,
    MediaError__Encrypted = 205,//暗号化されている動画

    // 異常系3（権限なし）
    UnauthorizedError__isNeedFollowCommuninty = 301,
    UnauthorizedError__isNeedJoinChannel = 302,
    UnauthorizedError__isNeedPayment = 303,

    // 異常系4（その他）
    IsHidden = 401,// 非公開

    //
    // 正常系1（Ajax中）
    // プレイヤー：読込中
    // 動画情報パネル：読込中
    // コメントパネル：読込中
    //
    AjaxLoadStarted = 1001,
    AjaxReLoadStarted = 1002,

    //
    // 正常系2（動画ファイルの読込中）
    // プレイヤー：
    //  Video要素：表示
    //  読込中：表示
    //  コメントキャンパス：非表示
    //  コントローラ：非表示
    // 動画情報パネル：通常
    // コメントパネル：コメントステータスに応じる
    //
    AjaxLoadSuccess = 1101,
    ElementLoadStarted = 1102,// VideoElementがloadstartを発火したとき
    ElementLoadDoneMetadata = 1103,// VideoElementがloadedmetadataを発火したとき

    //
    // 正常系3（再生可）
    // プレイヤー：
    //  Video要素：表示
    //  読込中：非表示
    //  コメントキャンパス：コメントステータスに応じる
    //  コントローラ：表示
    // 動画情報パネル：通常
    // コメントパネル：コメントステータスに応じる
    //
    CanPlay = 2525,
}
