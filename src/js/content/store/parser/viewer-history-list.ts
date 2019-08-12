import Moment from 'moment';
import FormatHelper from 'js/content/lib/format-helper.ts';

export default class {
    constructor(items) {
        return items.map(v => {
            return {
                id: v.item_id,
                thumbnail_url: v.thumbnail_url,
                title: v.title,
                length_in_seconds: FormatHelper.convertPlayTimeToSeconds(v.length),
                posted_date: null,
                view_count: null,
                comment_count: null,
                mylist_count: null,
                watch_count: v.watch_count,
            }
        })
    }
}
