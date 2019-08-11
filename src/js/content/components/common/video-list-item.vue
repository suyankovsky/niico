<template>
    <div class="video">
        <div class="thumbnail">
            <a :href="'//www.nicovideo.jp/watch/' + video_id">
                <img :src="thumbnail_src">
                <div class="length_in_seconds" v-if="length_in_seconds">
                    {{length_in_seconds|formatTime}}
                </div>
            </a>
        </div>

        <div class="main">
            <div class="title">
                <a :href="'//www.nicovideo.jp/watch/' + video_id">
                    {{title}}
                </a>
            </div>
            <div class="count" :title="formatted_counts.detail">
                {{formatted_counts.rounded}}
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .video {
        min-width: 300px;
        display: flex;
        margin-bottom: 16px;

        .thumbnail {
            width: 112px;
            height: 63px;
            position: relative;
            overflow: hidden;
            flex-shrink: 0;
            border-radius: 4px;
            box-shadow: 0px 0px 1px 0 rgba(255, 255, 255, .3);

            img {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 100%;
                transform: translate(-50%, -50%);
            }

            .length_in_seconds {
                position: absolute;
                bottom: 2px;
                right: 2px;
                color: #fff;
                font-size: 10px;
                padding: 3px;
                background-color: rgba(0, 0, 0, .8);
                border-radius: 2px;
                line-height: 1;
            }
        }

        .main {
            margin-left: 12px;
            flex-grow: 1;
            display: flex;
            flex-flow: column;
            line-height: 1.4;

            .postedDate {
                line-height: 1;
                color: #999;
                font-size: 11px;
            }

            .title {
                font-size: 14px;
                font-weight: bold;
                margin: 0 0 6px;
                flex-grow: 0;

                a {
                    display: inline;
                }
            }

            .count {
                display: flex;
                color: #999;
                line-height: 1.4;
                font-size: 10px;
            }
        }
    }
</style>

<script>
    import {mapState} from 'vuex';
    import Moment from 'moment';
    import FormatHelper from 'js/content/lib/format-helper.ts';

    export default {
        components: {
        },
        props: [
            'video_id',
            'thumbnail_src',
            'title',
            'posted_date',
            'view_count',
            'comment_count',
            'mylist_count',
            'length_in_seconds',
            'watch_count',
        ],
        computed: {
            ...mapState({
                status: state => state.status,
                setting: state => state.setting,
            }),
            formatted_counts() {
                const count = [
                    {
                        name: 'view_count',
                        raw: this.view_count,
                        detail: FormatHelper.separateByComma(this.view_count) + '視聴',
                        rounded: FormatHelper.roundedNumer(this.view_count) + '視聴',
                    },
                    {
                        name: 'comment_count',
                        raw: this.comment_count,
                        detail: FormatHelper.separateByComma(this.comment_count) + 'コメント',
                        rounded: FormatHelper.roundedNumer(this.comment_count) + 'コメ',
                    },
                    {
                        name: 'mylist_count',
                        raw: this.mylist_count,
                        detail: FormatHelper.separateByComma(this.mylist_count) + 'マイリス',
                        rounded: FormatHelper.roundedNumer(this.mylist_count) + 'マイ',
                    },
                    {
                        name: 'posted_date',
                        raw: this.posted_date,
                        detail: new Moment(this.posted_date).format('YYYY/MM/DD HH:mm') + '投稿',
                        rounded: FormatHelper.relativeDate(this.posted_date),
                    },
                    {
                        name: 'watch_count',
                        raw: this.watch_count,
                        detail: '過去' + FormatHelper.separateByComma(this.watch_count) + '回視聴',
                        rounded: '過去' + FormatHelper.roundedNumer(this.watch_count) + '回視聴',
                    },
                ].filter(item => item.raw !== undefined);

                return {
                    detail: count.map(item => item.detail).join('・'),
                    rounded: count.map(item => item.rounded).join('・'),
                }
            }
        },
        filters: {
            separateByComma: num => {
                return FormatHelper.separateByComma(num);
            },
            formartDate: function(datetime) {
                return new Moment(datetime).format('YYYY/MM/DD HH:mm');
            },
            formatRelativeDate(datetime) {
                return FormatHelper.relativeDate(datetime);
            },
            formatRoundedNumber(num) {
                return FormatHelper.roundedNumer(num);
            },
            formatTime: function(sec) {
                return FormatHelper.convertSecondsToPlayTime(Math.floor(sec));
            },
        },
    }
</script>
