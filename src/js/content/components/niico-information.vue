<template>
    <div class="niico-information container">
        <ul>
            <template v-if="all_logs.length >0" v-for="(item, key, index) in alert_log">
                <li :data-type="item.type" v-if="!item.is_read" @click="readMessage($e, item)">
                    <div class="message">
                        {{item.title}}
                    </div>
                    <div class="closeIcon">
                        <CloseIcon />
                    </div>
                </li>
            </template>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
    .container {
        position: fixed;
        top: 0;
        right: 0;
        pointer-events: none;
        width: inherit;

        li {
            pointer-events: all;
            margin: 16px 16px 0 0;
            padding: 12px 16px;
            border-radius: .25rem;
            display: flex;
            font-size: 14px;
            line-height: 1;
            justify-content: space-between;
            cursor: pointer;

            color: #383d41;
            background-color: #e2e3e5;
            border-color: #d6d8db;

            &[data-type='success'] {
                color: #155724;
                background-color: #d4edda;
                border-color: #c3e6cb;
            }

            &[data-type='error'] {
                color: #721c24;
                background-color: #f8d7da;
                border-color: #f5c6cb;
            }

            .message {
                margin-right: 8px;
            }

            .closeIcon {
                width: 14px;
                height: 14px;
                flex-shrink: 0;

                svg {
                    width: 100%;
                    height: 100%;
                }
            }

            &:hover {
                opacity: .8;
            }
        }
    }
</style>

<script>
    import $ from 'jquery';
    import CloseIcon from 'img/feather/x.svg';
    import {mapState, mapActions, mapGetters} from 'vuex';

    export default {
        components: {
            CloseIcon,
        },
        computed: {
            ...mapState({
                videos: state => state.videos.items,
                video: state => state.videos.items[state.status.active_video_id],
                status: state => state.status,
                setting: state => state.setting,
                logs: state => state.logs,
            }),
            ...mapGetters({
                all_logs: 'logs/all',
                alert_log: 'logs/alert_log',
            }),
        },
        filters: {
        },
        methods: {
            readMessage($e, item) {
                this.$store.commit('logs/read', item);
            },
        },
    }
</script>
