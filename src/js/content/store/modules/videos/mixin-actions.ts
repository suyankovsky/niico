import misc from 'js/content/lib/misc.ts';

export default {
    openNicoVideo: ({ commit, rootState }) => {
        const video_id = rootState.status.active_video_id;
        window.open('//www.nicovideo.jp/watch/' + video_id);
    },
    openTweet: ({ commit, state, rootState }) => {
        const video_id = rootState.status.active_video_id;
        const title = state.items[video_id].title;

        let hashtags = video_id + ',ニコニコ動画';
        if (rootState.setting.is_append_hashtag_niico_on_tweet) {
            hashtags += ',niico';
        }

        const params = {
            url: 'http://nico.ms/' + video_id + '?ref=twitter',
            hashtags: hashtags,
            text: title,
        }

        let href = "https://twitter.com/share?";
        Object.keys(params).forEach(function (key) {
            href += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&';
        });

        window.open(href);
    },
}
