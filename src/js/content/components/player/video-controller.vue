<template>
    <div class="videoController" :id="'videoController--' + this.video_id">
        <section class="contextActions" v-if="!is_mini_player_mode">
            <ul>
                <li class="button" @click="openTweet">
                    <TwitterIcon />
                </li>
                <li class="button" @click="openNicoVideo">
                    <ExternalLinkIcon />
                </li>
            </ul>
            <template v-if="viewerMylist.length > 1">
                <div class="mylist">
                    <NiicoSelect
                        :options="viewer_mylist"
                        :value="selected_mylist_id"
                        v-model="selected_mylist_id"
                    />
                    <div class="button" @click="addMylist">にマイリスト登録</div>
                </div>
            </template>
        </section>

        <section class="playerActions" v-if="!is_mini_player_mode">
            <div class="buttons">
                <div class="rewind actionButton" @click="seekBackward">
                    <div class="icon">
                        <RewindIcon />
                    </div>
                    <div class="text">{{setting.moves_seconds}}</div>
                </div>
                <div class="playStatus actionButton" @click="doTogglePlay">
                    <template v-if="video.is_paused">
                        <PlayIcon />
                    </template>
                    <template v-else>
                        <PauseIcon />
                    </template>
                </div>
                <div class="fastForward actionButton" @click="seekForward">
                    <div class="icon">
                        <FastForwardIcon />
                    </div>
                    <div class="text">{{setting.moves_seconds}}</div>
                </div>
            </div>
        </section>

        <section class="dummy" @click="doTogglePlay"></section>

        <section class="timeSlider">
            <InputHorizontalRange
                :min="0"
                :max="video.content.duration"
                :step="0.01"
                :value="video.current_time"
                :buffered="video.ranges"
                @change="onChange"
                @input="onChange"
                @mousedown="onMousedown"
                @mouseup="onMouseup"
            />
        </section>

        <section class="videoMainController">
            <ul>
                <li class="playStatus actionButton" @click="doTogglePlay">
                    <template v-if="video.is_paused">
                        <PlayIcon />
                    </template>
                    <template v-else>
                        <PauseIcon />
                    </template>
                </li>
                <li class="reload" @click="reLoadVideo(status.active_video_id)">
                    <ReLoadIcon />
                </li>
                <li class="time_display">
                    <span class="current_time">{{video.current_time|formatTime}}</span>
                    <span class="separater">/</span>
                    <span class="duration">{{video.content.duration|formatTime}}</span>
                </li>
            </ul>
            <ul>
                <li>
                    <dl class="has-slider">
                        <dt @click="toggleVolumeMute">
                            <template v-if="setting.volume_is_mute">
                                <VolumeMuteIcon />
                            </template>
                            <template v-else>
                                <VolumeIcon />
                            </template>
                        </dt>
                        <dd>
                            <div class="value">{{volume|toPercentage}}</div>
                            <div class="slider">
                                <InputVerticalRange
                                    :max="1"
                                    :step="0.01"
                                    :value="volume"
                                    v-model="volume"
                                    :is_hide_handle="true"
                                />
                            </div>
                        </dd>
                    </dl>
                </li>
                <li>
                    <dl class="has-slider">
                        <dt @click="toggleCommentMute">
                            <template v-if="setting.comment_is_mute">
                                <CommentMuteIcon />
                            </template>
                            <template v-else>
                                <CommentIcon />
                            </template>
                        </dt>
                        <dd>
                            <div class="value">{{comment_opacity|toPercentage}}</div>
                            <div class="slider">
                                <InputVerticalRange
                                    :max="1"
                                    :step="0.01"
                                    :value="comment_opacity"
                                    v-model="comment_opacity"
                                    :is_hide_handle="true"
                                />
                            </div>
                        </dd>
                    </dl>
                </li>
                <li
                    @click="toggleMirrorHorizontal"
                    :class="[{'is-active': is_mirror_horizontal}]"
                >反転</li>
                <li @click="toggleShowDetailSlider" :class="[{'is-active': is_show_detail_slider}]">
                    <SlidersIcon />
                </li>
                <li
                    @click="requestMiniPlayerScreenMode"
                    :class="[{'is-active': is_mini_player_mode}]"
                >
                    <MiniPlayerIcon />
                </li>
                <li @click="requestFullScreenMode" :class="[{'is-active': is_full_screen_mode}]">
                    <MaximizeIcon />
                </li>
            </ul>
        </section>

        <section class="detailSlider" v-show="is_show_detail_slider">
            <ul>
                <li>
                    <span>再生速度</span>
                    <var>x{{status.playbackRate|playbackRateFormat}}</var>
                    <fieldset>
                        <InputHorizontalRange
                            :max="4"
                            :min="0.01"
                            :step="0.01"
                            :value="playback_rate"
                            v-model="playback_rate"
                            :is_hide_handle="true"
                        />
                    </fieldset>
                </li>
                <li>
                    <span>早送り/巻き戻し秒数</span>
                    <var>{{moves_seconds}}秒</var>
                    <fieldset>
                        <InputHorizontalRange
                            :max="60"
                            :min="1"
                            :step="1"
                            :value="moves_seconds"
                            v-model="moves_seconds"
                        />
                    </fieldset>
                </li>
                <li>
                    <span>コメントアニメーションの所要時間</span>
                    <var>{{flow_duration_seconds|toPercentage}}%（{{flow_duration_seconds*4}}秒）</var>
                    <fieldset>
                        <InputHorizontalRange
                            :max="2"
                            :min="0"
                            :step="0.01"
                            :value="flow_duration_seconds"
                            v-model="flow_duration_seconds"
                        />
                    </fieldset>
                </li>
                <li>
                    <span>コメント最大行数</span>
                    <var>{{comment_max_line_num/11|toPercentage}}%（{{comment_max_line_num}}行）</var>
                    <fieldset>
                        <InputHorizontalRange
                            :max="55"
                            :min="2"
                            :step="1"
                            :value="comment_max_line_num"
                            v-model="comment_max_line_num"
                        />
                    </fieldset>
                </li>
                <li>
                    <span>再生終了時の処理</span>
                    <fieldset>
                        <template v-for="(value, key) in do_on_ended_map">
                            <button
                                @click="changeDoOnEnded(key)"
                                :class="[{'is-active': do_on_ended==key}]"
                                :key="key"
                            >{{value}}</button>
                        </template>
                    </fieldset>
                </li>
            </ul>
        </section>
    </div>
