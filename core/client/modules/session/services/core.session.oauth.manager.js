export default function oauthManager() {
    var oauth = window.oauth;
    return {
        $get: function () {
            return oauth;
        }
    };
}