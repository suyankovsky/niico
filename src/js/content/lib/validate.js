/*
    渡された文字列を判定する
*/

export default class {
    // ニコニコ動画のwatchページのURLである
    static isWatchUri(string) {
        const re = /(^\/watch\/)|(^watch\/)|(^(http(s?):)?\/\/www\.nicovideo\.jp\/watch\/)/;
        return re.test(string) ? true : false;
    }

    // ニコニ広告のURLである
    static isNicoAdUri(string) {
        const re = /^http(s?):\/\/api\.nicoad\.nicovideo\.jp/;
        return re.test(string) ? true : false;
    }

    // 同期遷移する有効なURLである（JSやアンカーリンクではない）
    static isValidUri(string) {
        if(!string) return false;

        if(string ==='#') return false;

        if(/^javascript:/.test(string)) return false;

        return true;
    }

    // form部品のタグ名である
    static isFormPartsTagName(tag_name) {
        const pattern = 'form|label|input|button|select|datalist|optgroup|option|textarea|keygen|output|progress|meter|fieldset|legend';
        const flags = 'ig';
        const re = new RegExp(pattern, flags);

        return re.test(tag_name);
    }
}
