export default function noticesManager (Notice) {
    this.findNoticeById = findNoticeById;
    this.updateNoticeById = updateNoticeById;
    this.findNotices = findNotices;
    this.deleteNotice = deleteNotice;
    this.createNotice = createNotice;

    function updateNoticeById (id, notice, callback) {
        var where = {id: id};
        Notice.update(where, notice, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findNoticeById (noticeId, callback) {
        Notice.get({
            id: noticeId
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findNotices (data, callback) {
        var query = {};
        if (data.searchItem !== undefined) query.searchItem = data.searchItem;
        if (data.searchField !== undefined) query.searchField = data.searchField;
        if (data.last !== undefined) query.last = data.last;
        if (data.size !== undefined) query.size = data.size;
        if (data.offset !== undefined) query.offset = data.offset;
        if (data.country !== undefined) query.country = data.country;
        if (data.type !== undefined) query.type = data.type;
        if (data.sort !== undefined) query.sort = data.sort;
        Notice.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function deleteNotice (notice, callback) {
        notice = new Notice(notice);
        notice.$remove(function (data) {
            callback(204);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function createNotice (body, callback) {
        var notice = new Notice(body);
        notice.$save(function (data) {
            callback(201, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}