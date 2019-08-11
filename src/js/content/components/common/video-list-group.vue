<template>
    <ul class="list">
        <li v-for="v in list" :key="v.id">
            <VideoListItem
                :video_id="v.id"
                :thumbnail_src="v.thumbnail_url"
                :title="v.title"
                :posted_date="v.upload_time"
                :view_count="v.view_counter"
                :comment_count="v.num_res"
                :mylist_count="v.mylist_counter"
                :length_in_seconds="v.length_in_seconds"
                :watch_count="v.watch_count"
            />
        </li>
    </ul>
</template>

<style lang="scss" scoped>
.list {
    display: flex;
    flex-direction: column;
}
</style>

<script>
import VideoListItem from "js/content/components/common/video-list-item.vue";

export default {
    components: {
        VideoListItem
    },
    props: ["list"],
    filters: {}
};
</script>
