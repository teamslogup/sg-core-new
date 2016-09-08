export default function toMicrotime() {
    return function (time) {
        var microtime;
        if (time instanceof Date) {
            microtime = Number(time.getTime() + '000');
        } else if (time instanceof Number) {
            microtime = Number(time + '000');
        } else if (typeof time == 'string') {
            microtime = new Date(time);
            if (!microtime) {
                return "Error Time";
            }
            microtime = Number(microtime.getTime() + '000');
        } else {
            microtime = "Error Time";
        }
        return microtime;
    };
}