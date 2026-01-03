import { describe, expect, it } from 'vitest';
import {
    tryParseDate,
    parseDateWithPattern,
    createMaskedValue,
    applyMaxValues,
} from '../components/DatePickerInput/useTextInputUtils';

describe('useTextInputUtils', () => {
    const referenceDate = new Date(2025, 0, 1);

    describe('tryParseDate', () => {
        it.each([
            ['full pattern (dd-MM-yyyy)', '18-12-2025', 'dd-MM-yyyy'],
            ['MMM format (dd-MMM-yyyy)', '18-Dec-2025', 'dd-MMM-yyyy'],
            ['short year (dd-MM-yy)', '18-12-25', 'dd-MM-yy'],
        ])('should parse date with %s', (_, value, pattern) => {
            const result = tryParseDate(value, pattern, referenceDate);

            expect(result).toBeInstanceOf(Date);
            expect(result?.getDate()).toBe(18);
            expect(result?.getMonth()).toBe(11);
            expect(result?.getFullYear()).toBe(2025);
        });

        it.each([
            ['invalid date string', 'invalid'],
            ['empty string', ''],
            ['partial input', '18-12'],
        ])('should return null for %s', (_, value) => {
            const result = tryParseDate(value, 'dd-MM-yyyy', referenceDate);

            expect(result).toBeNull();
        });
    });

    describe('parseDateWithPattern', () => {
        it.each([
            ['full pattern', '18-12-2025', 'dd-MM-yyyy'],
            ['MMM format', '18-Dec-2025', 'dd-MMM-yyyy'],
            ['short year', '18-12-25', 'dd-MM-yy'],
        ])('should parse date with %s', (_, value, pattern) => {
            const result = parseDateWithPattern(value, pattern, referenceDate);

            expect(result).toBeInstanceOf(Date);
            expect(result?.getFullYear()).toBe(2025);
        });

        it('should fallback to sliced pattern for partial input', () => {
            const result = parseDateWithPattern('18-12', 'dd-MM-yyyy', referenceDate);

            expect(result).toBeInstanceOf(Date);
            expect(result?.getDate()).toBe(18);
            expect(result?.getMonth()).toBe(11);
        });

        it('should return null for invalid partial input', () => {
            const result = parseDateWithPattern('abc', 'dd-MM-yyyy', referenceDate);

            expect(result).toBeNull();
        });
    });

    describe('createMaskedValue', () => {
        it.each([
            ['date format', '18122025', 'DD/MM/YYYY', '18/12/2025'],
            ['time format', '143022', 'hh:mm:ss', '14:30:22'],
            ['datetime format', '181220251430', 'DD/MM/YYYY hh:mm', '18/12/2025 14:30'],
            ['partial input (trailing delimiter)', '1812', 'DD/MM/YYYY', '18/12/'],
            ['empty input', '', 'DD/MM/YYYY', ''],
            ['single digit', '1', 'DD/MM/YYYY', '1'],
        ])('should handle %s', (_, raw, format, expected) => {
            expect(createMaskedValue(raw, format)).toBe(expected);
        });
    });

    describe('applyMaxValues', () => {
        it.each([
            ['MM', '99', '12'],
            ['DD', '45', '31'],
            ['hh', '25', '23'],
            ['mm', '99', '59'],
            ['ss', '75', '59'],
        ])('should clamp %s to max value', (token, input, expected) => {
            expect(applyMaxValues(input, [token])).toBe(expected);
        });

        it.each([
            ['valid values', '1512', ['DD', 'MM'], '1512'],
            ['YYYY without clamping', '2025', ['YYYY'], '2025'],
            ['padded values', '05', ['MM'], '05'],
            ['partial input', '1', ['MM'], '1'],
            ['multiple tokens', '9999', ['DD', 'MM'], '3112'],
        ])('should handle %s', (_, input, tokens, expected) => {
            expect(applyMaxValues(input, tokens)).toBe(expected);
        });
    });
});
