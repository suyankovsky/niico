// 投稿者の投稿動画一覧がxmlしかなかったのでパースする

// xmlをjsonに変換するライブラリを試したが、
// いろいろ手直ししないと使いづらいので結局jQueryでゴリゴリ書いた

import $ from 'jquery';
import Moment from 'moment';
import ParseVideoId from 'js/content/lib/parse-video-id.ts';
import FormatHelper from 'js/content/lib/format-helper.ts';

export default class {
    constructor(html) {
        const $html = $($.parseHTML(html));

        const posted_video_list = [];

        $html.find('.item').each((index, el) => {
            posted_video_list.push(
                this.parseIndividualPostedVideo(el)
            );
        });

        const posted_video_all_count = $html.find('header .count var').text();

        return {
            posted_video_list,
            posted_video_all_count,
        };
    }

    // 動画ごとのパース処理...つらい／(^o^)＼
    parseIndividualPostedVideo(el) {
        const $v = $(el);

        const href = $v.find('.thumb_video').attr('href');
        const length_in_seconds = $v.find('.thumb_video .length').text();
        const thumbnail_url = $v.find('.thumb_video img').attr('data-original');
        const title = $v.find('.title a').text();
        const upload_time = $v.find('time var').attr('title');
        const view_counter = $v.find('.counts .view var').text();
        const num_res = $v.find('.counts .comment var').text();
        const mylist_counter = $v.find('.counts .mylist var').text();

        return {
            id: ParseVideoId.byString(href),
            title,
            length_in_seconds: this.computeSeconds(length_in_seconds),
            thumbnail_url,
            upload_time: new Moment(upload_time, 'YYYY/MM/DD HH:mm').format(),
            view_counter: parseInt(view_counter.replace(',', '')),
            num_res: parseInt(num_res.replace(',', '')),
            mylist_counter: parseInt(mylist_counter.replace(',', '')),

        }
    }

    computeSeconds(s) {
        return FormatHelper.convertPlayTimeToSeconds(s);
    }

    // パースしたいプロパティ名の配列
    getParseVideoPropertyNames() {
        return [
            'id',
            'deleted',
            'title',
            'length_in_seconds',
            'thumbnail_url',
            'upload_time',
            'first_retrieve',
            'default_thread',
            'view_counter',
            'mylist_counter',
            'option_flag_community',
            'option_flag_nicowari',
            'option_flag_live_play',
            'option_flag_middle_thumbnail',
            'vita_playable',
            'community_id',
            'ppv_video',
            'permission',
            'provider_type',
        ];
    }
}
