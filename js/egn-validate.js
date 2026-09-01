(function (global) {
    'use strict';

    const EGN_REGEX = /^\d{10}$/;
    const EGN_WEIGHTS = Object.freeze([2, 4, 8, 5, 10, 9, 7, 3, 6]);

    function normalizeInput(value) {
        if (value == null) return '';
        return String(value).trim();
    }

    function decodeBirthDate(digits) {
        const year = digits[0] * 10 + digits[1];
        let month = digits[2] * 10 + digits[3];
        const day = digits[4] * 10 + digits[5];

        let fullYear = 1900 + year;
        if (month > 40) {
            month -= 40;
            fullYear = 2000 + year;
        } else if (month > 20) {
            month -= 20;
            fullYear = 1800 + year;
        }

        return { fullYear: fullYear, month: month, day: day };
    }

    function isValidDate(digits) {
        const birthDate = decodeBirthDate(digits);
        const date = new Date(birthDate.fullYear, birthDate.month - 1, birthDate.day);
        return (
            date.getFullYear() === birthDate.fullYear &&
            date.getMonth() === birthDate.month - 1 &&
            date.getDate() === birthDate.day
        );
    }

    function calculateChecksum(digits) {
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += digits[i] * EGN_WEIGHTS[i];
        }

        const checksum = sum % 11;
        return checksum === 10 ? 0 : checksum;
    }

    function isValidEgn(egn) {
        const normalizedEgn = normalizeInput(egn);
        if (!EGN_REGEX.test(normalizedEgn)) {
            return false;
        }

        const digits = Array.from(normalizedEgn, Number);
        if (!isValidDate(digits)) {
            return false;
        }

        return digits[9] === calculateChecksum(digits);
    }

    global.isValidEgn = isValidEgn;

    global.validateEgnClient = isValidEgn;

})(typeof globalThis !== 'undefined' ? globalThis : window);