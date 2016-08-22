mainCtrl.$inject = ['$scope', '$translate', '$location'];

class Hwarang {
    constructor(age) {
        this.age = age;
    }
    getAge() {
        return this.age;
    }
    print() {
        console.log(this.getAge());
    }
}

export default function mainCtrl($scope, $location) {
    // staticLoader.get('route1.json', function (status, data) {
    //     $scope.contents = data;
    // });
    var hwarang = new Hwarang(100);
    hwarang.print();
}
