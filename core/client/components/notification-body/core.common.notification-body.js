export default function notificationBody(metaManager) {
    return function (notificationBox, language) {

        var LANGUAGES = metaManager.langs;
        var result = '';

        if (LANGUAGES.hasOwnProperty(language)) {
            var localLanguage = LANGUAGES[language];

            if (localLanguage.hasOwnProperty(notificationBox.notification.notificationBoxBody)) {

                result = localLanguage[notificationBox.notification.notificationBoxBody];

                for (var key in notificationBox.payload) {
                    if (notificationBox.payload.hasOwnProperty(key)) {
                        result = result.replace(':' + key + ':', "'" + notificationBox.payload[key] + "'");
                    }
                }
            }
        }

        return result;
    };
}