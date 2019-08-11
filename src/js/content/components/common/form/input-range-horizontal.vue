<template>
    <div class="input-range input-range--horizontal">
        <input
            type="range"
            :min="min"
            :max="max"
            :step="step"
            v-model="value"
            @change="onEvent"
            @click="onEvent"
            @input="onEvent"
            @mousedown="onEvent"
            @mouseup="onEvent"
            @mousemove="onEvent"
            :list="list_id"
            :class="[{'has-buffered': buffered}]"
            :data-allow-key-event="buffered ? true : false"
        />
        <div class="background-bar bar"></div>
        <template v-if="buffered && buffered.length > 0">
            <div class="buffered-bar bar">
                <div
                    class="buffer"
                    v-for="(buffer, key) in buffered"
                    :key="key"
                    :style="[{left: buffer.left+'%'}, {width: buffer.width+'%'}]"
                ></div>
            </div>
        </template>
        <div
            class="current-bar bar"
            :style="{
                width: value_per_distance + '%'
            }"
        ></div>
    </div>
</template>

<style lang="scss" scoped>
$on_slider_height: 6px;
$off_slider_height: 4px;

$on_handle_size: 14px;
$off_handle_size: 10px;

$aninmate_duration: 0.1s;

.input-range {
    position: relative;
    width: 100%;
    min-height: 14px;

    input {
        cursor: pointer;
        -webkit-appearance: none;
        background: transparent;
        height: $on_handle_size;
        width: 100%;
        margin: 0;

        position: absolute;
        top: 50%;
        transform: translateY(-50%);

        &:focus,
        &:blur {
            outline: 10px solid #ccc;
        }

        &::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: $off_handle_size;
            /*height: $off_handle_size;
              border-radius: 50%;
              background: #2a7df6;*/
        }
    }

    .current_handle {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: $off_handle_size;
        height: $off_handle_size;
        border-radius: 50%;
        background: #2a7df6;
        pointer-events: none;

        transition-property: width, height;
        transition-duration: $aninmate_duration;
    }

    .bar {
        height: $off_slider_height;
        position: absolute;
        left: 0;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        pointer-events: none;

        transition-property: width, height;
        transition-duration: $aninmate_duration;
    }

    .background-bar {
        background: #666;
    }

    .current-bar {
        background: #2a7df6;
    }

    .buffered-bar {
        .buffer {
            position: absolute;
            top: 0;
            height: 100%;
            background: #fff;
        }
    }

    &:hover {
        .current_handle {
            width: $on_handle_size;
            height: $on_handle_size;
        }

        .bar {
            height: $on_slider_height;
        }
    }
}
</style>

<script>
export default {
    props: [
        "value",
        "max",
        "min",
        "step",
        "buffered",
        "is_hide_handle",
        "list_id"
    ],
    computed: {
        value_per_max: function() {
            return (this.value / this.max) * 100;
        },
        value_per_distance() {
            const min = this.min | 0;
            const value = this.value - min;
            const max = this.max - min;
            return (value / max) * 100;
        }
    },
    methods: {
        onEvent: function(e) {
            this.$emit(e.type, e);
        }
    }
};
</script>
