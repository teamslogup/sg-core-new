(function () {

    angular.module("core.base").provider("metaManager", metaManager);

    /* @ngInject */
    function metaManager() {

        var meta = window.meta;
        var mix = JSON.parse(JSON.stringify(meta.langs));
        var codes = meta.codes;

        for (var k in codes) {
            if (!mix[k]) mix[k] = {};
            for (var kk in codes[k]) {
                mix[k][kk] = codes[k][kk];
            }
        }

        meta.mix = mix;

        return {
            // for provider.
            getMixed: function() {
                return mix;
            },
            // for service object.
            $get: function () {
                return meta;
            }
        };
    }

})();