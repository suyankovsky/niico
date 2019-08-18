<template>
    <div class="player" :style="[{width: player_size.w}, {height: player_size.h}]">
        <template v-if="video.status < 1000">
            <ErrorNotification :video="video" :video_id="video_id" />
        </template>
        <template v-else-if="video.status < 1100">
            {{video.status}}
            <LoadingNotification :is_show_actions="true" />
        </template>
        <template v-else-if="video.status > 1100">
            <template v-if="video.element_load_status < 0">
                <LoadingNotification :is_show_actions="false" />
            </template>
            <video
                :src="video.content.src"
                :id="video_id"
                :poster="video.content.thumbnail_src"
                :controls="setting.is_default_player_controller"
                @loadedmetadata="onLoademetadata"
                @canplay="onCanPlay"
                @canplaythrough="onCanPlayThrough"
                @waiting="onWaiting"
                @timeupdate="onTimeUpdate"
                @ended="onEnded"
                @error="onError"
                @play="onPlay"
                @playing="onPlaying"
                @pause="onPause"
                ref="video"
            ></video>
            <template v-if="video.content.duration">
                <CommentCanvas
                    class="comment"
                    v-if="video.raw"
                    v-show="status.active_video_id == video_id"
                    :key="key"
                    :video_id="video_id"
                />
                <VideoController
                    :video_id="video_id"
                    :video="video"
                    v-if="!setting.is_default_player_controller"
                />
            </template>
        </template>
    </div>
</template>

<style lang="scss" scoped>
.player {
    position: relative;
    background: #000;
    flex-shrink: 0;
    overflow: hidden;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;

    width: 100%;
    height: 100%;

    video {
        width: 100%;
        height: 100%;

        transition-property: transform;
        transition-duration: 0.3s;
        transform: scale(1, 1);
    }
}
</style>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

import CommentCanvas from "js/content/components/player/comment-canvas.vue";
import VideoController from "js/content/components/player/video-controller.vue";
import LoadingNotification from "js/content/components/player/loading-notification.vue";
import ErrorNotification from "js/content/components/player/error-notification.vue";
import NiicoIcon from "img/niico/niico_bordered.svg";

export default {
    props: ["video", "video_id"],
    components: {
        CommentCanvas,
        VideoController,
        NiicoIcon,
        LoadingNotification,
        ErrorNotification
    },
    watch: {
        "status.active_video_id": function(new_val, old_val) {
            new_val == this.video_id ? this.play() : this.pause();
        },
        "status.is_window_closed": function(is_window_closed) {
            if (is_window_closed) this.pause();
        },
        "video.is_closed": function(is_closed) {
            if (is_closed) this.pause();
        },
        "setting.volume": function(volume) {
            if (!this.$refs.video) return;
            this.$refs.video.volume = volume;
        },
        "setting.volume_is_mute": function(is_mute) {
            if (!this.$refs.video) return;
            this.$refs.video.volume = this.$store.getters["setting/volume"];
        },
        "status.playbackRate": function(playbackRate) {
            if (!this.$refs.video) return;
            this.$refs.video.playbackRate = playbackRate;
        }
    },
    computed: {
        ...mapState({
            videos: state => state.videos.videos,
            status: state => state.status,
            setting: state => state.setting
        })
    },
    methods: {
        ...mapGetters({
            player_size: "setting/player_size"
        }),
        ...mapActions({
            onTimeUpdate: "videos/onTimeUpdate",
            onEnded: "videos/onEnded",
            onPlay: "videos/onPlay",
            onPlaying: "videos/onPlaying",
            onPause: "videos/onPause",
            reLoadVideo: "videos/reLoadVideo"
        }),
        onLoademetadata: function() {
            this.$store.dispatch("videos/onLoadedmetadata", this.video_id);
            this.$refs.video.volume = this.$store.getters["setting/volume"];
            this.play();
        },
        onCanPlay() {
            this.$store.commit("videos/onCanPlay", {
                video_id: this.video_id
            });
        },
        onCanPlayThrough() {
            this.$store.commit("videos/onCanPlayThrough", {
                video_id: this.video_id
            });
        },
        onWaiting() {
            this.$store.commit("videos/beginLoadingBuffer", {
                video_id: this.video_id
            });
        },
        onError: function($error) {
            this.$store.dispatch("videos/onError", $error);
        },
        togglePlay: function() {
            const el = document.getElementById(this.video_id);
            if (!el) return;

            el.paused ? this.play() : this.pause();
        },
        play: function() {
            if (this.status.active_video_id !== this.video_id) return;

            const el = document.getElementById(this.video_id);
            if (!el) return;

            if (this.video.current_time)
                el.currentTime = this.video.content.current_time;
            el.play();
        },
        pause: function() {
            const el = document.getElementById(this.video_id);
            if (!el) return;

            el.pause();
        }
    }
};
</script>
