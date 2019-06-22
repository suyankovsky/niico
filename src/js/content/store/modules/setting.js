// app.vueで指定したwatchからsaveStorage()が呼ばれ、storageに保存される値

import ChromeHelper from 'js/content/lib/chrome-helper.js';
import panel_map from 'js/content/map/panel-map.js';
import do_on_ended_map from 'js/content/map/do_on_ended.js';
import default_setting_map from 'js/content/map/default-setting.js';

const state = {
    ...default_setting_map,
};

const getters = {
    panel_map: (state) => {
        return panel_map.components;
    },
    volume: (state) => {
        return state.volume_is_mute ? 0 : state.volume;
    },
    player_size: (state, getters, rootState) => {
        let size = {};
        if(state.is_auto_player_width) {
            size = getters.auto_player_size;
        } else {
            size = getters.raw_player_size;
        }

        const w = Math.floor(size.w);
        const h = Math.floor(size.h);

        if(w < 320 || h < 180) {
            return {
                w: '320px',
                h: '180px',
            };
        }

        return {
            w: `${w}px`,
            h: `${h}px`,
        };
    },

    // settingの値を単純に計算した値
    raw_player_size: (state, getters, rootState) => {
        let w = state.player_width
        if(w < 320) {
            w = 320;
        }

        return {
            w,
            h: w / 16 * 9,
        }
    },

    // 画面サイズをもとに算出
    auto_player_size: (state, getters, rootState) => {
        const safe_width  = rootState.status.client_width / 2;
        const safe_height = rootState.status.client_height / 2;

        let w;
        if(safe_width/16 > safe_height/9) {
            w = safe_height / 9 * 16;
        } else {
            w = safe_width;
        }

        const h = w / 16 * 9;

        return {
            w,
            h,
        };
    },
};

const mutations = {
    initialize: (state) => {
        Object.keys(default_setting_map).forEach(key => {
            state[key] = default_setting_map[key];
        });
    },
    toggleIsShowDebugPanel: (state) => {
        state.is_show_debug_panel = !state.is_show_debug_panel;
    },
    toggleIsShowLogPanel: (state) => {
        state.is_show_log_panel = !state.is_show_log_panel;
    },
    toggleDefaultPlayerController: (state) => {
        state.is_default_player_controller = !state.is_default_player_controller;
    },
    toggleIsAppendHashtagOnTweet: (state) => {
        state.is_append_hashtag_niico_on_tweet = !state.is_append_hashtag_niico_on_tweet;
    },
    toggleVolumeMute: (state) => {
        state.volume_is_mute = !state.volume_is_mute;
    },
    toggleCommentMute: (state) => {
        state.comment_is_mute = !state.comment_is_mute;
    },
    toggleIsComputeTposInAdvance: (state) => {
        state.is_compute_tpos_in_advance = !state.is_compute_tpos_in_advance;
    },
    changePanel: (state, panel_id) => {
        // panel_map記載のpanel_id以外には変更させない
        if(Object.keys(panel_map.getMap()).indexOf(panel_id) < 0) return;

        state.active_panel_id = panel_id;
    },
    changeVolume: (state, volume) => {
        if(volume && volume <= 1 && volume >= 0) {
            state.volume = volume;
        } else {
            state.volume = volume ? 1 : 0;
        }
        state.volume_is_mute = false;
    },
    changeCommentOpacity: (state, opacity) => {
        if(opacity >= 0 && opacity <= 1) {
            state.comment_opacity = opacity;
            state.comment_is_mute = false;
        }
    },
    changeCommentMaxLineNum: (state, max_line_num) => {
        if(max_line_num > 1) {
            state.comment_max_line_num = max_line_num;
        }
    },
    changeIsAlwaysDanmakuMode: (state, is_always_danmaku_mode) => {
        state.is_always_danmaku_mode = is_always_danmaku_mode ? true : false;
    },
    changeFlowDurationSeconds: (state, flow_duration_seconds) => {
        if(flow_duration_seconds > 0 && flow_duration_seconds <= 2) {
            state.flow_duration_seconds = flow_duration_seconds;
        }
    },
    changeDoOnEnded: (state, value) => {
        const is_valid = Object.keys(do_on_ended_map).indexOf(value) >= 0;
        if(!is_valid) return;

        state.do_on_ended = value;
    },
    changeSelectedMylistId: (state, value) => {
        if(!value) {
            value = 'default';
        }

        state.selected_mylist_id = value;
    },
    changeIsUseShortcut: (state, is_use_shortcut) => {
        state.is_use_shortcut = is_use_shortcut ? true : false;
    },
    changeIsShowSettingHelp: (state, is_show_setting_help) => {
        state.is_show_setting_help = is_show_setting_help ? true : false;
    },
    changeMoveSeconds: (state, moves_seconds) => {
        const v = parseInt(moves_seconds);
        if(v > 0) {
            state.moves_seconds = v;
        }
    },
    changeCommentSortBy: (state, comment_sort_by) => {
        state.comment_sort_by = comment_sort_by;
    },
    changeCommentIsAutoScroll: (state, comment_is_auto_scroll) => {
        state.comment_is_auto_scroll = comment_is_auto_scroll ? true : false;
    },
    changeIsHorizontalScroll: (state, is_horizontal_scroll) => {
        state.is_horizontal_scroll = is_horizontal_scroll ? true : false;
    },
    setAllSetting: (state, setting) => {
        // ストレージに何もない場合（初回起動時）は初期設定を保存して終了
        if(!setting || !Object.keys(setting).length) {
            ChromeHelper.setStorage(state);
            return;
        }

        // ストレージにデータが存在すればVueに反映する
        Object.keys(setting).forEach(function(key, index) {
            state[key] = setting[key];
        });
    },
    toggleNiicoOff: (state) => {
        state.is_niico_off = !state.is_niico_off;
    },
    changePlayerWidth: (state, width) => {
        state.player_width = parseInt(width) || 0;
        state.is_auto_player_width = false;
    },
    resetPlayerWidth: (state) => {
        state.player_width = 512;
        state.is_auto_player_width = true;
    },
    toggleIsAutoPlayerWidth: (state) => {
        state.is_auto_player_width = !state.is_auto_player_width;
    },
    changeIsAutoPlayerWidth: (state, is_auto) => {
        state.is_auto_player_width = is_auto ? true : false;
    },
}

const actions = {
    loadStorageSetting: ({commit, state}) => {
        const keys = Object.keys(state);
        ChromeHelper.getStorage(keys).then(
            loaded_setting => {
                commit('setAllSetting', loaded_setting);
                ChromeHelper.setBadge(state.is_niico_off)
            }
        );
    },
    addListenerOnClickExtensionIcon: ({commit}) => {
        ChromeHelper.addListener(
            (message) => {
                if(message.key !== 'toggleNiico') return;

                commit('toggleNiicoOff');
                commit('resetPlayerWidth');
                commit('status/resetPlayerPosition', null, { root: true });
                ChromeHelper.setBadge(state.is_niico_off);
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
