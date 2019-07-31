<template>
    <div class="panel">
        <div class="information">
            動画投稿のニコレポのみ表示しています。
            <a href="//www.nicovideo.jp/my/top" target="_blank">
                本家ニコレポページ
            </a>
        </div>
        <template v-if="!is_loggedin">
            ログインしてください。
        </template>
        <template v-else-if="is_loading">
            読み込み中...
        </template>
        <template v-else-if="nicorepo.length > 0">
            <ul>
                <li v-for="(line) in upload_topic" class="line">
                    <div class="icon">
                        <img :src="line.sender.thumbnail_src">
                    </div>
                    <div class="detail">
                        <div class="name">
                            <a :href="line.sender.url" target="_blank">
                                {{line.sender.name}}
                            </a>
                            <span v-if="line.sender.type == 'channel'">
                                チャンネル
                            </span>
                        </div>
                        <div class="video">
                            <VideoListItem
                                :video_id="line.video.id"
                                :thumbnail_src="line.video.thumbnailUrl.normal"
                                :title="line.video.title"
                                :posted_date="line.createdAt"
                            />
                        </div>
                    </div>
                </li>
            </ul>
            <div class="button button--center" @click="load">
                もっと見る
            </div>
        </template>
    </div>
</template>

<style lang="scss" scoped>
    .panel {
        padding: 16px;
        height: 100%;
        overflow-x: hidden;
        overflow-y: scroll;

        .information {
            margin: 0 0 20px;
            text-align: center;
            color: #666;
            border: solid 1px #252525;
            padding: 12px 8px;
            font-size: 12px;

            a {
                color: #fff;
                display: inline;
            }
        }

        ul {
            overflow: hidden;

            li {
                display: flex;
                margin-bottom: 12px;

                .icon {
                    margin: 0 12px 0 0;

                    img {
                        width: 48px;
                        height: 48px;
                        border-radius: 48px;
                    }
                }

                .detail {
                    overflow: hidden;

                    .name {
                        margin-bottom: 8px;

                        a,
                        span {
                            display: inline-block;
                            line-height: 1;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            max-width: 100%;
                        }

                        a {
                            color: #999;
                        }

                        span {
                            color: #333;
                            font-style: italic;
                        }
                    }

                    .video {

                    }
                }
            }
        }
    }
</style>

<script>
    import {mapState, mapActions, mapGetters} from 'vuex';
    import VideoListItem from 'js/content/components/common/video-list-item.vue';

    export default {
        components: {
            VideoListItem,
        },
        computed: {
            ...mapState({
                videos: state => state.videos.items,
                video: state => state.videos.items[state.status.active_video_id],
                status: state => state.status,
                setting: state => state.setting,
                uploaders: state => state.uploaders.items,
                nicorepo: state => state.nicorepo.items,
            }),
            ...mapGetters({
                upload_topic: 'nicorepo/upload_topic',
                is_loading: 'nicorepo/is_loading',
                is_loggedin: 'status/is_loggedin',
            }),
        },
        mounted() {
            this.load();
        },
        watch: {
        },
        filters: {
        },
        methods: {
            ...mapActions({
                load: 'nicorepo/load',
            })
        },
    }
</script>
