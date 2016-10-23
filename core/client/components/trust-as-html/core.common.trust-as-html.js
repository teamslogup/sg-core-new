export default function trustAsHtml($sce) {
    return function (string) {

        var result = '';

        if (typeof string == 'string') {
            result = $sce.trustAsHtml(string);
        }

        return result;
    };
}