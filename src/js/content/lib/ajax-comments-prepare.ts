/*
    コメント準備クラス
    コメント取得リクエストパラメータの生成を行う
*/

import ajaxApi from 'js/content/lib/ajax-api.ts';

export default class {
    static genRequestParams(original_data) {
        return new Promise((resolve) => {
            const is_channel = original_data.channel;

            if (is_channel) {
                this.genChannelThreadParam(original_data).then(
                    (request_params) => {
                        resolve(request_params);
                    }
                );
            } else {
                const request_params = this.genDefaultThreadParam(original_data);
                resolve(request_params);
            }
        });
    }

    static genDefaultThreadParam(original_data) {
        const params = {
            thread_id: original_data.thread.ids.default,
            user_id: original_data.viewer.id,
            userkey: original_data.context.userkey,
            l: original_data.video.duration,
        };

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
                    "userkey": params.userkey
                }
            },
            { "ping": { "content": "pf:0" } },
            { "ping": { "content": "ps:1" } },
            {
                "thread_leaves": {
                    "thread": params.thread_id,
                    "language": 0,
                    "user_id": params.user_id,
                    "content": "0-" + Math.ceil(params.l / 60) + ":100,1000",
                    "scores": 1,
                    "nicoru": 0,
                    "userkey": params.userkey
                }
            },
            { "ping": { "content": "pf:1" } },
            { "ping": { "content": "rf:0" } }
        ]);
    }

    static channel_params(params, flparams) {
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
                    "userkey": params.userkey
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
                    "content": "0-" + Math.ceil(params.l / 60) + ":100,100",
                    "scores": 1,
                    "nicoru": 0,
                    "userkey": params.userkey
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
                    "content": "0-" + Math.ceil(params.l / 60) + ":100,100",
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

    static genChannelThreadParam(original_data) {
        const params = {
            user_id: original_data.viewer.id,
            userkey: original_data.context.userkey,
            l: original_data.video.duration,

            thread_id: original_data.video.dmcInfo.thread.thread_id,
            optional_thread_id: original_data.video.dmcInfo.thread.optional_thread_id
        };

        return ajaxApi.getThreadKey(params.thread_id).then(
            done => {
                return this.channel_params(params, done);
            }
        )
    }

}
