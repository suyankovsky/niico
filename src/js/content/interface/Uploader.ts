interface Uploader {
    id: number | null;
    is_channel: boolean;
    is_public: boolean;
    name: string;
    icon_src: string;
    href: string | null;
}

export interface UserUploader extends Uploader {
    is_user_my_video_public: boolean;
    is_user_open_list_public: boolean;
    is_user_video_public: boolean;
}

export interface ChannelUploader extends Uploader {
    global_id: number | null;
}
