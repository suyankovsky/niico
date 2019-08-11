// 公開マイリスト

import Vue from 'vue';
import ajaxApi from 'js/content/lib/ajax-api.ts';

const state = {
    items: [],
    min_id: '',
    is_loading: false,
};

const getters = {
    is_loading: (state) => {
        return state.is_loading;
    },
    upload_topic: (state) => {
        if (state.items.length == 0) return [];

        return state.items.filter(
            item => {
                // フィルターができる前の名残。まあ、一応残しておく。
                if (!item.hasOwnProperty('video')) return false;

                if (item.topic == 'nicovideo.user.video.upload') return true;
                if (item.topic == 'nicovideo.channel.video.upload') return true;

                return false;
            }
        ).map(
            item => {
                if (item.topic == 'nicovideo.user.video.upload') {
                    const sender = item.senderNiconicoUser;

                    return {
                        ...item,
                        sender: {
                            id: sender.id,
                            name: sender.nickname,
                            url: `//www.nicovideo.jp/user/${sender.id}`,
                            thumbnail_src: sender.icons.tags.defaultValue.urls.s150x150,
                            type: 'user',
                        },
                    };
                }

                if (item.topic == 'nicovideo.channel.video.upload') {
                    const sender = item.senderChannel;
                    return {
                        ...item,
                        sender: {
                            id: sender.id,
                            name: sender.name,
                            url: sender.url,
                            thumbnail_src: sender.thumbnailUrl,
                            type: 'channel',
                        },
                    };
                }
            }
        )
    },
};

const mutations = {
    add: (state, item) => {
        state.items.push(item);
    },
    updateMinId: (state, min_id) => {
        state.min_id = min_id;
    },
    startLoad: (state) => {
        state.is_loading = true;
    },
    doneLoad: (state) => {
        state.is_loading = false;
    }
}

const actions = {
    load: ({ commit, state }) => {
        const min_id = state.min_id || undefined;

        commit('startLoad');
        ajaxApi.getNicorepo(min_id).then(
            res => {
                commit('doneLoad');
                if (res.meta && res.meta.status == 200) {
                    commit('updateMinId', res.meta.minId);
                    res.data.forEach(item => {
                        commit('add', item);
                    })
                }
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
