<template>
    <div class="wrapper">
        <h4>Default datepicker</h4>
        <VueDatePicker v-model="selectedDate" placeholder="Select Date" />

        <div class="date-picker-container">
            <h4>Custom input with MMM format (dd-MMM-yyyy)</h4>
            <VueDatePicker
                v-model="date"
                model-type="yyyy-MM-dd"
                :formats="{ input: 'dd-MMM-yyyy' }"
                :auto-apply="true"
            >
                <template #dp-input="{ value, onInput, onClear }">
                    <input
                        type="text"
                        :value="value"
                        class="date-input"
                        @input="handleInput($event, onInput, onClear)"
                    />
                </template>
            </VueDatePicker>
            <div class="model-value">Model value: {{ date }}</div>
        </div>

        <div class="date-picker-container">
            <h4>Custom input with short year format (dd-MM-yy)</h4>
            <VueDatePicker
                v-model="dateShortYear"
                model-type="yyyy-MM-dd"
                :formats="{ input: 'dd-MM-yy' }"
                :auto-apply="true"
            >
                <template #dp-input="{ value, onInput, onClear }">
                    <input
                        type="text"
                        :value="value"
                        class="date-input"
                        placeholder="dd-MM-yy"
                        @input="handleInput($event, onInput, onClear)"
                    />
                </template>
            </VueDatePicker>
            <div class="model-value">Model value: {{ dateShortYear }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import { VueDatePicker } from '../src';

    const selectedDate = ref();

    const date = ref();

    const dateShortYear = ref();

    const handleInput = (e: Event, onInputFn: (e: Event) => void, onClearFn: (e: Event) => void) => {
        if (e.target instanceof HTMLInputElement && e.target.value === '') {
            onClearFn(e);

            return;
        }

        onInputFn(e);
    };
</script>

<style lang="scss">
    .wrapper {
        padding: 200px;
    }

    .date-picker-container {
        margin-top: 2rem;
        width: 100%;
    }

    .date-input {
        box-sizing: border-box;
        border: 1px solid #ccc;
        width: 100%;
        padding: 0.5rem;
    }

    .model-value {
        margin-top: 0.5rem;
        font-family: monospace;
    }

    h4 {
        margin: 0 0 0.5rem 0;
        font-weight: 500;
        color: #333;
    }
</style>
