<template>
    <div class="panel">
        <template v-if="comments <= -3">
            読み込み中です。
        </template>
        <template v-else-if="comments < 0">
            読み込みに失敗しました。
        </template>
        <template v-else>
            <ul class="sorter">
                <li>
                    <NiicoCheckbox
                        :label="'自動スクロール'"
                        :value="comment_is_auto_scroll"
                        v-model="comment_is_auto_scroll"
                    />
                </li>
                <li>
                    <NiicoSelect
                        :options="sort_choices"
                        :value="comment_sort_by"
                        v-model="comment_sort_by"
                    />
                </li>
            </ul>
            <div class="thread" ref="container" id="niico-comment-panel-scroll-event-target">
                <template v-for="(comment, comment_id, index) in comments">
                    <section class="comment" :id="'niico-comment-panel-no-' + comment.no">
                        <aside>
                            <div class="vpos property">
                                <a  :title="comment.vpos|formatTime" :data-seektime="comment.vpos|formatTime">
                                    {{comment.vpos|formatTime}}
                                </a>
                            </div>
                            <div class="mail property" :title="comment.mail">
                                {{comment.mail}}
                            </div>
                            <div class="no property" :title="'No.' + comment.no">
                                No.{{comment.no}}
                            </div>
                            <div class="date property" :title="comment.date|formartDate">
                                {{comment.date|formartDate}}投稿
                            </div>
                        </aside>
                        <main>
                            {{comment.content}}
                        </main>
                        <div style="display:none">

                        </div>
                    </section>
                </template>
            </div>
        </template>
    </div>
</template>

<style lang="scss" scoped>
    .panel {
        display: flex;
        flex-flow: column;
        overflow: hidden;
        height: 100%;
    }

    .sorter {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        flex-shrink: 0;
        padding: 8px 16px;

        li {
            width: 40%;
        }
    }

    .thread {
        overflow-y: scroll;
        overflow-x: hidden;
        padding: 0 16px 16px;
    }

    .comment {
        border-top: solid 1px #252525;
        padding: 8px 0;

        aside {
            color: #444;
            display: flex;
            font-size: 10px;
            line-height: 1;

            .vpos {
                flex-grow: 1;
                flex-shrink: 0;
                margin-right: 8px;

                a {
                    display: inline;
                    cursor: pointer;
                }
            }

            .mail,
            .no {
                margin-right: 8px;
            }

            .property {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }

        main {
            margin-top: 6px;
            font-size: 14px;
            line-height: 1.4;
        }
    }
</style>

<script>
    import $ from 'jquery';
    import Moment from 'moment';

    import {mapState, mapActions, mapGetters} from 'vuex';
    import FormatHelper from 'js/content/lib/format-helper.js';
    import sort_choices from 'js/content/map/comment-sort-choices.js';

    import NiicoSelect from 'js/content/components/common/form/input-select.vue';
    import NiicoCheckbox from 'js/content/components/common/form/input-checkbox.vue';

    export default {
        components: {
            NiicoSelect,
            NiicoCheckbox,
        },
        filters: {
            formartDate: function(datetime) {
                return new Moment(datetime * 1000).format('YYYY/MM/DD HH:mm');
            },
            formatTime: function(sec) {
                return FormatHelper.convertSecondsToPlayTime(Math.floor(sec));
            },
        },
        watch: {
            'comment_is_auto_scroll': function(comment_is_auto_scroll) {
                if(comment_is_auto_scroll) {
                    this.comment_sort_by = 'vpos_asc';
                }
            },
            'comment_sort_by': function(comment_sort_by) {
                if(comment_sort_by !== 'vpos_asc') {
                    this.comment_is_auto_scroll = false;
                }
                $(this.scrollEventTarget).scrollTop(0);
            },
            'video.current_time': function(current_time) {
                if(!this.comment_is_auto_scroll) return;
                this.comment_auto_scroll(current_time);
            },
        },
        data() {
            return {
                sort_choices,
                scroll_container_id: 'niico-comment-panel-scroll-event-target',
                comment_id_prefix: 'niico-comment-panel-no-',
            }
        },
        computed: {
            ...mapState({
                videos: state => state.videos.items,
                video: state => state.videos.items[state.status.active_video_id],
                status: state => state.status,
                setting: state => state.setting,
            }),
            ...mapGetters({
                thread: 'comments/thread',
                comments: 'comments/comments',
                comments_for_scroll: 'comments/comments_for_scroll',
                comment_no_to_scroll: 'comments/comment_no_to_scroll',
            }),
            comment_sort_by: {
                get() {
                    return this.setting.comment_sort_by
                },
                set(e) {
                    this.$store.commit('setting/changeCommentSortBy', e);
                },
            },
            comment_is_auto_scroll: {
                get() {
                    return this.setting.comment_is_auto_scroll
                },
                set(e) {
                    this.$store.commit('setting/changeCommentIsAutoScroll', e);
                },
            },
        },
        methods: {
            // 自動スクロールを実行する
            comment_auto_scroll: function(current_time) {
                const container_el = document.getElementById(this.scroll_container_id);
                if(!container_el) return;
                const base = container_el.scrollTop - container_el.offsetTop;

                const el_to_scroll_id = this.comment_id_prefix + this.comment_no_to_scroll;
                const comment_el = document.getElementById(el_to_scroll_id);
                if(!comment_el) return;
                const relative_distance = comment_el.getBoundingClientRect().top;

                container_el.scrollTop = relative_distance + base;
            },
        },
        mounted() {
            // コメントをマウスホイールでスクロールしたら、自動スクロールはオフにする
            $(document).off('wheel').on('wheel', e => {
                // コメントパネルが開かれてるときだけ実行する
                if(this.setting.active_panel_id !== 'CommentPanel') return;

                // 自動スクロールがオフだったら何もしない
                if(! this.comment_is_auto_scroll) return;

                // ホイールしてる場所がコメントパネルじゃなければ何もしない
                const wheel_target_is_comment_panel = $(e.target).parents('#'+this.scroll_container_id).length;
                if(!wheel_target_is_comment_panel) return;

                // スクロールされたら、自動スクロールをオフにする
                this.comment_is_auto_scroll = false;
            });
        }
    }
</script>
