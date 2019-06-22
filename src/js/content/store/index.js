import Vue from 'vue';
import Vuex from 'vuex';

import videos from 'js/content/store/modules/videos.js';
import status from 'js/content/store/modules/status.js';
import setting from 'js/content/store/modules/setting.js';
import comments from 'js/content/store/modules/comments.js';
import viewerMylist from 'js/content/store/modules/viewer-mylist.js';
import logs from 'js/content/store/modules/logs.js';
import uploaders from 'js/content/store/modules/uploaders.js';
import publicMylist from 'js/content/store/modules/public-mylist.js';
import nicorepo from 'js/content/store/modules/nicorepo.js';
import viewerHistory from 'js/content/store/modules/viewer-history.js';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        videos,
        status,
        setting,
        comments,
        viewerMylist,
        logs,
        uploaders,
        publicMylist,
        nicorepo,
        viewerHistory,
    },
})
