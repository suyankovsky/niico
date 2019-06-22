/*
    video_idをパースする
*/

import Validate from 'js/content/lib/validate.js';
import misc from 'js/content/lib/misc.js';

export default class {
    // 文字列から抜き出す
    static byString (string){
        // なぜか肯定後読みがlint通らないので遠回り
        //const match = string.match(/(?<=watch\/)(sm|so|nm)?([0-9]+)/);

        // smとかがつかないパターンもあるのでwatchごとmatchです
        const match = string.match(/watch\/(sm|so|nm)?([0-9]+)/);
        if(!match) return false
        const splited = String(match[0]).split('\/');

        return splited[1];
    }

    // 現在いるページのURLから抜き出す
    static byPathName() {
        const path_array = String(location.pathname).split('\/');

        if(path_array[1] != 'watch' && !path_array[2]) return false;

        return this.byString(location.pathname);
    }

    // ニコニ広告のリンク（jQueryオブジェクト）から抜き出す
    static byNicoAdAnchor($anchor) {
        // サムネのURLから無理やり抜くので動かないパターンありそう
        const src = $anchor.find('.thumb').attr('src');
        const re = /\/\/tn\.smilevideo\.jp\/smile\?i=([0-9]+)\./;
        const video_id = (src.match(re))[1];

        if(!video_id) {
            misc.pushLog('ERROR_PARSE_NICOAD_VIDEO_ID');
            return false;
        }

        // smじゃなかったらしぬけどしらなーい
        return 'sm' + video_id;
    }

    // リンク（jQueryオブジェクト）から抜き出す
    static byAnchor($anchor) {
        if(!$anchor) return false;

        const string = $anchor.attr('href');

        if( !Validate.isValidUri(string) ) return false;

        if(Validate.isWatchUri(string)) {
            return this.byString(string);
        } else if(Validate.isNicoAdUri(string)) {
            return this.byNicoAdAnchor($anchor);
        }

        return false;
    }
}
