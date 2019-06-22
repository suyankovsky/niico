import VideoDetailPanel from 'js/content/components/panels/video-detail-panel.vue';
import CommentPanel from 'js/content/components/panels/comment-panel.vue';
import DebugPanel from 'js/content/components/panels/debug-panel.vue';
import LogsPanel from 'js/content/components/panels/logs-panel.vue';
import UploaderPanel from 'js/content/components/panels/uploader-panel.vue';
import NicoRepoPanel from 'js/content/components/panels/nicorepo.vue';
import HisotryPanel from 'js/content/components/panels/history.vue';
import AboutPanel from 'js/content/components/panels/about.vue';

export default {
    components: {
        'VideoDetailPanel': {
            heading: '動画情報',
            component: VideoDetailPanel
        },
        'CommentPanel' : {
            heading: 'コメント',
            component: CommentPanel,
        },
        'PostedVideoPanel': {
            heading: '投稿者',
            component: UploaderPanel,
        },
        'NicoRepoPanel': {
            heading: 'ニコレポ',
            component: NicoRepoPanel,
        },
        'HisotryPanel': {
            heading: '視聴履歴',
            component: HisotryPanel,
        },
        'DebugPanel': {
            heading: 'デバッグ',
            component: DebugPanel,
        },
        'LogsPanel': {
            heading: 'ログ',
            component: LogsPanel,
        },
        'AboutPanel': {
            heading: 'About',
            component: AboutPanel,
        }
    },
    getMap: function() {
        const map = {};
        Object.keys(this.components).forEach(key => {
            map[key] = this.components[key]['component'];
        })
        return map;
    }
};
