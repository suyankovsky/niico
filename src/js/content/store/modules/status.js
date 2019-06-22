import $ from 'jquery';
import ajaxApi from 'js/content/lib/ajax-api.js';

const state = {
    // 現在再生中の動画ID
    active_video_id: null,

    // niicoウィンドウが閉じている
    is_window_closed: true,

    // ウィンドウモード window_mode_mapのいずれか
    window_mode: 'default',

    // 再生速度
    playbackRate: 1,

    // ミニプレイヤーモードの座標
    mini_x: 0,
    mini_y: 0,

    // ウィンドウ領域サイズ
    client_width: 0,
    client_height: 0,

    is_show_niico_float_window: false,
};

const window_mode_map = [
    'default',
    'full-screen',
    'mini-player',
];

const getters = {
    is_niico_shown: (state, getters, rootState) => {
        if(rootState.setting.is_niico_off) return false;
        if(state.is_window_closed) return false;
        if(state.active_video_id == null) return false;

        return true;
    },
    is_mini_player_mode: (state) => {
        return state.window_mode == 'mini-player';
    },
    is_full_screen_mode: (state) => {
        return state.window_mode == 'full-screen';
    },
    mini_player_size: (state, getters, rootState) => {
        if(!getters.is_mini_player_mode) return false;

        const width = rootState.setting.mini_player_width;
        if(width == 'auto' || width < 320) return false;

        return width;
    },
    player_position: (state, getters) => {
        if(!getters.is_mini_player_mode) {
            return {
                x: 0,
                y: 0,
            }
        }

        return {
            x: state.mini_x,
            y: state.mini_y,
        }
    },
};

const mutations = {
    initialize: (state) => {
        state.playbackRate = 1;
        state.mini_x = 0;
        state.mini_y = 0;
    },
    upPlaybackRate: (state) => {
        state.playbackRate += 0.25;
    },
    downPlaybackRate: (state) => {
        if(state.playbackRate > 0.25) {
            state.playbackRate -= 0.25;
        }
    },
    changePlayBackRate: (state, playbackRate) => {
        if(playbackRate < 0.25) return;
        if(playbackRate > 4) return;
        state.playbackRate = playbackRate;
    },
    activateVideo: (state, video_id) => {
        state.active_video_id = video_id;
        state.is_window_closed = false;
    },
    closeWindow: (state) => {
        state.is_window_closed = true;
    },
    uncloseWindow: (state) => {
        state.is_window_closed = false;
    },
    changeWindowMode: (state, mode) => {
        const is_valid_value = window_mode_map.some((item, key, index) => {
            return item === mode;
        });
        if(!is_valid_value) return false;

        state.window_mode = mode;
    },
    changeMiniPlayerPosition: (state, pos) => {
        let x = state.mini_x + parseInt(pos.x) || 0;
        let y = state.mini_y + parseInt(pos.y) || 0;

        if(x < 0) return x = 0;
        if(y < 0) return y = 0;

        state.mini_x = x;
        state.mini_y = y;
    },
    changeClientSize: (state) => {
        state.client_width = document.documentElement.clientWidth;
        state.client_height = document.documentElement.clientHeight;
    },
    toggleIsShowNiicoFloatWindow: (state) => {
        state.is_show_niico_float_window = !state.is_show_niico_float_window;
    },
    hideNiccoController: (state) => {
        state.is_show_niico_float_window = false;
    },

    // 拡張アイコンをクリックしたらリセットする用
    resetPlayerPosition: (state) => {
        state.mini_x = 0;
        state.mini_y = 0;
    },
}

const actions = {
    activateVideo: ({commit}, video_id) => commit('activateVideo', video_id),
    closeWindow: ({commit}) => commit('closeWindow'),
    uncloseWindow: ({commit}) => commit('uncloseWindow'),
    upPlaybackRate: ({commit}) => commit('upPlaybackRate'),
    downPlaybackRate: ({commit}) => commit('downPlaybackRate'),

    // 設定ウィンドウ外をクリックしたら、設定ウィンドウを閉じる
    addEventListenerDoCloseNiicoFloatWindow: ({commit, state}) => {
        const key = 'data-js-id';
        const id = 'niicoFloatWindow';
        const selector = `[${key}="${id}"]`;

        const isClickedFloatWindow = (e) => {
            if(!e) console.error('Invalid Param');
            const is_clicked_children = $(e.target).parents(selector).length > 0;
            const is_clicked_self = $(e.target).attr(key) == id;

            return is_clicked_children || is_clicked_self;
        };

        const isClickedToggleButton = (e) => {
            if(!e) console.error('Invalid Param');
            const id = 'toggleNiicoFloatWindowButton';
            const selector = `[${key}="${id}"]`;
            const is_clicked_children = $(e.target).parents(selector).length > 0;
            const is_clicked_self = $(e.target).attr(key) == id;

            return is_clicked_children || is_clicked_self;
        }

        const isOpenFloatWindow = () => {
            return $(selector).hasClass('is-active');
        }

        const handler = function(e) {
            if( ! isOpenFloatWindow()) return;
            if(isClickedToggleButton(e)) return;
            if(isClickedFloatWindow(e)) return;
            commit('hideNiccoController');
        }

        $(window).on('mousedown', handler);
    },

    // ウィンドウサイズに応じて動画サイズを計算する
    addOnRisizeWindowSizeEventListener: ({commit, state}) => {
        const handler = () => {
            commit('changeClientSize');
        };

        handler();
        window.addEventListener('resize', handler);
    },

    requestFullScreenMode: ({commit, state, dispatch, getters}) => {
        // Escで復帰した時にVueにFBさせるためにイベントを仕込む
        const handler = () => {
            if(document.webkitIsFullScreen) {
                commit('changeWindowMode', 'full-screen');
            } else {
                commit('changeWindowMode', 'default');
            }
        };
        document.removeEventListener('webkitfullscreenchange', handler);
        document.addEventListener('webkitfullscreenchange', handler);

        if(getters.is_full_screen_mode) {
            dispatch('cancelFullScreenMode');
            dispatch('requestDefaultScreenMode');
            return;
        }
        const el = document.getElementById('niico-player');
        el.webkitRequestFullscreen();
    },
    cancelFullScreenMode: ({commit, state}) => {
        document.webkitCancelFullScreen();
    },
    requestMiniPlayerScreenMode: ({commit, state, dispatch, getters}) => {
        if(getters.is_mini_player_mode) {
            dispatch('requestDefaultScreenMode');
            return;
        }
        dispatch('cancelFullScreenMode');
        commit('changeWindowMode', 'mini-player');
    },
    requestDefaultScreenMode: ({commit, state, dispatch, getters}) => {
        dispatch('cancelFullScreenMode');
        commit('changeWindowMode', 'default');
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}
