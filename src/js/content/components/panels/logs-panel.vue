<template>
    <div class="panel">
        <template v-if="logs.error.length > 0">
            <div class="caution">
                エラーが{{logs.error.length}}件発生しました。
                うまく再生できない場合はニコニコ動画で普通に見てください。
            </div>
        </template>
        <ul>
            <li v-for="(item, key) in all_logs" :key="key">
                <dl :class="['log', 'log--' + item.type]">
                    <dt class="title" @click="toggleDetail(key)">
                        <ul class="labels">
                            <li>{{item.timestamp|formartDate}}</li>
                            <li v-if="item.detail && item.detail.video_id">{{item.detail.video_id}}</li>
                        </ul>
                        {{item.title}}
                    </dt>
                    <dd class="detail" :id="'log--' + key">
                        <template v-if="item.detail">{{item.detail}}</template>
                        <template v-else>{}</template>
                    </dd>
                </dl>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
.panel {
    padding: 16px;
    height: 100%;
    overflow-y: auto;

    .caution {
        margin: 0 0 16px;
        color: #999;
        font-size: 12px;
    }

    .log {
        padding: 8px;
        border: 1px solid rgba(0, 0, 0, 0.125);
        margin-bottom: -1px;

        .title {
            display: block;
            .labels {
                display: inline-block;
                li {
                    display: inline-block;
                    border-right: 1px solid rgba(0, 0, 0, 0.125);
                    padding-right: 12px;
                    margin-right: 12px;
                    display: inline-block;
                    line-height: 1;
                }
            }
        }
        .detail {
            display: none;
        }

        &--success {
            background: #dff0d8;
            color: #3c763d;
        }
        &--info {
            background: #252525;
            color: #fff;
        }
        &--warn {
            background: #fcf8e3;
            color: #8a6d3b;
        }
        &--error {
            background: #f2dede;
            color: #a94442;
        }
    }
}
</style>

<script>
import $ from "jquery";
import Moment from "moment";
import { mapState, mapActions, mapGetters } from "vuex";
import FormatHelper from "js/content/lib/format-helper.ts";

export default {
    computed: {
        ...mapState({
            videos: state => state.videos.items,
            video: state => state.videos.items[state.status.active_video_id],
            status: state => state.status,
            setting: state => state.setting,
            logs: state => state.logs
        }),
        ...mapGetters({
            all_logs: "logs/all"
        })
    },
    filters: {
        formartDate: function(datetime) {
            return new Moment(datetime).format("YYYY/MM/DD HH:mm");
        }
    },
    methods: {
        toggleDetail(key) {
            const target = document.getElementById("log--" + key);
            $(target).toggle();
        }
    }
};
</script>
