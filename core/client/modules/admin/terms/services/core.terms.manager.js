export default function termsManager (Terms) {
    this.findTermsById = findTermsById;
    this.updateTermsById = updateTermsById;
    this.findTerms = findTerms;
    this.deleteTerms = deleteTerms;
    this.createTerms = createTerms;

    function updateTermsById (id, Terms, callback) {
        var where = {id: id};
        Terms.update(where, Terms, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findTermsById (termsId, callback) {
        Terms.get({
            id: termsId
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findTerms (data, callback) {
        var query = {};
        if (data.searchItem !== undefined) query.searchItem = data.searchItem;
        if (data.searchField !== undefined) query.searchField = data.searchField;
        if (data.last !== undefined) query.last = data.last;
        if (data.size !== undefined) query.size = data.size;
        if (data.country !== undefined) query.country = data.country;
        if (data.type !== undefined) query.type = data.type;
        if (data.sort !== undefined) query.sort = data.sort;
        Terms.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function deleteTerms (terms, callback) {
        terms = new Terms(terms);
        terms.$remove(function (data) {
            callback(204);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function createTerms (body, callback) {
        var terms = new Terms(body);
        terms.$save(function (data) {
            callback(201, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}