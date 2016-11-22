
var env = require('../../../bridge/config/env');
var SESSION_PREFIX = 'slogupSessionId';
var sessionStore = require('../config/express').sessionSetting.store;
var std = require('../../../bridge/metadata/standards');


var socketUtils = {};

socketUtils.filterQueryFromUrl = function(url){
    var query = {};
    var urlComp = url.split('?');
    if (urlComp.length > 1) {
        var queryComp = urlComp[1].split("&");
        for (var i = 0; i < queryComp.length; ++i) {
            var comp = queryComp[i].split("=");
            query[comp[0]] = decodeURIComponent(comp[1]);
        }
    }
    return query;
};

socketUtils.parseSessionId = function(fullSessionId) {
    var sessionId = fullSessionId;
    sessionId = sessionId.replace(SESSION_PREFIX, "").replace(" ", "");
    sessionId = sessionId.split(".")[0];
    return sessionId;
};

socketUtils.getSessionId = function(cookieName) {
    var sessionData = cookieName.split(";");
    var sessionId = '';

    if (sessionData.length > 1) {
        for (var i = 0; i < sessionData.length; ++i) {
            var charIdx = sessionData[i].indexOf(SESSION_PREFIX);
            if (charIdx > -1) {
                sessionId = this.parseSessionId(sessionData[i]);
                break;
            }
        }
    }
    else {
        sessionId = this.parseSessionId(sessionData[0]);
    }
    //console.log('sessionId',sessionId);
    return sessionId;
};

socketUtils.getCookieFromSessionId = function(cookieName, callback) {
    sessionStore.get(this.getSessionId(cookieName), callback);
};

socketUtils.removeCookieFromSessionId = function(cookieName, callback) {
    sessionStore.destroy(this.getSessionId(cookieName), callback);
};

socketUtils.replaceCookieFromSessionId = function(cookieName, value, callback) {
    sessionStore.set(this.getSessionId(cookieName), value, callback);
};

socketUtils.getConnectedCliendNumber = function(io, matchingId) {
    var clients = io.sockets.adapter.rooms[matchingId];
    return (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;
};

module.exports = socketUtils;