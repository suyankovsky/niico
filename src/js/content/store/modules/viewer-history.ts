// 公開マイリスト

import Vue from 'vue';
import ajaxApi from 'js/content/lib/ajax-api.ts';
import ViewerHistoryList from 'js/content/store/parser/viewer-history-list.ts';

const state = {
    items: [],
    token: null,
    is_loaded: false,
    error_count: 0,
};

const getters = {
    histories: (state, getters, rootState, rootGetters) => {
        if (!rootGetters['status/is_loggedin']) {
            return {
                code: -4,
                content: 'ログインしてください。',
            };
        }

        if (!state.is_loaded) {
            return {
                code: -1,
                content: '読み込み中です。',
            };
        }

        if (state.error_count > 0) {
            return {
                code: -2,
                content: 'エラーが発生しました。',
            };
        }

        if (state.items.length == 0) {
            return {
                code: -3,
                content: '視聴履歴がありません。',
            };
        }

        return {
            code: 1,
            content: state.items,
        };
    },
};

const mutations = {
    add: (state, items) => {
        state.items.push(...items);
    },
    setToken: (state, token) => {
        state.token = token;
        state.is_loaded = true;
    },
    onError: (state) => {
        state.error_count++;
    },
}

const actions = {
    load: ({ commit, state }) => {
        ajaxApi.getViewerHistory().then(
            res => {
                if (res.status == 'ok') {
                    const items = new ViewerHistoryList(res.history);
                    commit('setToken', res.token);
                    commit('add', items);
                } else {
                    commit('onError');
                }
            },
            error => {
                commit('onError');
            }
        );
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}