</template>

<style lang="scss" scoped>
$aninmate_duration: 0.3s;

svg {
    width: 16px;
    height: 16px;
    cursor: pointer;

    &:not(.feather) {
        fill: #fff;
    }
}

.videoController {
    position: absolute;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    opacity: 0;
    transition: opacity 0.3s;
    background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0) 60%,
        rgba(0, 0, 0, 0.2) 90%,
        rgba(0, 0, 0, 0.8) 100%
    );

    &.is-active {
        opacity: 1;
    }

    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    .playerActions,
    .videoMainController {
        filter: drop-shadow(0 0 4px #000);
    }

    .contextActions {
        display: flex;
        justify-content: space-between;

        ul {
            li {
                margin: 8px 0 0 8px;
                display: inline-block;
                background: #252525;
                padding: 8px;
                border-radius: 4px;

                svg {
                    width: 20px;
                    height: 20px;
                }
            }
        }

        .mylist {
            display: flex;
            margin: 8px;
            background: #252525;
            border-radius: 4px;
            overflow: hidden;

            .niico-select {
                margin: 4px 8px;
            }

            select {
                margin: 0;
                border: 0;
            }

            .button {
                border-radius: 0;
            }
        }

        ul li,
        .mylist {
            opacity: 0.4;
            transition: opacity 0.3s;

            &:hover {
                opacity: 1;
            }
        }
    }

    .playerActions {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60%;
        display: flex;
        flex-direction: column;
        align-items: center;

        .buttons {
            display: flex;

            .actionButton {
                flex-grow: 1;
                display: flex;
                justify-content: center;
                position: relative;

                svg {
                    width: 30%;
                    height: 100%;
                }

                .icon {
                    display: flex;
                    justify-content: center;
                }

                .text {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-family: Impact, Helvetica, sans-serif;
                    font-size: 18px;
                    pointer-events: none;
                }
            }
        }

        .playbackRate {
            display: flex;
            width: 60%;
            height: 14px;
            margin-top: 24px;
        }
    }

    .dummy {
        flex-grow: 1;
    }

    .timeSlider {
        margin: 0 10px;
    }

    .videoMainController {
        display: flex;
        justify-content: space-between;
        line-height: 16px;
        margin: 4px 10px 10px;

        ul {
            display: flex;

            li {
                margin: 0 6px;
                cursor: pointer;

                &.time_display {
                    line-height: 1;
                    display: flex;
                    align-items: center;

                    .separater {
                        margin: 0 4px;
                    }

                    .separater,
                    .duration {
                        color: #ccc;
                    }
                }

                &.is-active svg {
                    color: #2a7df6;
                    fill: #2a7df6;
                }
                &.is-active {
                    color: #2a7df6;
                }

                dl {
                    position: relative;

                    dt {
                        position: relative;
                        z-index: 2;
                    }

                    dd {
                        position: absolute;
                        left: 50%;
                        bottom: -5px;
                        transform: translate(-50%, 0);
                        height: 120px;
                        width: 28px;
                        z-index: 1;
                        padding: 0 0 28px;

                        margin-top: 6px;
                        border-radius: 4px;
                        background: rgba(0, 0, 0, 0.8);
                        box-shadow: 0px 0px 1px 0 rgba(255, 255, 255, 1);

                        .value {
                            white-space: nowrap;
                            font-size: 10px;
                            text-align: center;
                            padding: 4px 0;
                        }

                        .slider {
                            flex-grow: 1;
                            display: flex;
                            justify-content: center;
                        }

                        display: none;
                        flex-direction: column;
                    }

                    &:hover {
                        dd {
                            display: flex;
                        }
                    }
                }
            }
        }
    }

    .detailSlider {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin-bottom: 48px;
        font-size: 10px;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        pointer-events: none;
        margin: 10px 10px 48px;
        ul {
            pointer-events: all;
            background: rgba(0, 0, 0, 0.8);
            max-width: 300px;
            max-height: 100%;
            overflow-x: auto;
            box-shadow: 0px 0px 1px 0 rgba(255, 255, 255, 0.3);
            li {
                margin: 8px;
                span {
                    color: #999;
                }
                fieldset {
                    flex-grow: 1;

                    button {
                        border: 0;
                        background: #666;
                        color: #fff;
                        font-size: 10px;
                        border-radius: 2px;
                        margin: 2px 4px 0 0;
                        padding: 2px 4px;

                        &.is-active {
                            background: #2a7df6;
                        }
                    }
                }
                var {
                    width: 56px;
                }
            }
        }
    }
}
</style>

