var myApp = angular.module('myApp', ['infinite-scroll']);

myApp.controller('DemoController', function($scope, Reddit, $http) {
    // $scope.reddit = new Reddit();
    $scope.items = [];
    $scope.busy = false;
    $scope.page = 1;
    $scope.load = true;
    $scope.once = true;
    $scope.nextPage = function() {
        if ($scope.busy) return;
        $scope.busy = true;
        $http({
            method: 'POST',
            url: 'http://test.kisenwo.com:1337/Rest/User/BackofficeLogin',
            data: { username: 'test', password: '123456' },
            withCredentials: true
        }).then(function(res) {
            // this.items.push(res.data);
            console.log(res);
            getAgeRange()
        });
        function getAgeRange() {
            $http({
                method: 'GET',
                url: 'http://test.kisenwo.com:1337/Rest/Content/CatList?catName=PARENTING_TIPS',
                withCredentials: true
            }).then(function(res) {
                var nameArry = res.data.data
                Reddit.SetNameArry(res.data.data);
                console.log(Reddit.GetNameArry(res.data.data));
                getList();
            })
        }
        function getList() {
            console.log();
            $http({
                method: 'GET',
                url: 'http://test.kisenwo.com:1337/Rest/Content/Lists?catName=TIPS_ZERO_TWO&limit=10&page=' + $scope.page,
                withCredentials: true
            }).then(function(res) {
                console.log(res.data.data.lists);
                var items = res.data.data.lists;
                if (res.data.data.lists.length != 0) {
                    for (var i = 0; i < items.length; i++) {
                        $scope.items.push(items[i]);
                    }
                    $scope.page++;
                    $scope.busy = false;
                } else {
                    console.log('无数据');
                    $scope.load = false;
                }
            })
        }
    }

});

// Reddit constructor function to encapsulate HTTP and pagination logic
myApp.factory('Reddit', function($http) {

      //存储选项类型
    var NameArry = "";
    var ContentList = {
        ContentList1: '',
        ContentList2: '',
        ContentList3: '',
        ContentList4: ''
    }
    return {
        GetNameArry: function() {
            return NameArry;
        },
        SetNameArry: function(dataArr) {
            // console.log(dataArr);
            NameArry = dataArr;
        },
        GetContentList: function(num) {
            return ContentList['ContentList' + num];
        },
        SetContentList: function(num, dataArr) {
            //console.log(dataArr);
            ContentList['ContentList' + num] = dataArr;
        }
    };
});
