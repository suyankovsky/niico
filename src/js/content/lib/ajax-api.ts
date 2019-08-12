/*
    外部APIへajaxするときに使う
    レスポンスをちょっと加工してたりする
*/

import $ from 'jquery';
import ajaxResponceFormat from 'js/content/lib/ajax-responce-format.ts';
import UploaderPostedVideolist from 'js/content/store/parser/uploader-posted-video-list.ts';
import ChannelPostedVideoList from 'js/content/store/parser/channel-posted-video-list.ts';
import misc from 'js/content/lib/misc.ts';

export default class {
    static ajaxApi(params): Promise<any> {
        return new Promise((resolve) => {
            // 識別のためにIDを振り分ける
            const request_id = params.url + Date.now();

            chrome.runtime.sendMessage({
                key: 'ajaxRequest',
                params: params,
                request_id,
            });

            chrome.runtime.onMessage.addListener(
                message => {
                    if (message.key !== 'ajaxResponce') return;
                    if (message.request_id !== request_id) return;

                    resolve(message.responce);
                }
            )
        });
    }

    static getVideoDetail(video_id: string): Promise<any> {
        return this.ajaxApi({
            url: 'https://www.nicovideo.jp/watch/' + video_id,
            contentType: 'text/html',
        }).then(
            res => {
                misc.pushLog('SUCCESS_GET_WATCH', {
                    video_id,
                });

                const $res = $(res);
                const api_data = $res.filter('#js-initial-watch-data').attr('data-api-data');

                if (api_data) {
                    return {
                        api_data: JSON.parse(api_data),
                        html: res,
                    };
                }

                misc.pushLog('ERROR_PARSE_VIDEO_DATA', {
                    video_id,
                });

                return {
                    api_data: null,
                    html: res,
                }
            },
            error => {
                misc.pushLog('ERROR_GET_WATCH', {
                    video_id,
                });
                return error;
            }
        );
    }

    static getThreadKey(thread_id: number) {
        return this.ajaxApi({
            url: 'https://flapi.nicovideo.jp/api/getthreadkey?thread=' + thread_id,
        }).then(
            responce => {
                return ajaxResponceFormat.threadKey(responce);
            }
        ).then(
            res => {
                misc.pushLog('SUCCESS_GET_THREAD_KEY', {
                    thread_id,
                });
                return res;
            },
            err => {
                misc.pushLog('ERROR_GET_THREAD_KEY', {
                    thread_id,
                });
                return err;
            }
        );
    }

    static getCommentDetail(params) {
        if (!params) return false;
        const thread_id = JSON.parse(params)[2].thread.thread;

        return this.ajaxApi({
            url: 'https://nmsg.nicovideo.jp/api.json/',
            type: 'POST',
            data: params,
            dataType: 'json',
            contentType: 'application/json'
        }).then(
            responce => {
                return ajaxResponceFormat.comments(responce);
            }
        ).then(
            res => {
                misc.pushLog('SUCCESS_GET_COMMENT', {
                    thread_id,
                });
                return res;
            },
            err => {
                misc.pushLog('ERROR_GET_COMMENT', {
                    thread_id,
                    error_id: 0,
                });
                return err;
            }
        );
    }

    static getUserDetail(user_id) {
        if (!user_id) return false;

        return this.ajaxApi({
            url: 'https://api.ce.nicovideo.jp/api/v1/user.info',
            type: 'GET',
            data: {
                user_id,
            },
        }).then(
            res => {
                misc.pushLog('SUCCESS_GET_USER_DETAIL', {
                    user_id,
                });
                return res;
            },
            err => {
                misc.pushLog('ERROR_GET_USER_DETAIL', {
                    user_id,
                });
                return err;
            }
        );
    }

    static getUserPostedVideoDetail(user_id, page = 1) {
        if (!user_id) return false;

        return this.ajaxApi({
            url: 'https://api.ce.nicovideo.jp/nicoapi/v1/user.myvideo',
            type: 'GET',
            data: {
                user_id,
                from: (page - 1) * 100,
            },

            // xmlにするとうまくデータが受け取れない
            // sendMessageに何か制約があるっぽいがわからなかった
            dataType: 'text',
        }).then(
            xml => {
                return new UploaderPostedVideolist(xml);
            }
        ).then(
            res => {
                misc.pushLog('SUCCESS_GET_USER_POSTED_VIDEO', {
                    user_id,
                    page,
                });
                return res;
            },
            err => {
                misc.pushLog('ERROR_GET_USER_POSTED_VIDEO', {
                    user_id,
                    page,
                });
                return err;
            }
        );
    }

    static getChannelPostedVideoDetail(channel_id, page = 1) {
        if (!channel_id) return false;

        return this.ajaxApi({
            url: `https://ch.nicovideo.jp/ch${channel_id}/video`,
            type: 'GET',
            data: {
                //rss: '2.0',
                page,
                order: 'd',
                sort: 'f',
            },
            dataType: 'text',
        }).then(
            html => {
                return new ChannelPostedVideoList(html);
            }
        ).then(
            res => {
                misc.pushLog('SUCCESS_GET_CHANNEL_POSTED_VIDEO', {
                    channel_id,
                    page,
                });
                return res;
            },
            err => {
                misc.pushLog('ERROR_GET_CHANNEL_POSTED_VIDEO', {
                    channel_id,
                    page,
                });
                return err;
            }
        );
    }

