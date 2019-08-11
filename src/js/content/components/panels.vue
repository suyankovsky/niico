<template>
    <div class="panels">
        <ul class="panels__menu">
            <template v-for="(panel, panel_id, index) in panel_map">
                <li
                    :class="[{'is-active': setting.active_panel_id == panel_id}]"
                    @click="changePanel(panel_id)"
                >
                    {{panel.heading}}
                </li>
            </template>
        </ul>
        <div class="panels__main">
            <component :is="panel_map[setting.active_panel_id].component" />
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {mapMutations,mapState, mapActions, mapGetters} from 'vuex';
    import panel_map from 'js/content/map/panel-map.ts';

    export default {
        components: {
            ...panel_map.getMap(),
        },
        computed: {
            ...mapState({
                videos: state => state.videos.items,
                status: state => state.status,
                setting: state => state.setting,
                logs: state => state.logs,
            }),
            panel_map() {
                const panel_map = this.$store.getters['setting/panel_map'];

                let return_panel_map = {};
                Object.keys(panel_map).filter(
                    key => {
                        if(key == 'DebugPanel' && !this.setting.is_show_debug_panel) {
                            return false;
                        };

                        if(key == 'LogsPanel' && !this.setting.is_show_log_panel) {
                            return false;
                        }

                        return true;
                    }
                ).forEach(
                    key => {
                        return_panel_map[key] = panel_map[key];
                    }
                );

                return return_panel_map;
            },
        },
        methods: {
            ...mapMutations({
                changePanel: 'setting/changePanel',
            })
        },
    }
</script>

<style lang="scss" scoped>
    .panels {
        flex-grow: 1;
        flex-shrink: 1;
        overflow: hidden;
        display: flex;
        min-width: 240px;
        height: 100%;

        &__menu {
            width: 120px;
            background: #252525;
            flex-shrink: 0;
            overflow-y: auto;
            line-height: 1;

            li {
                display: block;
                padding: 12px 16px;
                color: #777;
                cursor: pointer;
                font-size: 13px;
                position: relative;

                &.is-active {
                    color: #fff;
                    font-weight: bold;
                    background: #111;
                }
            }
        }

        &__main {
            flex-grow: 1;
            flex-shrink: 1;
            overflow-y: auto;
        }
    }
</style>
