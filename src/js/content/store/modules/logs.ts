import misc from 'js/content/lib/misc.ts';

const state = {
    success: [],
    error: [],
    warn: [],
    info: [],
};

const getters = {
    all: (state) => {
        return Object.keys(state).map(
            key => {
                return state[key];
            }
        ).reduce(
            (all, now) => {
                return all.concat(now)
            }, []
        ).sort((a, b) => {
            if (a.timestamp < b.timestamp) return 1;
            if (a.timestamp > b.timestamp) return -1;
            return 0;
        });
    },
    alert_log: (state) => {
        return Object.keys(state).filter(
            key => key == 'success' || key == 'error'
        ).map(
            key => {
                return state[key];
            }
        ).reduce(
            (all, now) => {
                return all.concat(now)
            }, []
        ).sort((a, b) => {
            if (a.timestamp < b.timestamp) return 1;
            if (a.timestamp > b.timestamp) return -1;
            return 0;
        });
    },
};

const mutations = {
    push: (state, { type, title, detail }) => {
        state[type].push({
            type,
            title,
            detail,
            timestamp: new Date(),
            is_read: false,
            key: misc.generateRandomString(),
        });
    },
    read: (state, item) => {
        let index;
        state[item.type].some(
            (log, index) => {
                if (item.key != log.key) return false;
                if (item.timestamp != log.timestamp) return false;

                state[item.type][index].is_read = true;
                return true;
            }
        )
    },
}

const actions = {
    push: ({ commit, state }, item) => commit('push', item),
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}
