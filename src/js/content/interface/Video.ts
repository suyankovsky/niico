import { ChannelUploader, UserUploader } from 'js/content/interface/Uploader';

export interface VideoStoreState {
    videos: VideoItem[];
}

export interface VideoItem {
    id: string;// 動画IDまたはスレッドID。niico上の識別子: /(sm|so)?[0-9]+/
    status: VideoStatus;// これを元に各種表示の出し分けをする
    errors: VideoError[];// エラーの詳細を格納。
    is_closed: boolean;// 配列からremoveするとHTMLVideoElementが再生成されて再生が途切れるのでプロパティで制御する

    content?: VideoItemContent;// watch api dataをパースした動画情報。初期化処理以外で書き換わることはない。
    raw?: any;// watch api dataの生データ。

    is_paused?: boolean; // 再生状態
    current_time?: number;// 現在の再生時間
    ranges?: [];// バッファの配列
}

export interface VideoItemContent {
    is_encrypted: boolean;// 暗号化された動画である
    is_need_payment: boolean;// 都度課金の必要がある / 有料動画でも課金済みならfalseっぽい。
    is_need_join: boolean;// チャンネル入会の必要がある / 会員限定動画でも入会済みならfalseっぽい。
    is_channel: boolean;// チャンネル動画である
    is_public: boolean;// 公開動画である（非公開でない）
    is_deleted: boolean;// 削除済み動画である

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
    duration: number;
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
    ElementLoadedmetadata = 1103,// VideoElementがloadedmetadataを発火したとき
    ElementWaiting = 1104,

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
