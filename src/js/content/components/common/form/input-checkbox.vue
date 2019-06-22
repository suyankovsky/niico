<template>
    <label class="niico-checkbox">
        <div class="label">
            {{label}}
        </div>

        <div :class="['checkbox', {'checkbox--on': value}]">
            <div class="circle"></div>
        </div>

        <input
            type="checkbox"
           :value="value"
           v-model="value"

           @change="updateValue"
           @focus="$emit('focus', $event)"
           @blur="$emit('blur', $event)"
        />
    </label>
</template>

<script>
  export default {
    props: [
        'value',
        'label',
    ],
    computed: {
    },

    methods: {
      updateValue (e) {
        const value = e.target.checked ? this.value : null;
        this.$emit('input', value);
        this.$emit('checked', value);
      }
    }
  }
</script>

<style lang="scss" scoped>
    .niico-checkbox {
        display: flex;
        align-items: center;
        width: 100%;
        cursor: pointer;

        .checkbox {
            border-radius: 14px;
            background: #666;
            display: inline-block;

            .circle {
                width: 16px;
                height: 16px;
                border-radius: 12px;
                background: #fff;
                margin: 2px 16px 2px 2px;

                transform: scale(1.4);
                transition-property: margin, transform;
                transition-duration: .1s;
            }

            &--on {
                background: #2a7df6;

                .circle {
                    margin: 2px 2px 2px 16px;
                }
            }
        }

        &:hover {
            .checkbox {
                .circle {
                    transform: scale(1.6);
                }
            }
        }

        .label {
            flex-grow: 1;
        }

        input {
            display: none;
        }
    }
</style>
