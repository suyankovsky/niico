// 投稿者の投稿動画一覧がxmlしかなかったのでパースする

// xmlをjsonに変換するライブラリを試したが、
// いろいろ手直ししないと使いづらいので結局jQueryでゴリゴリ書いた

import $ from 'jquery';

export default class {
    constructor(xml) {
        const posted_video_list = [];

        $(xml).find('video_info').each((index, el) => {
            posted_video_list.push(
                this.parseIndividualPostedVideo(el)
            );
        });

        const posted_video_all_count = $(xml).find('full_count').text();

        return {
            posted_video_list,
            posted_video_all_count,
        };
    }

    // 動画ごとのパース処理
    parseIndividualPostedVideo(el) {
        const return_obj = {};
        const $video = $(el).find('video');
        const $thread = $(el).find('thread');

        this.getParseVideoPropertyNames().forEach((prop_name) => {
            return_obj[prop_name] = $video.find(prop_name).text();
        });

        this.getParseThreadPropertyNames().forEach((prop_name) => {
            return_obj[prop_name] = $thread.find(prop_name).text();
        });

        // mixed content になっちゃうのでhttp:を消しておく
        return_obj['thumbnail_url'] = String(return_obj['thumbnail_url']).replace(/http(s?):/, '')

        return return_obj;
    }

    getParseThreadPropertyNames() {
        return [
            'num_res',
            'summary'
        ];
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
