// 視聴者のマイリスト一覧の取得、マイリスト登録などを行う

import ajaxApi from 'js/content/lib/ajax-api.js';

const default_mylist = {
    name: 'とりあえずマイリスト',
    id: 'default',
    isPublic: false,
    icon: 0,
};

const state = {
    items: [],
    score: null,
    token: null,
};

const getters = {
    selected_mylist_name: (state, getters, rootState) => {
        const selected_mylist_id = rootState.setting.selected_mylist_id;
        if(!selected_mylist_id) return false;

        let name;
        state.items.some(
            item => {
                const is_selected = item.id == selected_mylist_id;
                if(is_selected) {
                    name = item.name;
                }
                return is_selected;
            }
        );
        return name;
    },
};

const mutations = {
    setToken: (state, token) => {
        state.token = token;
    },
    setScore: (state, score) => {
        state.score = score;
    },
    setMylistGroup: (state, group) => {
        state.items = [default_mylist];
        group.forEach(mylist => {
            state.items.push(mylist);
        })
    },
}

const actions = {
    getViewerMylistgroup: ({commit, state, getters, rootGetters}, thread_id) => {
        const is_loggedin = rootGetters['status/is_loggedin'];
        if(!is_loggedin) return;

        ajaxApi.getViewerMylistgroup(thread_id).then(
            data => {
                commit('setMylistGroup', data.mylists);
                commit('setScore', data.score);
            }
        );
    },
    addMylist: ({commit, state, rootState}) => {
        const video_id = rootState.status.active_video_id;
        const video = rootState.videos.items[video_id];
        const use_thread_id = video.use_thread_id;
        const selected_mylist_id = rootState.setting.selected_mylist_id;

        if(selected_mylist_id === default_mylist.id) {
            ajaxApi.addDefaultMylist(video_id, video.csrfToken);
        } else {
            const token = new Promise((resolve) => {
                if(state.token) {
                    resolve(state.token);
                } else {
                    ajaxApi.getMylistToken().then(
                        token => {
                            commit('setToken', token);
                            resolve(token);
                        }
                    );
                }
            });

            token.then(
                token => {
                    ajaxApi.addMylist(
                        selected_mylist_id,
                        use_thread_id,
                        token,
                        state.score,
                    );
                }
            )

        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}
