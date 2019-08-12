// 公開マイリスト

import Vue from 'vue';
import ajaxApi from 'js/content/lib/ajax-api.ts';
import PublicMylistdetail from 'js/content/store/parser/public-mylist-detail.ts'

const state = {
    items: {},
};

const getters = {
    count_mylist_items: (state) => (list_id) => {
        const list = state.items[list_id];
        return Object.keys(list).length;
    },
};

const mutations = {
    addPublicMylist: (state, { list_id, mylist_detail }) => {
        Vue.set(state.items, list_id, mylist_detail);
    },
}

const actions = {
    addPublicMylist: ({ commit, state }, list_id) => {
        if (!list_id) return;

        const is_exist_mylist = state.items.hasOwnProperty(list_id);
        if (is_exist_mylist) return;

        if (list_id == 'posted_video_list') return;

        ajaxApi.getPublicMylistDetail(list_id).then(
            text => {
                commit('addPublicMylist', {
                    list_id,
                    mylist_detail: new PublicMylistdetail(text),
                })
            }
        )
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}
