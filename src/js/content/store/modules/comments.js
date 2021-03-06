import $ from 'jquery';
import Vue from 'vue';
import ajaxApi from 'js/content/lib/ajax-api.js';
import ajaxCommentsPrepare from 'js/content/lib/ajax-comments-prepare.js';

const state = {
    items: {},
};

const getters = {
    thread: (state, getters, rootState) => {
        const active_video_id = rootState.status.active_video_id;
        if(!state.items.hasOwnProperty(active_video_id)) return -1;
        const thread = state.items[active_video_id];

        if(!thread) return -2;
        if(thread == 'loading') return -3;
        if(thread == 'error') return -4;
        if(!Array.isArray(thread)) return -5;

        return thread.sort(function(a, b) {
            if(a.vpos<b.vpos) return -1;
            if(a.vpos > b.vpos) return 1;
            return 0;
        });
    },
    comments: (state, getters, rootState) => {
        const thread = getters.thread;
        if(thread < 0) return thread;

        const comment_sort_by = rootState.setting.comment_sort_by;
        if(!comment_sort_by) return thread;

        const sort_by = String(comment_sort_by).split('_');
        let key = sort_by[0];
        let order = sort_by[1];
        if(!key || !order) return thread;

        return thread.sort(function(a, b) {
            let tmp;

            if(a[key]<b[key]) tmp = -1;
            if(a[key] > b[key]) tmp = 1;

            if(order == 'desc') return tmp * -1;
            if(order == 'asc') return tmp;

            return 0;
        });
    },
    comment_no_to_scroll: (state, getters, rootState) => {
        const thread = getters.thread;
        if(thread < 0) return 0;

        const video = rootState.videos.items[rootState.status.active_video_id];
        if(!video || !video.hasOwnProperty('current_time')) return 0;
        const current_time = video.current_time;

        let target_no = false;
        thread.some((c, index) => {
            if(video.current_time > c.vpos) return false;

            target_no = c.no;
            return true;
        });

        return target_no;
    },

};

const mutations = {
    initializeComments: (state, {video_id}) => {
        Vue.set(state.items, video_id, 'loading');
    },
    loadSuccessComments: (state, {video_id, comments}) => {
        Vue.set(state.items, video_id, comments);
    },
    loadErrorComments: (state, {video_id, error}) => {
        Vue.set(state.items, video_id, 'error');
    },
}

const actions = {
    addComments: ({commit, state, getters, rootState}, video_id) => {
        return new Promise((resolve) => {
            const original_data = rootState.videos.items[video_id].original_data;
            if(!original_data) {
                console.error('Failed read video original data');
                return false;
            }
            commit('initializeComments', {video_id});

            const request_params = ajaxCommentsPrepare.genRequestParams(original_data);

            const comments = request_params.then(
                request_params => {
                    return ajaxApi.getCommentDetail(request_params)
                },
            );

            comments.then(
                comments => {
                    commit('loadSuccessComments', {
                        video_id,
                        comments,
                    });
                    resolve(true);
                },
                error => {
                    commit('loadErrorComments', {
                        video_id,
                        comments: error,
                    });
                    resolve(false);
                }
            )
        })
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}
