<template>
    <div>
        <canvas
            ref="el"
            :style="[
                {opacity: setting.comment_opacity},
                {display: setting.comment_is_mute ? 'none' : 'block'}
            ]"
            :id="'canvas--' + video_id"
        ></canvas>
        <canvas
            style="display:none"
            id="canvas--niico-ready-tpos"
        ></canvas>
        <video
            id="niico-ready-tpos"
        ></video>
    </div>
</template>

<style lang="scss" scoped>
    canvas {
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
        width: 100%;
        height: 100%;
    }
</style>

<script>
    import $ from 'jquery';
    import {mapState, mapGetters} from 'vuex';

    import ajaxApi from 'js/content/lib/ajax-api.ts';
    import flowManager from 'js/content/lib/flow-comment/manager.ts';
    import misc from 'js/content/lib/misc.ts';

    export default {
        props: [
            'video_id',
        ],
        created: function() {
            const is_load_success = this.$store.dispatch('comments/addComments', this.video_id);
            is_load_success.then(
                is_load_success => {
                    if(is_load_success) {
                        this.flowManager = new flowManager(this.video_id, this.comments[this.video_id], this.status.window_mode);

                        if(this.setting.is_compute_tpos_in_advance) {
                            this.flowManager.readyTpos();
                        }

                        this.watchVideoPlayStatus();
                    } else {
                        misc.pushLog('ERROR_GET_COMMENT', {
                            video_id: this.video_id,
                            error_id: 1,
                        });
                    }
                },
                error => {
                    misc.pushLog('ERROR_GET_COMMENT', {
                        video_id: this.video_id,
                        error_id: 2,
                    });
                }
            )
        },
        computed: {
            ...mapState({
                videos: state => state.videos.items,
                video: (state, video_id) => state.videos.items[video_id],
                comments: state => state.comments.items,
                status: state => state.status,
                setting: state => state.setting,
            }),
            ...mapGetters({
                player_size: 'setting/player_size',
            }),
        },
        watch: {
            'status.active_video_id': function(new_val) {
                if(new_val !== this.video_id) {
                    this.stopAnimation();
                }
            },
            'status.is_window_closed': function(is_window_closed) {
                if(is_window_closed) {
                    this.stopAnimation();
                }
            },
            'player_size': function(new_val) {
                this.flowManager.onResizePlayer();
            },
            'status.window_mode': function(window_mode) {
                this.flowManager.onResizePlayer();
            },
            'setting.flow_duration_seconds': function() {
                this.flowManager.resetTiming();
            },
        },
        methods: {
            watchVideoPlayStatus: function() {
                this.startAnimation();

                const video_el = document.getElementById(this.video_id);
                const _this = this;

                video_el.addEventListener('pause', function() {
                    _this.stopAnimation();
                });
                video_el.addEventListener('seeking', function() {
                    _this.flowManager.flushRect();
                });
                video_el.addEventListener('play', function() {
                    _this.startAnimation();
                });
            },
            startAnimation: function() {
                if(this.flowManager) {
                    this.flowManager.flushRect();
                    this.animation_id = requestAnimationFrame(this.startAnimation);
                }
            },
            stopAnimation: function() {
                if(this.animation_id) {
                    cancelAnimationFrame(this.animation_id);
                }
            },
        },
    }
</script>
