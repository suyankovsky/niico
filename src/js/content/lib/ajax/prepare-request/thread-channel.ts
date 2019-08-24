import ajaxApi from 'js/content/lib/ajax/ajax-api';
import { ThreadInformation } from 'js/content/interface/Thread';

export default async function (params: ThreadInformation) {
    if (!params.thread_id) {
        new Error('Not Found Valid Thread Id');
        return;
    }
    return ajaxApi.getThreadKey(params.thread_id).then(
        done => {
            return generate(params, done);
        }
    )
}

const generate = function (params: ThreadInformation, flparams) {
    return JSON.stringify([
        { "ping": { "content": "rs:0" } },
        { "ping": { "content": "ps:0" } },
        {
            "thread": {
                "thread": params.optional_thread_id,
                "version": "20090904",
                "fork": 0,
                "language": 0,
                "user_id": params.user_id,
                "with_global": 1,
                "scores": 1,
                "nicoru": 0,
                "userkey": params.user_key
            }
        }, {
            "ping": { "content": "pf:0" }
        },
        { "ping": { "content": "ps:1" } },
        {
            "thread_leaves": {
                "thread": params.optional_thread_id,
                "language": 0,
                "user_id": params.user_id,
                "content": "0-" + Math.ceil(params.duration / 60) + ":100,100",
                "scores": 1,
                "nicoru": 0,
                "userkey": params.user_key
            }
        },
        { "ping": { "content": "pf:1" } },
        { "ping": { "content": "ps:2" } },
        {
            "thread": {
                "thread": params.thread_id,
                "version": "20090904",
                "fork": 0,
                "language": 0,
                "user_id": params.user_id,
                "force_184": flparams.force_184,
                "with_global": 1,
                "scores": 1,
                "nicoru": 0,
                "threadkey": flparams.threadkey
            }
        },
        { "ping": { "content": "pf:2" } },
        { "ping": { "content": "ps:3" } },
        {
            "thread_leaves": {
                "thread": params.thread_id,
                "language": 0,
                "user_id": params.user_id,
                "content": "0-" + Math.ceil(params.duration / 60) + ":100,100",
                "scores": 1,
                "nicoru": 0,
                "force_184": flparams.force_184,
                "threadkey": flparams.threadkey
            }
        },
        { "ping": { "content": "pf:3" } },
        {
            "ping": { "content": "rf:0" }
        }
    ]);
}
