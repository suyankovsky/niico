'use strict';

// 汎用関数群
// といいながらそこまで使われない
const _utils = {

    // チェックする
    check: {

        // 有効なURLかどうか
        isValidHref: (href) => {
            if(!href) return false;

            if(href ==='#') return false;

            if(/^javascript:/.test(href)) return false;

            return true;
        },

        // stringがwatchページのURLか判定する
        isWatchURI: (string) => {
            return _consts.re.watchURI.test(string) ? true : false;
        },

        // 今いるページがwatchページかどうか判定する
        isWatchPage: () => {
            return _utils.check.isWatchURI(location.pathname) ? true : false;
        },

        // stringがニコニ広告のURLか判定する
        isNicoAdURI: (string) => {
            return _consts.re.nicoAdURI.test(string) ? true : false;
        },

    },

    // videoIdを取得するための関数たち
    parseVideoId: {

        // Stringから取得
        byString: (string) => {
            let match = string.match(_consts.re.parseVideoId);
            return match ? match[0] : false;
        },

        // ニコニ広告のjQueryリンクオブジェクトから無理やりIDを引っ張る
        byNicoAdAnchor: ($anchor) => {
            let string = $anchor.find('.thumb').attr('src');
            return 'sm'+(string.match(_consts.re.parseideoIdNicoAd))[1];
        },

        // 今いるURLから取得
        byPathname: () => {
            let path_array = String(location.pathname).split('\/');
            if(path_array[1] != 'watch' && !path_array[2]) return false
            return _utils.parseVideoId.byString(location.pathname);
        },

    },

    // 何かをパースする
    parseAPI: {

        getflv: (data) => {
            let param_array = data.split('&');
            let return_param_array = {};
            for(let i=0;i<param_array.length;i++) {
                let key_value = (param_array[i]).split('=');
                return_param_array[key_value[0]] = decodeURIComponent(key_value[1]);
            }
            return return_param_array;
        },

    },

    // フォーマッタ
    format: {
        date: (string = '', format = '') => {
            let date = string ? new Date(string) : new Date();

            let y = date.getFullYear(),
                m = ('00' + (date.getMonth()+1)).slice(-2),
                d = ('00' + date.getDate()).slice(-2),
                h = ('00' + date.getHours()).slice(-2),
                s = ('00' + date.getMinutes()).slice(-2),
                b = ('00' + date.getSeconds()).slice(-2);

            let result = y + '/' + m + '/' + d + ' ' + h + ':' + s;
            if(format) {
                result = h + ':' + s + ':' + b;
            }
            return result;
        },

        // チャンネル動画の投稿時間パース用
        // stringのサンプル '2018年07月12日 11：02：03'
        channelDate: (string = '') => {
            if(!string) return 0;
            let date = string.match(_consts.re.channel.scrapeOffPostedDate);

            let y = date[1];
            let m = date[2];
            let d = date[3];
            let h = date[4];
            let s = date[5];

            let result = y + '/' + m + '/' + d + ' ' + h + ':' + s;
            return result;

        },

        number: (str) => {
            var num = new String(str).replace(/,/g, '');
            while(num != (num = num.replace(/^(-?\d+)(\d{3})/, '$1,$2')));
            return num;
        },
        time: (t) => {

            let padZero = (v) => {
                if (v < 10) {
                    return '0' + v;
                } else {
                    return v;
                }
            }

            var hms = '';
            var h = t / 3600 | 0;
            var m = t % 3600 / 60 | 0;
            var s = t % 60;

            if (h != 0) {
                hms = h + ':' + padZero(m) + ':' + padZero(s) ;
            } else if (m != 0) {
                hms = m + ':' + padZero(s) ;
            } else {
                hms = '0:' + padZero(s);
            }
            return hms;
        },
    },

};
