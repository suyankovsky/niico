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
                @loadedmetadata="onLoadedmetadata(video_id)"
                @canplay="onCanPlay(video_id)"
                @waiting="onWaiting"
                @timeupdate="onTimeUpdate"
                @ended="onEnded(video_id)"
                @error="onError"
                @play="onPlay(video_id)"
                @playing="onPlaying(video_id)"
                @pause="onPause(video_id)"
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
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";

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
            new_val == this.video_id ? this.doPlay() : this.doPause();
        },
        "status.is_window_closed": function(is_window_closed) {
            if (is_window_closed) this.doPause();
        },
        "video.is_closed": function(is_closed) {
            if (is_closed) this.doPause();
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
        },
        "video.status": function(new_val, old_val) {
            this.$refs.video.volume = this.$store.getters["setting/volume"];

            if (new_val === 2525) this.$refs.video.play();
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
        ...mapMutations({
            onCanPlay: "videos/onCanPlay",
            onWaiting: "videos/onWaiting",
            onPlaying: "videos/onPlaying",
            onPlay: "videos/onPlaying",
            onPause: "videos/onPause",
            onLoadedmetadata: "videos/onLoadedmetadata"
        }),
        ...mapActions({
            onTimeUpdate: "videos/onTimeUpdate",
            onEnded: "videos/onEnded",
            reLoadVideo: "videos/reLoadVideo",
            onError: "videos/onError"
        }),
        doPlay() {
            this.$refs.video.play();
        },
        doPause() {
            this.$refs.video.pause();
        },
        doTogglePlay() {
            const el = $refs.video;
            el.paused ? el.play() : el.pause();
        }
    }
};
</script>
