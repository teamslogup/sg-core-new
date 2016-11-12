export default function roundUp() {
    return function (input) {

        function isFloat(n) {
            return Number(n) === n && n % 1 !== 0;
        }

        var result = '';

        if (input) {
            input = parseFloat(input);
            if (isFloat(input)) {
                result = Math.round(input);
            }
        }

        return result;

    };
}