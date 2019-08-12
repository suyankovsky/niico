export interface VideoStoreState {
    videos: VideoItem[];
}

export interface VideoItem {
    id: string;
    content: VideoItemContent | undefined;
    status: VideoStatus;
    errors: VideoError[];
    is_closed: boolean;
}

export interface VideoItemContent {
    title: string;
}

export interface VideoError {
    code: VideoStatus;
    content?: any;
}

export enum VideoStatus {
    //
    //  異常系・表示できるものがない
    //
    AjaxLoadFailed = 101,
    NoApiData__IsNeedJoinChannel = 102,
    // NoApiData__IsNeedFollowCommunity = 103,
    // ContextError__IsNeedPayment = 104,
    NoApiData__Unknown = 105,
    NoHtml = 110,

    //
    // 異常系・表示できるものはある
    //
    MediaError__Aborted = 106,
    MediaError__Network = 107,
    MediaError__Decode = 108,
    MediaError_NotSupported = 109,

    //
    // 正常系・進行中・Video要素表示しない
    //
    AjaxLoadStarted = 501,
    AjaxReLoadStarted = 502,

    //
    // 正常系・進行中・Video要素表示する
    //
    AjaxLoadSuccess = 701,
    ElementLoadStarted = 703,// VideoElementがloadstartを発火したとき
    ElementLoadDoneMetadata = 704,// VideoElementがloadedmetadataを発火したとき

    //
    // 正常系・再生可
    //
    CanPlay = 1001,
    CanPlayThrough = 10002,
}
