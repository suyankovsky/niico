export default {
    video_el() {
        const video_id = this.status.active_video_id;
        if(!video_id) return false;

        const video_el = document.getElementById(video_id);
        if(!video_el) return false;

        return video_el;
    },
    playback_rate: {
        get() {
            return this.status.playbackRate;
        },
        set(e) {
            this.$store.commit('status/changePlayBackRate', e.target.value);
        }
    },
    selected_mylist_id: {
        get() {
            return this.setting.selected_mylist_id;
        },
        set(e) {
            this.$store.commit('setting/changeSelectedMylistId', e);
        },
    },
    viewer_mylist() {
        const obj = {};
        this.viewerMylist.forEach(
            item => {
                obj[item.id] = item.name;
            }
        );
        return obj;
    },
    comment_opacity: {
        get() {
            return this.setting.comment_opacity;
        },
        set(e) {
            this.$store.commit('setting/changeCommentOpacity', e.target.value);
        },
    },
    comment_max_line_num: {
        get() {
            return this.setting.comment_max_line_num
        },
        set(e) {
            this.$store.commit('setting/changeCommentMaxLineNum', e.target.value);
        },
    },
    is_always_danmaku_mode: {
        get() {
            return this.setting.is_always_danmaku_mode
        },
        set(e) {
            this.$store.commit('setting/changeIsAlwaysDanmakuMode', e);
        },
    },
    is_use_shortcut: {
        get() {
            return this.setting.is_use_shortcut
        },
        set(e) {
            this.$store.commit('setting/changeIsUseShortcut', e);
        }
    },
    flow_duration_seconds: {
        get() {
            return this.setting.flow_duration_seconds
        },
        set(e) {
            this.$store.commit('setting/changeFlowDurationSeconds', e.target.value);
        },
    },
    do_on_ended: {
        get() {
            return this.setting.do_on_ended;
        },
        set(e) {
            this.$store.commit('setting/changeDoOnEnded', e);
        }
    },
    is_show_setting_help: {
        get() {
            return this.setting.is_show_setting_help;
        },
        set(e) {
            this.$store.commit('setting/changeIsShowSettingHelp', e);
        },
    },
    moves_seconds: {
        get() {
            return this.setting.moves_seconds;
        },
        set(e) {
            this.$store.commit('setting/changeMoveSeconds', e.target.value);
        },
    },
    is_horizontal_scroll: {
        get() {
            return this.setting.is_horizontal_scroll;
        },
        set(e) {
            this.$store.commit('setting/changeIsHorizontalScroll', e);
        }
    },
    volume: {
        get() {
            return this.setting.volume;
        },
        set(e) {
            this.$store.commit('setting/changeVolume', e.target.value);
        }
    },
    volume_is_mute: {
        get() {
            return this.setting.volume_is_mute;
        },
        set(e) {
            this.$store.commit('setting/toggleVolumeMute');
        },
    },
    comment_is_mute: {
        get() {
            return this.setting.comment_is_mute;
        },
        set(e) {
            this.$store.commit('setting/toggleCommentMute');
        },
    },
    is_append_hashtag_niico_on_tweet: {
        get() {
            return this.setting.is_append_hashtag_niico_on_tweet;
        },
        set(e) {
            this.$store.commit('setting/toggleIsAppendHashtagOnTweet');
        },
    },
    is_default_player_controller: {
        get() {
            return this.setting.is_default_player_controller;
        },
        set(e) {
            this.$store.commit('setting/toggleDefaultPlayerController');
        },
    },
    is_compute_tpos_in_advance: {
        get() {
            return this.setting.is_compute_tpos_in_advance;
        },
        set(e) {
            this.$store.commit('setting/toggleIsComputeTposInAdvance');
        }
    },
    comment_is_auto_scroll: {
        get() {
            return this.setting.comment_is_auto_scroll
        },
        set(e) {
            this.$store.commit('setting/changeCommentIsAutoScroll', e);
        },
    },
    is_show_debug_panel: {
        get() {
            return this.setting.is_show_debug_panel
        },
        set(e) {
            this.$store.commit('setting/toggleIsShowDebugPanel', e);
        },
    },
    is_show_log_panel: {
        get() {
            return this.setting.is_show_log_panel
        },
        set(e) {
            this.$store.commit('setting/toggleIsShowLogPanel', e);
        },
    },
    selected_mylist_id: {
        get() {
            return this.setting.selected_mylist_id;
        },
        set(e) {
            this.$store.commit('setting/changeSelectedMylistId', e);
        },
    },
    viewer_mylist() {
        const obj = {};
        this.viewerMylist.forEach(
            item => {
                obj[item.id] = item.name;
            }
        );
        return obj;
    },
    player_width: {
        get() {
            return this.setting.player_width;
        },
        set(e) {
            this.$store.commit('setting/changePlayerWidth', e.target.value);
        }
    },
    is_auto_player_width: {
        get() {
            return this.setting.is_auto_player_width;
        },
        set(e) {
            this.$store.commit('setting/toggleIsAutoPlayerWidth');
        }
    },
}
