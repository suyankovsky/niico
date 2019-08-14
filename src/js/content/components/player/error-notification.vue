<template>
    <div class="error-notification">
        <div class="image">
            <NiicoIcon />
        </div>
        <h1>エラーが発生しました。</h1>
        <main>
            <div class="reasons">
                <template v-for="reason in cannot_render_video_html_reasons">
                    <div class="reason" :key="reason.code">
                        <p class="error-message">{{reason.message}}</p>
                        <p class="error-code">エラーコード：{{reason.code}}</p>
                    </div>
                </template>
            </div>
            <div class="buttons">
                <div class="reload" @click="reLoadVideo(video_id)">
                    <span>再読み込み</span>
                </div>
                <div class="openNicoVideo" @click="openNicoVideo">ニコニコ動画で開く</div>
            </div>
        </main>
    </div>
</template>

<style lang="scss" scoped>
.error-notification {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 24px;

    .image {
        margin-bottom: 8px;
        flex-shrink: 0;

        svg {
            width: 64px;
            height: 64px;
            text-align: center;
        }
    }

    h1 {
        font-size: 24px;
        font-weight: bold;
        color: #999;
        line-height: 1;
        flex-shrink: 0;
    }

    main {
        width: 90%;
        text-align: center;
        flex-shrink: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .reasons {
            margin: 16px 0;
            text-align: center;
            line-height: 1.4;
            flex-shrink: 1;
            overflow-y: auto;

            .reason {
                &:not(:first-child) {
                    margin-top: 8px;
                }

                .error-message {
                    font-size: 14px;
                }

                .error-code {
                    color: #999;
                    font-size: 10px;
                }
            }
        }

        .buttons {
            display: flex;
            flex-shrink: 0;
            margin-top: 16px;

            .openNicoVideo,
            .reload {
                cursor: pointer;
                padding: 8px 16px;
                border: solid 1px #2a7df6;
                margin: 0 8px;
                width: 50%;

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
}
</style>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import NiicoIcon from "img/niico/niico_bordered.svg";

export default {
    props: ["video", "video_id"],
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
        cannot_render_video_html_reasons: function() {
            return this.$store.getters[
                "videos/cannot_render_video_html_reasons"
            ](this.video_id);
        }
    },
    methods: {
        ...mapActions({
            reLoadVideo: "videos/reLoadVideo",
            openNicoVideo: "videos/openNicoVideo",
            openTweet: "videos/openTweet"
        })
    }
};
</script>