<script>
import $ from "jquery";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import NiicoSelect from "js/content/components/common/form/input-select.vue";
import InputHorizontalRange from "js/content/components/common/form/input-range-horizontal.vue";
import InputVerticalRange from "js/content/components/common/form/input-range-vertical.vue";

import VideoMisc from "js/content/lib/video-misc.ts";
import FormatHelper from "js/content/lib/format-helper.ts";
import do_on_ended_map from "js/content/map/do_on_ended.ts";

import PlayIcon from "img/nicovideo/play.svg";
import PauseIcon from "img/nicovideo/pause.svg";
import VolumeIcon from "img/nicovideo/volume.svg";
import VolumeMuteIcon from "img/nicovideo/volume-mute.svg";
import CommentIcon from "img/nicovideo/comment.svg";
import CommentMuteIcon from "img/nicovideo/comment-mute.svg";
import MaximizeIcon from "img/feather/maximize.svg";
import MiniPlayerIcon from "img/youtube/mininplayer.svg";
import ReLoadIcon from "img/nicolive/reload.svg";
import RewindIcon from "img/nicovideo_edited/seek-backward.svg";
import FastForwardIcon from "img/nicovideo_edited/seek-forward.svg";
import TwitterIcon from "img/feather/twitter.svg";
import ExternalLinkIcon from "img/feather/external-link.svg";
import SlidersIcon from "img/feather/sliders.svg";

import ModelsMixins from "js/content/mixins/form-models.ts";
import DelayedDisplayControl from "js/content/lib/delayed-display-control.ts";

