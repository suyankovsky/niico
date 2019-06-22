<template>
    <div class="niico-select">
        <select
            :value="value"

            @input="updateValue"
            @focues="$emit('focus', $event)"
            @blur="$emit('blur', $event)"
        >
            <template v-for="(key, value) in options">
                <option :value="value">{{key}}</option>
            </template>
        </select>
        <div class="icon">
            <ChevronDownIcon />
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .niico-select {
        position: relative;
        cursor: pointer;
        display: inline-block;

        select {
            cursor: pointer;
            -webkit-appearance: none;
            border-radius: 0;
            border: 0;
            background: transparent;
            color: #fff;
            padding: 4px 0;
            border-bottom: solid 1px #2a7df6;
            width: 100%;
            margin-right: 16px;
        }

        .icon {
            width :14px;
            height: 14px;

            position:absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
        }
    }
</style>

<script>
    import ChevronDownIcon from 'img/feather/chevron-down.svg';

    export default {
        components: {
            ChevronDownIcon,
        },
        props: [
            'options',
            'value',
        ],
        computed: {
        },
        methods: {
            updateValue(e) {
                const value = e.target.selectedOptions.length ? e.target.selectedOptions[0]._value : null
                this.$emit('input', value)
                this.$emit('selected', value)
            },
        }
    }
</script>
