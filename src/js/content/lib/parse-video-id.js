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

    // ニコニ広告のリンクから抜き出す
    static byNicoAdAnchor($anchor) {
        // 正規表現で無理やり抜き出す
        const re = /thumbnails\/([0-9]+)\//;
        const str = $anchor.html();
        const result = str.match(re);
        if(result && result.length > 1) return result[1];

        // idが抜けなかったらログ出すけど遷移しちゃうから意味ないんだよもん
        misc.pushLog('ERROR_PARSE_NICOAD_VIDEO_ID');
        return false;
    }

    // リンク（jQueryオブジェクト）から抜き出す
    static byAnchor($anchor) {
        if(!$anchor) return false;

        const string = $anchor.attr('href');

        if( !Validate.isValidUri(string) ) return false;

        if(Validate.isWatchUri(string)) {
            return this.byString(string);
        } else if(Validate.isNicoAdUri(string)) {
            const result = this.byNicoAdAnchor($anchor);

            // smじゃなかったらしぬけどしらなーい（ヘッタクソな絵）
            if(result) return 'sm' + result;
        }

        return false;
    }
}
