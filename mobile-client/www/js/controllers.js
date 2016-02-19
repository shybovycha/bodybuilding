angular.module('bodybuilding.controllers', [])
    .controller('DashboardCtrl', function ($rootScope, $scope, $ionicActionSheet, $q, $state, Server) {
        $rootScope.stats = {};
        $rootScope.items = [];
        $rootScope.meals = [];

        var deferred = $q.defer();

        deferred.promise
            .then(function () {
                return Server.fetchStats();
            })
            .then(function (stats) {
                $rootScope.stats = stats;
            })
            .then(function () {
                return Server.fetchItems();
            })
            .then(function (items) {
                $rootScope.items = items;
            })
            .then(function () {
                return Server.fetchMeals();
            })
            .then(function (meals) {
                $rootScope.meals = meals;
            });

        deferred.resolve();

        $scope.showTrackMenu = function () {
            $ionicActionSheet.show({
                buttons: [
                    { text: 'Food or excercise' },
                    { text: 'Weight' }
                ],
                cancelText: 'Cancel',
                buttonClicked: function(index) {
                    if (index == 0) {
                        return $state.go('track-item');
                    } else if (index == 1) {
                        return $state.go('track-weight');
                    }

                    return true;
                }
            });
        };

        $scope.consumed = function () {
            return $rootScope.items.filter(function (i) { return i.calories > 0; }).reduce(function (acc, i) { return acc + (-1 * i.calories); }, 0);
        };

        $scope.burned = function () {
            return $rootScope.items.filter(function (i) { return i.calories < 0; }).reduce(function (acc, i) { return acc + (-1 * i.calories); }, 0);
        };

        // var weight = $scope.stats.actual_weight;
        // var height = $scope.stats.actual_height;
        // var age = moment($scope.stats.date_of_birth).diff(moment(), 'years');
        // var activityCoefficient = 1.375;
        //
        // var desiredWeightLossPerWeek = 0.5;
        // var desiredLimit = (desiredWeightLossPerWeek * 1000.0 * 9) / 7.0; // calories per week per gramm
        //
        // var MuffinJeffor = 9.99*weight + 6.25*height - 4.92*age + 5;
        // var HurrisBenedict = 66.47 + (13.75*weight) + (5*height) - (6.74*age);
        // var avgNeed = (MuffinJeffor + HurrisBenedict) / 2.0;
        // var draftNeed = avgNeed * activityCoefficient;
        // var need = draftNeed - desiredLimit;

        $scope.limit = function () {};

        $scope.need = function () {};

        $scope.lack = function () {};

        $scope.weightLoss = function () {};
    })
    .controller('TrackItemCtrl', function ($rootScope, $scope, $location, Server) {
        $scope.selectItem = function (item) {
            $scope.selectedItem = item;
        };

        $scope.save = function () {
            $rootScope.items = $rootScope.items.map(function (item) {
                if (item.item == $scope.selectedItem.item) {
                    item.amount += $scope.selectedAmount;
                }

                return item;
            });

            Server
                .updateItems($rootScope.items)
                .then(function () {
                    $location.path('/');
                });
        };

        $scope.cancel = function () {
            $state('/');
        };
    })
    .controller('TrackWeightCtrl', function ($rootScope, $scope, $location, Server) {
        $scope.weight = $rootScope.stats.actual_weight;

        $scope.save = function () {
            $rootScope.stats.actual_weight = $scope.weight;

            Server
                .updateStats($rootScope.stats)
                .then(function () {
                    $location.path('/');
                });
        };
    });
