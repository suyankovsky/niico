<template>
    <div class="panel">
        <template v-if="is_video_loading">
            読み込み中...
        </template>
        <template v-else-if="is_parse_error">
            動画情報の取得に失敗しました。
        </template>
        <template v-else>
            <div class="title">{{video.title}}</div>
            <ul class="count">
                <li title="視聴数">
                    <ViewCountIcon />
                    <span>{{video.viewCount | separateByComma}}</span>
                </li>
                <li title="コメント数">
                    <CommentCountIcon />
                    <span>{{video.commentCount | separateByComma}}</span>
                </li>
                <li title="マイリスト数">
                    <MylistCountIcon />
                    <span>{{video.mylistCount | separateByComma}}</span>
                </li>
            </ul>
            <div :class="['tags', {'is_horizontal_scroll': is_horizontal_scroll}]">
                <div
                    v-for="(tag, key, index) in video.tags"
                    class="tag"
                >
                    <a
                        :href="'//www.nicovideo.jp/tag/' + tag.name"
                        target="_blank"
                        class="name"
                    >
                        {{tag.name}}
                    </a>
                    <a
                        :href="'//dic.nicovideo.jp/a/' + tag.name"
                        target="_blank"
                        class="dic"
                    >
                        <template v-if="tag.isDictionaryExists">
                            <NicoDicOnIcon class="icon icon--on" />
                        </template>
                        <template v-else>
                            <NicoDicOffIcon class="icon icon--off" />
                        </template>
                    </a>
                </div>
            </div>

            <hr />

            <div class="owner">
                <template v-if="video.uploader.is_public">
                    <a class="ownerIcon" :href="video.uploader.href" target="_blank">
                        <img :src="video.uploader.icon_src">
                    </a>
                    <div class="ownerInfo">
                        <div class="ownerName">
                            <a :href="video.uploader.href" target="_blank">
                                {{video.uploader.name}}
                            </a>
                        </div>
                        <div class="postedDate">{{video.posted_date|formartDate}}に投稿</div>
                    </div>
                </template>
                <template v-else>
                    <div class="ownerIcon">
                        <img :src="video.uploader.icon_src">
                    </div>
                    <div class="ownerInfo ownerInfo--is_notPublic">
                        <div class="ownerName">
                            {{video.uploader.name}}
                        </div>
                        <div class="postedDate">{{video.posted_date|formartDate}}に投稿</div>
                    </div>
                </template>
            </div>

            <div class="description" v-html="video.description"></div>

            <hr />

            <ul class="metaInformations">
                <li v-if="prefixed_id">
                    動画ID： {{prefixed_id}}
                    <a :href="'https://www.nicovideo.jp/watch/' + prefixed_id" target="_blank">
                        （https://www.nicovideo.jp/watch/{{prefixed_id}}）
                    </a>
                </li>
                <li v-if="thread_id">
                    スレッドID： {{thread_id}}
                    <a :href="'https://www.nicovideo.jp/watch/' + thread_id" target="_blank">
                        （https://www.nicovideo.jp/watch/{{thread_id}}）
                    </a>
                </li>
            </ul>

            
        </template>
    </div>
</template>

