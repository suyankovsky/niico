export interface ActionContext {
    state;
    rootState;
    commit;
    dispatch;
    getters;
    rootGetters;
}

export interface GettersContext {
    state;
    getters;
    rootState;
    rootGetters;
}
