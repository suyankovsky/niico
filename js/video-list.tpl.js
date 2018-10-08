Vue.component('video-list', {
    props: ['video'],
    template: `<div class="video-list">
        <div class="video-list__posted" v-if="video.posted">{{video.posted}}</div>
        <div class="video-list__thumbnail">
            <a :href="'http://www.nicovideo.jp/watch/'+video.video_id">
                <img :src="video.thumbnail_url">
                <span>{{video.duration}}</span>
            </a>
        </div>
        <div class="video-list__title">
            <a :href="'http://www.nicovideo.jp/watch/'+video.video_id">
                {{video.title}}
            </a></div>
        <div class="video-list__detail">
            <dl v-if="video.view">
                <dt>再生</dt>
                <dd>{{video.view}}</dd>
            </dl>
            <dl v-if="video.comment">
                <dt>コメ</dt>
                <dd>{{video.comment}}</dd>
            </dl>
            <dl v-if="video.mylist">
                <dt>マイ</dt>
                <dd>{{video.mylist}}</dd>
            </dl>
        </div>
    </div>`,
});
