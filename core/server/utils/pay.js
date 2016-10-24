
module.exports = {
    generateOrderNumber: function() {
        var today = new Date();
        var y = today.getFullYear();
        var m = today.getMonth() + 1;
        var d = today.getDate();
        var time = today.getTime();
        if (parseInt(m) < 10) {
            m = "0" + m;
        }
        if (parseInt(m) < 10) {
            d = "0" + d;
        }
        var orderIdxx = y + "" + m + "" + d + "" + time;
        return orderIdxx;
    }
};