angular.module('bodybuilding.services', [])
    .constant('Urls', (function () {
        function url(path) {
            return 'http://localhost:3000' + path;
        }

        return {
            meals: url('/meals'),
            items: url('/items'),
            stats: url('/stats')
        }
    })())
    .factory('Server', function ($http, Urls) {
        return {
            fetchMeals: function () {
                return $http
                    .get(Urls.meals)
                    .then(function (resp) {
                        return resp.data.meals;
                    });
            },
            fetchItems: function () {
                return $http
                    .get(Urls.items)
                    .then(function (resp) {
                        return resp.data.items;
                    });
            },
            fetchStats: function () {
                return $http
                    .get(Urls.stats)
                    .then(function (resp) {
                        return resp.data.stats;
                    });
            },

            updateItems: function (items) {
                return $http
                    .post(Urls.items, items);
            },
            updateStats: function (stats) {
                return $http
                    .post(Urls.stats, stats);
            }
        };
    });