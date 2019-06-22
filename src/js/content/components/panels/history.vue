<template>
    <div class="panel">
        <div class="information">
            <a href="//www.nicovideo.jp/my/history" target="_blank">
                視聴履歴ページへ
            </a>
        </div>
        <template v-if="histories.code > 0">
            <VideoListGroup :list="histories.content" />
        </template>
        <template v-else>
            {{histories.content}}
        </template>
    </div>
</template>

<style lang="scss" scoped>
    .panel {
        padding: 16px;
        height: 100%;
        overflow-y: auto;

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
    }
</style>

<script>
    import {mapState, mapActions, mapGetters} from 'vuex';
    import VideoListGroup from 'js/content/components/common/video-list-group.vue';

    export default {
        components: {
            VideoListGroup,
        },
        computed: {
            ...mapState({
                videos: state => state.videos.items,
                status: state => state.status,
                setting: state => state.setting,
            }),
            ...mapGetters({
                histories: 'viewerHistory/histories',
            }),
        },
        mounted() {
            this.$store.dispatch('viewerHistory/load');
        },
        watch: {
        },
        filters: {
        },
        methods: {
        },
    }
</script>
