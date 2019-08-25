import Vue from 'vue';
import Vuex from 'vuex';

import videos from 'js/content/store/modules/videos.ts';
import status from 'js/content/store/modules/status.ts';
import setting from 'js/content/store/modules/setting.ts';
import threads from 'js/content/store/modules/threads';
import viewerMylist from 'js/content/store/modules/viewer-mylist.ts';
import logs from 'js/content/store/modules/logs.ts';
import uploaders from 'js/content/store/modules/uploaders.ts';
import publicMylist from 'js/content/store/modules/public-mylist.ts';
import nicorepo from 'js/content/store/modules/nicorepo.ts';
import viewerHistory from 'js/content/store/modules/viewer-history.ts';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        videos,
        status,
        setting,
        threads,
        viewerMylist,
        logs,
        uploaders,
        publicMylist,
        nicorepo,
        viewerHistory,
    },
})
