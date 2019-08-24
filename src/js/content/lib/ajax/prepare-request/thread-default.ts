import { ThreadInformation } from 'js/content/interface/Thread';

export default async function (params: ThreadInformation) {
    return JSON.stringify([
        { "ping": { "content": "rs:0" } },
        { "ping": { "content": "ps:0" } },
        {
            "thread": {
                "thread": params.thread_id,
                "version": "20090904",
                "fork": 0,
                "language": 0,
                "user_id": params.user_id,
                "with_global": 1,
                "scores": 1,
                "nicoru": 0,
                "userkey": params.user_key
            }
        },
        { "ping": { "content": "pf:0" } },
        { "ping": { "content": "ps:1" } },
        {
            "thread_leaves": {
                "thread": params.thread_id,
                "language": 0,
                "user_id": params.user_id,
                "content": "0-" + Math.ceil(params.duration / 60) + ":100,1000",
                "scores": 1,
                "nicoru": 0,
                "userkey": params.user_key,
            }
        },
        { "ping": { "content": "pf:1" } },
        { "ping": { "content": "rf:0" } }
    ]);
}
