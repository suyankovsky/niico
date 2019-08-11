import Vue from 'vue';
import ajaxApi from 'js/content/lib/ajax-api.ts';
import UploaderPublicMylistGroupList from 'js/content/store/interface/uploader-public-mylist-group-list.ts';

const state = {
    items: {},
};

const getters = {
    uploader: (state, getters, rootState) => {
        const active_video_id = rootState.status.active_video_id;
        if (!active_video_id) return -1;

        const current_video = rootState.videos.items[active_video_id];
        if (!current_video) return -2;

        const is_public_user = (
            current_video.hasOwnProperty('uploader')
            && current_video.uploader.hasOwnProperty('id')
            && current_video.uploader.id
        );
        if (!is_public_user) return -3;
        const uploader_id = current_video.uploader.id;

        const is_loaded = state.items.hasOwnProperty(uploader_id);
        if (!is_loaded) return -4;

        return state.items[uploader_id];
    },
    cannot_render_uploader_reason: (state, getters, rootState) => {
        const uploader = getters.uploader;

        if (uploader == -2 || uploader == -1) {
            return {
                code: uploader,
                message: 'エラーです。',
            }
        }

        if (uploader == -3) {
            return {
                code: uploader,
                message: '非公開ユーザーです。',
            }
        }

        if (uploader == -4) {
            return {
                code: uploader,
                message: '読み込み中です。',
            }
        }

        return {
            code: 1,
            message: uploader,
        }
    },
    active_list_id: (state, getters, rootState) => {
        const uploader = getters.uploader;
        if (!uploader || !uploader.active_list_id) {
            return '';
        }

        return uploader.active_list_id;
    },
    selected_video_list_detail: (state, getters, rootState) => {
        const uploader = getters.uploader;
        const active_list_id = getters.active_list_id;

        if (!uploader || !uploader.id) {
            return {
                code: -1,
                content: '非公開ユーザーです。',
            };
        }

        if (!active_list_id) {
            if (!uploader.is_user_my_video_loaded) {
                return {
                    code: -3,
                    content: '読み込み中です。',
                };
            }

            if (uploader.is_channel) {
                return {
                    code: 3,
                    content: getters.posted_video_list,
                    count: getters.posted_video_list.length,
                }
            }

            if (!uploader.is_user_my_video_public) {
                return {
                    code: -2,
                    content: '非公開です。',
                };
            }

            return {
                code: 1,
                content: getters.posted_video_list,
                count: getters.posted_video_list.length,
            };
        } else {
            if (!uploader.is_user_open_list_public) {
                return {
                    code: -4,
                    content: '非公開です。',
                };
            }

            if (!uploader.is_user_open_list_loaded) {
                return {
                    code: -5,
                    content: '読み込み中です。',
                };
            }

            if (!rootState.publicMylist.items.hasOwnProperty(active_list_id)) {
                return {
                    code: -6,
                    content: '読み込み中です。',
                };
            }

            return {
                code: 2,
                content: rootState.publicMylist.items[active_list_id],
                count: Object.keys(rootState.publicMylist.items[active_list_id]).length,
            };
        }
    },
    posted_video_list: (state, getters, rootState) => {
        const uploader = getters.uploader;
        if (!uploader || !uploader.hasOwnProperty('posted_video_list')) return [];

        return uploader.posted_video_list;
    },
    public_mylist_keys: (state, getters, rootState) => {
        const uploader = getters.uploader;
        if (!uploader || !uploader.hasOwnProperty('mylist_group')) return [];

        return uploader.mylist_group;
    },
};

const postedVideoIsLoadedAll = (uploader, posted_video_list) => {
    let max;

    if (uploader.is_channel) {
        max = 20;
    } else {
        max = 100;
    }

    if (posted_video_list.length == max) return false;
    return true;
};

const mutations = {
    addUploader: (state, uploader) => {
        if (!uploader || !uploader.id) return;
        Vue.set(state.items, uploader.id, {
            ...uploader,
            is_user_my_video_loaded: false,
            is_user_open_list_loaded: false,
        });
    },
    addPostedVideoList: (state, { uploader_id, posted_video_list, posted_video_all_count }) => {
        if (!uploader_id) return;

        const posted_video_is_loaded_all = postedVideoIsLoadedAll(state.items[uploader_id], posted_video_list);

        Vue.set(state.items, uploader_id, {
            ...state.items[uploader_id],
            posted_video_list,
            posted_video_all_count,
            posted_video_page_count: 1,
            posted_video_is_loaded_all,
            is_user_my_video_loaded: true,
        });
    },
    pushPostedVideoList: (state, { uploader_id, posted_video_list }) => {
        if (!uploader_id) return;

        const posted_video_is_loaded_all = postedVideoIsLoadedAll(state.items[uploader_id], posted_video_list);

        Vue.set(state.items, uploader_id, {
            ...state.items[uploader_id],
            posted_video_list: [
                ...state.items[uploader_id].posted_video_list,
                ...posted_video_list,
            ],
            posted_video_page_count: state.items[uploader_id].posted_video_page_count + 1,
            posted_video_is_loaded_all,
        });
    },
    addMylistGroup: (state, { uploader_id, mylist_group }) => {
        if (!uploader_id) return;
        Vue.set(state.items[uploader_id], 'is_user_open_list_loaded', true);
        Vue.set(state.items[uploader_id], 'mylist_group', mylist_group);
    },
    setActiveListId: (state, { uploader_id, list_id }) => {
        if (!uploader_id) return;
        Vue.set(state.items[uploader_id], 'active_list_id', list_id);
    }
}

const actions = {
    addUploader: ({ commit, state, rootState, dispatch, getters }, uploader) => {
        if (!uploader) {
            const active_video_id = rootState.status.active_video_id;
            if (!active_video_id) return false;

            const current_video = rootState.videos.items[active_video_id];
            if (!current_video) return false;

            uploader = current_video.uploader;
        }

        if (!uploader || !uploader.id) return;

        const is_exist_user = state.items.hasOwnProperty(uploader.id);
        if (is_exist_user) return;

        commit('addUploader', uploader);

        dispatch('addPostedVideo', uploader);
        dispatch('addUserUploaderMylistGroup', uploader);
    },

    addUserUploaderMylistGroup: ({ commit, state, rootState }, uploader) => {
        // チャンネルだったらマイリスはないので終了
        if (uploader.is_channel) return;

        ajaxApi.getUserMylistGroupDetail(uploader.id).then(
            xml => {
                commit('addMylistGroup', {
                    uploader_id: uploader.id,
                    mylist_group: new UploaderPublicMylistGroupList(xml),
                })
            }
        );
    },

    addPostedVideo: ({ commit, state, rootState, getters }, uploader) => {
        let name;
        if (uploader.is_channel) {
            name = 'getChannelPostedVideoDetail';
        } else {
            name = 'getUserPostedVideoDetail'
        }

        ajaxApi[name](uploader.id).then(
            res => {
                commit('addPostedVideoList', {
                    uploader_id: uploader.id,
                    posted_video_list: res.posted_video_list,
                    posted_video_all_count: res.posted_video_all_count,
                });
            }
        )
    },

    pushPostedVideo: ({ commit, state, rootState, getters }, uploader) => {
        let name;
        if (uploader.is_channel) {
            name = 'getChannelPostedVideoDetail';
        } else {
            name = 'getUserPostedVideoDetail'
        }

        const page = uploader.posted_video_page_count + 1;

        ajaxApi[name](uploader.id, page).then(
            res => {
                commit('pushPostedVideoList', {
                    uploader_id: uploader.id,
                    posted_video_list: res.posted_video_list,
                });
            }
        )
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}