<style lang="scss" scoped>
    .panel {
        padding: 16px 16px 40px;
        height: 100%;
        overflow-y: auto;

        .title {
            font-size: 20px;
            font-weight: bold;
            line-height: 1.4;
            letter-spacing: 0.02em;
        }

        .count {
            color: #999;
            margin: 8px 0 16px;

            li {
                display: inline-flex;
                line-height: 1;
                margin-right: 12px;

                span {
                }

                svg {
                    display: inline;
                    fill: #777;
                    margin-right: 6px;
                    width: 12px;
                    height: 12px;
                }
            }
        }

        .tags {
            &.is_horizontal_scroll {
                white-space: nowrap;
                overflow-x: auto
            }

            .tag {
                display: inline-block;

                width: auto;
                border-radius: 14px;
                margin: 0 4px 4px 0;
                padding: 0 26px 0 10px;
                position: relative;

                letter-spacing: 0.02em;
                background: #282828;

                .name {
                    line-height: 22px;
                    font-size: 12px;
                }

                .dic {
                    width: 16px;
                    height: 16px;
                    position: absolute;
                    top: 3px;
                    right: 4px;
                    bottom: 3px;
                    border-radius: 100%;
                    overflow: hidden;

                    .icon {
                        display: inline-block;
                        vertical-align: top;
                        width: 100%;
                        height: 100%;
                        padding: 18.8%;
                        fill: #fff;

                        &--on {
                            background: #8c0000;
                        }
                        &--off {
                            background: #727272;
                        }
                    }
                }
            }
        }

        hr {
            border-color: #333;
            margin: 16px 0 24px;
        }

        .owner {
            display: flex;
            .ownerIcon {
                width: 32px;
                height: 32px;
                margin-right: 8px;
                flex-shrink: 0;
                border-radius: 32px;
                overflow: hidden;

                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .ownerInfo {
                display: flex;
                flex-flow: column;
                justify-content: center;

                .ownerName {
                    font-size: 14px;
                    line-height: 1;
                    margin-bottom: 4px;

                    a {
                        display: inline;
                    }
                }

                .postedDate {
                    font-size: 10px;
                    color: #999;
                }

                &--is_notPublic {
                    .ownerName {
                        font-style: italic;
                        color: #999;
                    }
                }
            }
        }

        .description {
            margin: 16px 0 0 40px;
        }

        .metaInformations {
            a {
                color: #2a7df6;
                display: inline-block;
                word-break: break-all;
                font-size: 11px;
            }

            li {
                color: #999;
                margin: 12px 0;
            }
        }
    }
</style>

<script>
    import Moment from 'moment';
    import {mapState, mapActions, mapGetters} from 'vuex';
    import FormatHelper from 'js/content/lib/format-helper.ts';

    import NicoDicOnIcon from 'img/nicovideo/nico-dic-available.svg';
    import NicoDicOffIcon from 'img/nicovideo/nico-dic-unavailable.svg';
    import ViewCountIcon from 'img/nicovideo/view-count.svg';
    import CommentCountIcon from 'img/nicovideo/comment-count.svg';
    import MylistCountIcon from 'img/nicovideo/mylist-count.svg';

    export default {
        components: {
            NicoDicOnIcon,
            NicoDicOffIcon,
            ViewCountIcon,
            CommentCountIcon,
            MylistCountIcon,
        },
        computed: {
            ...mapState({
                videos: state => state.videos.items,
                video: state => state.videos.items[state.status.active_video_id],
                video_id: state => state.status.active_video_id,
                status: state => state.status,
                setting: state => state.setting,
            }),
            is_video_loading() {
                return this.$store.getters['videos/is_video_loading'](this.video_id);
            },
            is_parse_error() {
                return this.$store.getters['videos/is_parse_error'](this.video_id);
            },
            cannot_render_video_html_reasons: function() {
                return this.$store.getters['videos/cannot_render_video_html_reasons'](this.video_id);
            },
            is_horizontal_scroll: function() {
                return this.setting.is_horizontal_scroll;
            },
            prefixed_id() {
                return this.video.original_data.video.id || this.video_id;
            },
            thread_id() {
                if(this.video.is_channel) {
                    return this.video.original_data.thread.ids.community;
                }

                return this.video.original_data.thread.ids.default;
            },
        },
        filters: {
            separateByComma: num => {
                return FormatHelper.separateByComma(num);
            },
            formartDate: (datetime) => {
                return new Moment(datetime, 'YYYY/MM/DD HH:mm:SS').format('YYYY/MM/DD HH:mm');
            },
        },
        methods: {
        },
    }
</script>
