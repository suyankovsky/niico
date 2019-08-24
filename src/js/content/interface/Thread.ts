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
