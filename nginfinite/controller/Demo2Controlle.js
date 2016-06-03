var myApp = angular.module('myApp', ['infinite-scroll']);

myApp.controller('DemoController', function($scope, Reddit) {
    $scope.reddit = new Reddit();
});

// Reddit constructor function to encapsulate HTTP and pagination logic
myApp.factory('Reddit', function($http) {
    var Reddit = function() {
        this.items = [];
        this.busy = false;
        this.page = 1;
        this.load = true;
        this.once = true;
    };


    // Reddit.prototype.nextPage = function() {
    //     if (this.busy) return;
    //     this.busy = true;

    //     var url = "https://api.reddit.com/hot?after=" + this.after + "&jsonp=JSON_CALLBACK";
    //     $http.jsonp(url).success(function(data) {
    //         var items = data.data.children;
    //         console.log(data);
    //         for (var i = 0; i < items.length; i++) {
    //             this.items.push(items[i].data);
    //         }
    //         this.after = "t3_" + this.items[this.items.length - 1].id;
    //         this.busy = false;
    //     }.bind(this));
    // };
    Reddit.prototype.nextP = function() {
        if (this.busy) return;
        this.busy = true;
        if (this.once) {
            $http({
                method: 'POST',
                url: 'http://test.kisenwo.com:1337/Rest/User/BackofficeLogin',
                data: { username: 'test', password: '123456' },
                withCredentials: true
            }).then(function(res) {
                // this.items.push(res.data);
                ht(this);
            }.bind(this));
            this.once = false;
        } else {
            h(this);
        }

        function ht(that) {
            $http({
                method: 'GET',
                url: 'http://test.kisenwo.com:1337/Rest/Content/CatList?catName=PARENTING_TIPS',
                withCredentials: true
            }).then(function(res) {
                h(that);
            })
        }

        function h(that) {
            console.log(that);
            $http({
                method: 'GET',
                url: 'http://test.kisenwo.com:1337/Rest/Content/Lists?catName=TIPS_ZERO_TWO&limit=10&page=' + that.page,
                withCredentials: true
            }).then(function(res) {
                console.log(res.data.data.lists);
                var items = res.data.data.lists;
                if (res.data.data.lists.length != 0) {
                    for (var i = 0; i < items.length; i++) {
                        that.items.push(items[i]);
                    }
                    that.page++;
                    that.busy = false;
                } else {
                    console.log('无数据');
                    that.load = false;
                }


            })
        }
    }
    return Reddit;
});
