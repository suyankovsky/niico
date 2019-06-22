import Moment from 'moment';

export default class {
    static padZero(v) {
        if(v == 0) {
            return '00';
        } else if(v < 10 && v > 0) {
            return '0' + v;
        }

        return v;
    }

    // 秒数を再生時間表記にする
    // '1440' -> '24:00'
    static convertSecondsToPlayTime(t) {
        if(!t) return '0:00';

        const computed = {
            h: t / 3600 | 0,
            m: t % 3600 / 60 | 0,
            s: Math.floor(t % 60) | 0,
        };

        const padded = {
            m: this.padZero(computed.m),
            s: this.padZero(computed.s),
        };

        if(!computed.h) {
            // 1時間以内の動画は「分」をゼロ埋めしない
            return `${computed.m}:${padded.s}`;
        } else if(computed.h) {
            return `${computed.h}:${padded.m}:${padded.s}`;
        }
    }

    // 再生時間表記を秒数に直す
    // '24:00' -> '1440'
    static convertPlayTimeToSeconds(s) {
        const is_valid = String(s).match(/[^0-9:]+/g) == null;
        if(!is_valid) return false;

        const arr = String(s).split(':').reverse();
        if(!arr.length) return s;

        let val = 0;
        arr.forEach(
            (item, index) => {
                val += item * Math.pow(60, index);
            }
        );

        return val;
    }

    static separateByComma(raw_num) {
        const num = parseInt(raw_num);
        return String(num).replace(/^(-?\d+)(\d{3})/g, '$1,$2');
    }

    static roundedNumer(raw_num) {
        const num = parseInt(raw_num);

        const unit = {
            // 1万
            man: 10000,

            // 1億
            oku: 100000000,

            // 1兆
            cho: 1000000000000,

        }

        // 1万まで
        if(num < unit.man) {
            return this.separateByComma(num);
        }

        // 1000万まで（101.1万とか）
        if(num < unit.oku /10) {
            return Math.round(num / unit.man*10)/10 + '万';
        }

        // 1億まで
        if(num < unit.oku) {
            return this.separateByComma(Math.round(num / unit.man)) + '万';
        }

        // 1000億まで
        if(num < unit.cho /10) {
            return Math.round(num / unit.oku*10)/10 + '億';
        }

        // 1兆まで
        //if(num < unit.cho) {
        return this.separateByComma(Math.round(num / unit.oku)) + '億';
        //}

        // 総合ランキングだと数千万
    }

    static relativeDate(datetime) {
        const moment = new Moment(datetime);

        const years = moment.diff(new Moment(), "years") * -1;
        if(years > 0) {
            return `${years}年前`;
        }

        const months = moment.diff(new Moment(), "months") * -1;
        if(months > 0) {
            return `${months}ヶ月前`;
        }

        const weeks = moment.diff(new Moment(), "weeks") * -1;
        if(weeks > 0) {
            return `${weeks}週間前`;
        }

        const days = moment.diff(new Moment(), "days") * -1;
        if(days > 0) {
            return `${days}日前`;
        }

        const hours = moment.diff(new Moment(), "hours") * -1;
        if(hours > 0) {
            return `${hours}時間前`;
        }

        const minutes = moment.diff(new Moment(), "minutes") * -1;
        if(minutes > 0) {
            return `${minutes}分前`;
        }

        return '1分以内';

    }
}
