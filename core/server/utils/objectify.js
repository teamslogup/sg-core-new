module.exports = {
    convert: function (data, keyPattern) {

        var result = [];

        keyPattern = {
            posts: [{
                comments: [{
                    tags: []
                }],
            }]
        };

        var hash = {
            posts: {
                k1: 0,
                k2: 1,
                k3: 2
            },
            comments: {
                k1: 0,
                k2: 1,
                k3: 2
            },
            tags: {
                k1: 0,
                k2: 1,
                k3: 2
            }
        };

        for (var i = 0; i < data.length; i++) {
            for (var k in data[i]) {

                hash['posts']['k' + k['posts' + '.id']] = Object.keys(hash['posts']).length;

            }

        }

        // var obecjt = {
        //     post: {
        //         isArray: true,
        //         child: {
        //             comment: {
        //                 isArray: false,
        //                 tag: {
        //                     isArray: true,
        //                 }
        //             },
        //             comment2: {
        //                 isArray: false,
        //                 tag: {
        //                     isArray: true,
        //                 }
        //             },
        //         }
        //     }
        // };

        // for (var i = 0; i < array.length; i++) {
        //     var object = {};
        //     for (var j = 0; j < keyArray.length; j++) {
        //
        //         for (var k in array[i]) {
        //
        //             var key = k.split('.')[0];
        //
        //             if (key == keyArray[j]) {
        //                 object[k] = array[i][k];
        //             } else {
        //                 break;
        //             }
        //         }
        //     }
        // }


    },
    objectify: function (key, value, keyPattern, result, hash) {

        var temp = key.split('.');

        var currentPath = result;

        for (var i = 0; i < temp.length; i++) {
            if (i != temp.length) {
                if (keyPattern[temp[i]]) {
                    if (keyPattern[temp[i]] instanceof Array) {

                        if (currentPath[hash[temp[i]]['k']]) {
                            currentPath = currentPath[currentPath.length - 1];
                        } else {
                            currentPath.push({});
                            currentPath = currentPath[index];
                        }

                    }

                    if (keyPattern[temp[i]] instanceof Object) {

                        if (currentPath[temp[i]]) {
                            currentPath = currentPath[temp[i]];
                        } else {
                            currentPath[temp[i]] = {};
                            currentPath = currentPath[temp[i]];
                        }
                    }
                } else {
                    //에러
                }
            } else {
                currentPath[temp[i]] = value;
            }

        }

        var acb = [{
            id: '',
            title: '',
            comments: [{
                id: '',
                body: '',
                tags: [{
                    id: ''
                }, {
                    id: ''
                }]
            }, {
                id: ''
            }]
        }, {
            id: ''
        }]


    }

};