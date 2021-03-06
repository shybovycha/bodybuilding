angular.module('bodybuilding', ['ionic', 'bodybuilding.controllers', 'bodybuilding.services'])
    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('dashboard', {
                url: '/',
                templateUrl: 'templates/dashboard.html',
                controller: 'DashboardCtrl'
            })
            .state('meals-list', {
                url: '/meals-list',
                templateUrl: 'templates/meals-list.html',
                controller: 'MealsListCtrl'
            })
            .state('track-item', {
                url: '/track-item',
                templateUrl: 'templates/track-item.html',
                controller: 'TrackItemCtrl'
            })
            .state('track-weight', {
                url: '/track-weight',
                templateUrl: 'templates/track-weight.html',
                controller: 'TrackWeightCtrl'
            });

        $urlRouterProvider.otherwise('/');
    });
