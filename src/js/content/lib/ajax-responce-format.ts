import $ from 'jquery';

export default class {
    static video(responce) {
        let parsed_data;

        try {
            const $responce = $(responce);
            const api_data = $responce.filter('#js-initial-watch-data').attr('data-api-data');
            parsed_data = JSON.parse(api_data);
        } catch(e) {
            console.error('動画情報のパースに失敗しました: ' + e);
            return e;
        }

        return parsed_data;
    }

    static comments(responce) {
        return responce.filter(comment => {
            return comment && comment.chat && comment.chat.content;
        }).map(comment => {
            comment.chat.vpos = comment.chat.vpos/100; // 秒にする
            return comment.chat;
        }).sort((a, b) => {
            if(a.vpos<b.vpos) return -1;
            if(a.vpos>b.vpos) return 1;
            return 0;
        });
    }

    static threadKey(responce) {
        const param_array = responce.split('&');
        let return_param_array = {};
        for(let i=0;i<param_array.length;i++) {
            let key_value = (param_array[i]).split('=');
            return_param_array[key_value[0]] = decodeURIComponent(key_value[1]);
        }
        return return_param_array;
    }
}
