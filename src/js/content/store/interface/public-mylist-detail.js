import $ from 'jquery';
import Moment from 'moment';

export default class {
    // ソース上のJavascriptを正規表現でめっちゃ無理やり抜き出す
    constructor(text) {
        const result = String(text).match(/Mylist\.preload\([0-9]+?\,\s+?(\[\{.*\}\])\)\;/);
        const json = JSON.parse(result[1]);
        const shaped = this.shape(json);

        return this.sort(shaped);
    }

    // 抜き出したjsonを使いやすいように整形する
    shape(json) {
        return json.map(
            (item, index, array) => {
                // たぶん0が動画。静画が5ってどこかで読んだ。
                if(item.item_type != 0) return;

                const d = item.item_data;

                return {
                    id: d.video_id,
                    deleted: d.deleted,
                    title: d.title,
                    length_in_seconds: d.length_seconds,
                    thumbnail_url: String(d.thumbnail_url).replace(/http(s?):/, ''),
                    register_time: new Date( parseInt(d.update_time) * 1000 ),
                    first_retrieve: d.first_retrieve,
                    view_counter: d.view_counter,
                    mylist_counter: d.mylist_counter,
                    num_res: d.num_res,
                    original_data: d,
                };

            }
        )
    }

    sort(list, key= 'register_time', is_asc = true) {
        return list.sort((a,b) => {
            const a_val = Moment(a[key]).unix();
            const b_val = Moment(b[key]).unix();

            if(a_val<b_val) return 1;
            if(a_val>b_val) return -1;

            return tmp = 0;
        });
    }
}