export default {
    props: ["video", "video_id"],
    data() {
        return {
            do_on_ended_map,
            is_show_detail_slider: false,
            is_mirror_horizontal: false
        };
    },
    mounted() {
        new DelayedDisplayControl({
            container_target: ".videoController",
            move_target: ".dummy",
            leave_target: ".videoController",
            over_target: ".contextActions, .videoMainController, .detailSlider"
        });
    },
    components: {
        InputHorizontalRange,
        InputVerticalRange,
        PlayIcon,
        PauseIcon,
        VolumeIcon,
        CommentIcon,
        MaximizeIcon,
        MiniPlayerIcon,
        VolumeMuteIcon,
        CommentMuteIcon,
        ReLoadIcon,
        TwitterIcon,
        ExternalLinkIcon,
        NiicoSelect,
        RewindIcon,
        FastForwardIcon,
        SlidersIcon
    },
    watch: {},
    computed: {
        ...mapState({
            videos: state => state.videos.videos,
            video: state =>
                state.videos.videos.find(
                    item => item.id === state.status.active_video_id
                ),
            status: state => state.status,
            setting: state => state.setting,
            viewerMylist: state => state.viewerMylist.items
        }),
        ...mapGetters({
            selected_mylist_name: "viewerMylist/selected_mylist_name",
            is_full_screen_mode: "status/is_full_screen_mode",
            is_mini_player_mode: "status/is_mini_player_mode",
            player_size: "setting/player_size"
        }),
        video_el() {
            const video_id = this.status.active_video_id;
            if (!video_id) return false;

            const video_el = document.getElementById(video_id);
            if (!video_el) return false;

            return video_el;
        },
        container: function() {
            return document.getElementById("videoController--" + this.video_id);
        },
        ...ModelsMixins
    },
    methods: {
        ...mapMutations({
            toggleVolumeMute: "setting/toggleVolumeMute",
            toggleCommentMute: "setting/toggleCommentMute",
            changeDoOnEnded: "setting/changeDoOnEnded",
            changeIsAutoPlayerWidth: "setting/changeIsAutoPlayerWidth"
        }),
        ...mapActions({
            reLoadVideo: "videos/reLoadVideo",
            openNicoVideo: "videos/openNicoVideo",
            openTweet: "videos/openTweet",
            requestFullScreenMode: "status/requestFullScreenMode",
            requestMiniPlayerScreenMode: "status/requestMiniPlayerScreenMode"
        }),
        onChange: function(e) {
            const current_time = e.target.value;
            const video_el = document.getElementById(this.video_id);
            if (!video_el) return;

            video_el.currentTime = current_time;
        },
        onMousedown: function(e) {
            this.onChange(e);
            const video_el = document.getElementById(this.video_id);
            if (!video_el) return;

            video_el.pause();
        },
        onMouseup: function(e) {
            this.onChange(e);
            const video_el = document.getElementById(this.video_id);
            if (!video_el) return;

            video_el.play();
        },
        doTogglePlay: function() {
            const video_el = document.getElementById(this.video_id);
            if (!video_el) return;

            video_el.paused ? video_el.play() : video_el.pause();
        },
        toggleShowDetailSlider: function() {
            this.is_show_detail_slider = !this.is_show_detail_slider;
        },
        toggleMirrorHorizontal() {
            this.is_mirror_horizontal = !this.is_mirror_horizontal;

            if (this.is_mirror_horizontal) {
                $("video").css({
                    transform: "scale(-1, 1)"
                });
            } else {
                $("video").css({
                    transform: "scale(1, 1)"
                });
            }
        },

        addMylist: function() {
            const message = `「${this.selected_mylist_name}」にマイリスト登録します。よろしいですか？`;
            if (!window.confirm(message)) return;
            this.$store.dispatch("viewerMylist/addMylist");
        },

        seekBackward() {
            if (!this.video_el) return;
            this.video_el.currentTime -= this.setting.moves_seconds || 5;
        },
        seekForward() {
            if (!this.video_el) return;
            this.video_el.currentTime += this.setting.moves_seconds || 5;
        }
    },
    filters: {
        formatTime: function(time) {
            return FormatHelper.convertSecondsToPlayTime(time);
        },
        playbackRateFormat: function(rate) {
            return Number(rate).toFixed(2);
        },
        toPercentage: num => {
            return Math.round(num * 100);
        }
    }
};
</script>
