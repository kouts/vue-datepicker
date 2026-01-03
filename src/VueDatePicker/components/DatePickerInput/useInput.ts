import { computed, ref } from 'vue';
import { set } from 'date-fns';
import { useContext, useHelperFns } from '@/composables';
import { parseDateWithPattern, createMaskedValue, applyMaxValues } from './useTextInputUtils';

export const useInput = () => {
    const {
        getDate,
        rootProps,
        defaults: { textInput, startTime, timeConfig },
    } = useContext();
    const { getTimeObjFromCurrent } = useHelperFns();

    const textPasted = ref(false);

    const assignTimeTextInput = computed(() =>
        Array.isArray(startTime.value)
            ? startTime.value[0]
            : (startTime.value ?? getTimeObjFromCurrent(getDate(), {}, timeConfig.value.enableSeconds)),
    );

    const parseWithPattern = (value: string, pattern: string, inputVal?: string): Date | null => {
        const parsedDate = parseDateWithPattern(value, pattern, getDate(), rootProps.locale);

        if (parsedDate) {
            if (inputVal || textPasted.value) return parsedDate;

            return set(parsedDate, {
                hours: +assignTimeTextInput.value!.hours,
                minutes: +assignTimeTextInput.value!.minutes,
                seconds: +(assignTimeTextInput.value!.seconds ?? 0),
                milliseconds: 0,
            });
        }

        return null;
    };

    const parseFreeInput = (value: string, inputVal?: string): Date | null => {
        const pattern = textInput.value.pattern;

        if (typeof pattern === 'function') {
            return pattern(value as never) as unknown as Date;
        }

        const patterns = typeof pattern === 'string' ? [pattern] : pattern;

        if (Array.isArray(patterns)) {
            for (const p of patterns) {
                const parsed = parseWithPattern(value, p, inputVal);
                if (parsed) return parsed;
            }
        }

        return null;
    };

    return {
        textPasted,
        parseFreeInput,
        applyMaxValues,
        createMaskedValue,
    };
};
