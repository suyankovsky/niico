export interface ThreadInformation {
    thread_ids: {
        default: number | null;
        commuinty: number | null;
    }
    thread_id: number | null;
    user_id: number | null;
    user_key: string | null;
    duration: number;
    optional_thread_id: number | null;
}

export interface ThreadStoreState {
    threads: ThreadItem[];
}
export interface ThreadItem {
    thread_id: number;
    video_id: string;
    status: ThreadStatus;
    comments: CommentItem[];
}

export interface CommentItem {
    anonymity: boolean;
    content: string;
    date: Date;
    date_usec: number;
    mail: string;
    no: number;
    thread: number//thread_id
    user_id: string;
    vpos: number;
}

export enum ThreadStatus {
    Unknown = 101,
    AjaxLoadFailed = 102,
    NotEnoughRequestParams = 103,
    InvalidResponce = 104,


    AjaxLoadStarted = 1001,

    AjaxLoadSuccess = 2525,
}