    // 任意のユーザーの公開マイリストの一覧を取得
    static getUserMylistGroupDetail(user_id: number) {
        return this.ajaxApi({
            url: 'https://api.ce.nicovideo.jp/nicoapi/v1/mylistgroup.get',
            type: 'GET',
            data: {
                user_id,
                //detail: 0,
            },
            dataType: 'text',
        }).then(
            res => {
                misc.pushLog('SUCCESS_GET_USER_MYLIST_GROUP_LIST', {
                    user_id,
                });
                return res;
            },
            err => {
                misc.pushLog('ERROR_GET_USER_MYLIST_GROUP_LIST', {
                    user_id,
                });
                return err;
            }
        );
    }

    // 任意のIDのマイリストの詳細を取得
    static getPublicMylistDetail(mylist_id: number) {
        return this.ajaxApi({
            url: 'https://www.nicovideo.jp/mylist/' + mylist_id,
            type: 'GET',
            data: {
                //rss: '2.0',
            },
            dataType: 'text',
        }).then(
            res => {
                misc.pushLog('SUCCESS_GET_MYLIST_DETAIL', {
                    mylist_id,
                });
                return res;
            },
            err => {
                misc.pushLog('ERROR_GET_MYLIST_DETAIL', {
                    mylist_id,
                });
                return err;
            }
        );
    }

    static getMylistToken() {
        return this.ajaxApi({
            url: 'https://www.nicovideo.jp/my/mylist',
            type: 'GET',
        }).then(
            responce => {
                const result = responce.match(/NicoAPI\.token\s*?=\s*["']([0-9a-z-]+)["']/);
                return result && result[1] ? result[1] : false;
            }
        )
    }

    // 視聴者のマイリスト一覧を取得する
    static getViewerMylistgroup(thread_id: string): Promise<any> {
        return this.ajaxApi({
            //url: 'https://www.nicovideo.jp/api/mylistgroup/list',
            url: 'https://flapi.nicovideo.jp/api/watch/mylists',
            type: 'GET',
            data: {
                thread_id,
            },
            dataType: 'json',
        }).then(
            responce => {
                if (responce && responce.meta && responce.meta.status == 200) {
                    misc.pushLog('SUCCESS_LOAD_VIEWER_MYLIST_GROUP', {
                        thread_id,
                    });
                    return responce.data;
                } else {
                    console.error(responce);
                }
            },
            error => {
                misc.pushLog('ERROR_LOAD_VIEWER_MYLIST_GROUP');
                return error;
            }
        )
    }

    static addMylist(group_id, item_id, token, item_amc) {
        return this.ajaxApi({
            url: 'https://www.nicovideo.jp/api/mylist/add',
            type: 'POST',
            data: {
                group_id,
                item_type: 0,//たぶん0が動画でしょ（適当）
                item_id,
                description: '',
                token,
                item_amc,
            },
            dataType: 'json',
        }).then(
            responce => {
                if (responce.status == 'ok') {
                    misc.pushLog('SUCCESS_ADD_SOME_MYLIST', {
                        item_id,
                        group_id,
                        responce,
                    });
                } else {
                    misc.pushLog('ERROR_ADD_SOME_MYLIST', {
                        item_id,
                        group_id,
                        error: responce,
                        supplement: responce.error.description,
                    });
                    console.error(responce);
                }
            },
            error => {
                misc.pushLog('ERROR_ADD_SOME_MYLIST', {
                    item_id,
                    group_id,
                    error,
                    supplement: error.error.description,
                });
            }
        )
    }

    static addDefaultMylist(item_id, token) {
        return this.ajaxApi({
            url: 'https://www.nicovideo.jp/api/deflist/add',
            type: 'POST',
            data: {
                item_id,
                token,
            },
            dataType: 'json',
        }).then(
            message => {
                if (message.status == "ok") {
                    misc.pushLog('SUCCESS_ADD_DEFAULT_MYLIST', {
                        item_id,
                        message,
                    });
                } else {
                    misc.pushLog('ERROR_ADD_DEFAULT_MYLIST', {
                        item_id,
                        message,
                        supplement: message.error.description,
                    });
                    console.error(message);
                }
                return message;
            },
            message => {
                misc.pushLog('ERROR_ADD_DEFAULT_MYLIST', {
                    item_id,
                    message,
                    supplement: message.error.description,
                });
                console.error(message);
                return message;
            }
        )
    }

    static getNicorepo(cursor) {
        return this.ajaxApi({
            url: 'https://www.nicovideo.jp/api/nicorepo/timeline/my/all',
            type: 'GET',
            data: {
                client_app: 'pc_myrepo',
                attribute_filter: 'upload',
                object_filter: 'video',
                cursor,
            },
            dataType: 'json',
        }).then(
            res => {
                misc.pushLog('SUCCESS_GET_NICOREPO', {
                    cursor,
                });
                return res;
            },
            err => {
                misc.pushLog('ERROR_GET_NICOREPO', {
                    cursor,
                });
                return err;
            }
        );
    }

    static getViewerHistory() {
        return this.ajaxApi({
            url: 'https://www.nicovideo.jp/api/videoviewhistory/list',
            type: 'GET',
            dataType: 'json',
        }).then(
            res => {
                misc.pushLog('SUCCESS_LOAD_VIEWER_HISTORY', {});
                return res;
            },
            err => {
                misc.pushLog('ERROR_LOAD_VIEWER_HISTORY', {});
                return err;
            }
        );
    }
}
