/*
    Chrome拡張のクロスオリジン制約がbackground側だと緩めてあるのでこちらで実行
*/

import $ from 'jquery';
import misc from 'js/content/lib/misc.ts';

export default class {
    static ajaxExecute(params, request_id, sender) {
        return $.ajax(params).then(
            responce => {
                this.sendMessage(responce, request_id, sender);
            },
            error => {
                console.error({
                    type: 'AJAX_ERROR',
                    request: params,
                    responce: error,
                });
                this.sendMessage(error, request_id, sender);
            }
        );
    }

    static sendMessage(responce, request_id, sender) {
        chrome.tabs.sendMessage(sender.tab.id, {
            key: 'ajaxResponce',
            responce,
            request_id,
        });
    }
}
