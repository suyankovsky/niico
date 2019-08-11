<template>
    <li
        v-if="!video.is_closed"
        class="tab"
        :class="[{'is-active': status.active_video_id == video_id}]"
    >
        <div class="progress">
            <div class="buffered">
                <div
                    class="range"
                    v-for="(range, key) in video.ranges"
                    :style="[{left: range.left+'%'}, {width: range.width+'%'}]"
                    :key="key"
                ></div>
            </div>
            <div
                class="currentTime"
                :style="{left: (video.current_time / video.duration * 100) + '%'}"
            ></div>
        </div>
        <div class="container" @click="onClickTab(video_id, $event)">
            <div class="thumbnail">
                <img v-if="video.thumbnail_src" :src="video.thumbnail_src" />
                <div v-else-if="is_video_loading">
                    <loaderIcon class="icon-load" />
                </div>
                <div v-else>
                    <alertIcon class="icon-alert" />
                </div>
            </div>
            <div class="title">
                <span v-if="video.title">{{video.title}} - {{video_id}}</span>
                <span v-else-if="is_video_loading">読み込み中... - {{video_id}}</span>
                <span v-else>読込失敗 - {{video_id}}</span>
            </div>
            <div class="close">
                <closeIcon class="icon-close" />
            </div>
        </div>
    </li>
</template>

<script>
import loaderIcon from "img/feather/loader.svg";
import closeIcon from "img/feather/x.svg";
import alertIcon from "img/feather/alert-triangle.svg";

import { mapState, mapActions, mapGetters } from "vuex";

export default {
    props: ["video", "video_id"],
    components: {
        closeIcon,
        loaderIcon,
        alertIcon
    },
    computed: {
        ...mapState({
            videos: state => state.videos.items,
            status: state => state.status
        }),
        is_video_loading() {
            return this.$store.getters["videos/is_video_loading"](
                this.video_id
            );
        }
    },
    methods: {
        ...mapActions({
            closeVideo: "videos/closeVideo",
            activateVideo: "status/activateVideo"
        }),
        onClickTab: function(video_id, e) {
            if (e.target.classList.contains("icon-close")) {
                this.closeVideo(video_id);
            } else {
                this.activateVideo(video_id);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
$w: 56px;
$h: $w / 16 * 9;
$light_gray: #444;

.tab {
    flex: 1;
    display: flex;
    flex-flow: column;
    margin-left: 4px;
    overflow: hidden;
    cursor: default;

    transition-property: opacity;
    transition-duration: 0.1s;

    opacity: 0.3;
    max-width: 300px;

    &:hover {
        opacity: 0.6;
        background: $light_gray;
    }

    &.is-active {
        opacity: 1;
        background: $light_gray;
        min-width: 120px;
    }

    .progress {
        background: #666;
        height: 2px;
        width: 100%;
        position: relative;

        .buffered,
        .currentTime {
            position: absolute;
            width: 0;
            height: 2px;
        }

        .buffered {
            position: relative;
            width: 100%;

            .range {
                position: absolute;
                top: 0;
                height: 2px;
                background: #fff;
            }
        }

        .currentTime {
            background: rgb(57, 160, 255);
            width: 8px;
            margin: -5px 0 0 -5px;
            border-radius: 8px;
            height: 8px;
            z-index: 999;
            box-shadow: 0 0 4px 2px rgba(255, 255, 255, 0.33);
        }
    }

    .container {
        display: flex;
        align-items: flex-end;
        position: relative;
        flex-shrink: 0;
        overflow: hidden;
        height: $h;

        .thumbnail {
            width: $w;
            height: $h;
            flex-shrink: 0;

            img {
                width: $w;
                height: $w / 4 * 3;
                position: absolute;
                top: ($h - $w / 4 * 3)/2;
                left: 0;
            }

            div {
                display: flex;
                justify-content: center;
                align-items: center;
                background: #000;
                height: 100%;
            }
        }

        .title {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            flex-grow: 1;
            margin-left: 8px;
            margin-bottom: 8px;
        }

        .close {
            width: $h;
            height: $h;
            flex-shrink: 0;
            justify-content: center;
            align-items: center;
            display: flex;
            svg {
                color: #999;
                width: 20px;
                height: 20px;
            }
            &:hover {
                svg {
                    background: #555;
                    border-radius: $h;
                }
            }
        }
    }
}
</style>
