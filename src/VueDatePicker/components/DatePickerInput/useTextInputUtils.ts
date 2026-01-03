import { isDate, isValid, parse } from 'date-fns';
import type { Locale } from 'date-fns';

/**
 * Try to parse a date string with the given pattern.
 * Returns the parsed Date if valid, null otherwise.
 */
export const tryParseDate = (value: string, pattern: string, referenceDate: Date, locale?: Locale): Date | null => {
    const parsed = parse(value, pattern, referenceDate, { locale });

    return isValid(parsed) && isDate(parsed) ? parsed : null;
};

/**
 * Parse a date string, trying the full pattern first,
 * then falling back to a sliced pattern for partial input.
 */
export const parseDateWithPattern = (
    value: string,
    pattern: string,
    referenceDate: Date,
    locale?: Locale,
): Date | null => {
    let parsedDate = tryParseDate(value, pattern, referenceDate, locale);

    if (!parsedDate && value.length < pattern.length) {
        parsedDate = tryParseDate(value, pattern.slice(0, value.length), referenceDate, locale);
    }

    return parsedDate;
};

/**
 * Create a masked value by applying delimiters based on the mask format.
 * Supports tokens: YYYY, MM, DD, hh, mm, ss
 */
export const createMaskedValue = (raw: string, maskFormat: string): string => {
    const tokenPattern = /(YYYY|MM|DD|hh|mm|ss)/g;
    const tokens: string[] = [...maskFormat.matchAll(tokenPattern)].map((m) => m[0]);
    const delimiters: string[] = maskFormat.replace(tokenPattern, '|').split('|').filter(Boolean);
    const tokenLengths: number[] = tokens.map((t) => t.length);

    let masked = '',
        index = 0;

    for (let i = 0; i < tokens.length; i++) {
        const len = tokenLengths[i]!;
        const part = raw.slice(index, index + len);
        if (!part) break;
        masked += part;
        if (part.length === len && delimiters[i]) masked += delimiters[i];
        index += len;
    }

    return masked;
};

/**
 * Apply maximum value constraints to raw numeric input.
 * Clamps values: MM (max 12), DD (max 31), hh (max 23), mm/ss (max 59)
 */
export const applyMaxValues = (raw: string, tokens: string[]): string => {
    const maxValues: Record<string, number> = {
        MM: 12,
        DD: 31,
        hh: 23,
        mm: 59,
        ss: 59,
    };

    let result = '',
        index = 0;

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]!;
        const len = token.length;
        const part = raw.slice(index, index + len);
        if (!part) break;

        if (part.length < len) {
            result += part;
        } else {
            let num = Number.parseInt(part, 10);
            if (maxValues[token] && num > maxValues[token]) num = maxValues[token];
            result += num.toString().padStart(len, '0').slice(0, len);
        }

        index += len;
    }

    return result;
};
