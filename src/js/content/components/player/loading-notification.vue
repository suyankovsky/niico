<template>
    <div class="loadingNotification">
        <div class="image">
            <NiicoIcon />
        </div>
        <div class="text">NOW LOADING</div>
        <div class="buttons" v-if="is_show_actions">
            <div class="reload" @click="fetchVideo">
                <span>再読み込み</span>
            </div>
            <div class="openNicoVideo" @click="openNicoVideo">ニコニコ動画で開く</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.loadingNotification {
    display: flex;
    flex-flow: column;
    height: 100%;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.6);

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .image {
        animation: bounce 2s ease infinite normal 0s none running;

        @keyframes bounce {
            0%,
            100%,
            20%,
            50%,
            80% {
                transform: translateY(0px);
            }
            40% {
                transform: translateY(-30px);
            }
            60% {
                transform: translateY(-15px);
            }
        }

        svg {
            width: 128px;
            height: 128px;
        }
    }

    .buttons {
        display: flex;
        flex-shrink: 0;
        margin-top: 16px;
        width: 90%;

        .openNicoVideo,
        .reload {
            cursor: pointer;
            padding: 8px 16px;
            border: solid 1px #2a7df6;
            margin: 0 8px;
            width: 50%;
            text-align: center;

            &:hover {
                opacity: 0.8;
            }
        }

        .reload {
            background: #2a7df6;
            font-weight: bold;
        }
    }
}
</style>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import NiicoIcon from "img/niico/niico_bordered.svg";

export default {
    props: ["is_show_actions"],
    components: {
        NiicoIcon
    },
    watch: {},
    computed: {
        ...mapState({
            videos: state => state.videos.items,
            status: state => state.status,
            setting: state => state.setting
        }),
        video_id() {
            return this.status.active_video_id;
        }
    },
    methods: {
        ...mapActions({
            fetchVideo: "videos/fetchVideo",
            openNicoVideo: "videos/openNicoVideo",
            openTweet: "videos/openTweet"
        })
    }
};
</script>
