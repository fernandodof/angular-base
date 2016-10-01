(function() {
    'use strict';

    /**
     * Route configuration for the RDash module.
     */
    angular.module('upFrota')
        .config(['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {

                // For unmatched routes
                $urlRouterProvider.otherwise('/');

                // Application routes
                $stateProvider
                    .state('root', {
                        url: '',
                        abstract: true,
                        views: {
                            sidebar: {
                                templateUrl: 'templates/shared/sidebar/sidebar.html'
                            },
                            header: {
                                templateUrl: 'templates/shared/header/header.html'
                            },
                            'main@': {
                                templateUrl: ''
                            }
                        }
                    })
                    .state('index', {
                        url: '/',
                        parent: 'root',
                        views: {
                            main: {
                                templateUrl: 'templates/shared/dashboard/dashboard.html'
                            }
                        }
                    })
                    .state('tables', {
                        url: '/tables',
                        parent: 'root',
                        views: {
                            main: {
                                templateUrl: 'templates/shared/tables/tables.html',
                                controller: 'TableTestController',
                                controllerAs: 'ctrl'
                            }
                        }
                    })
                    .state('modals', {
                        url: '/modals',
                        parent: 'root',
                        views: {
                            main: {
                                templateUrl: 'templates/components/modals-test/modal-test.html',
                                controller: 'ModalTest',
                                controllerAs: 'ctrl'
                            }
                        }
                    });
            }
        ]);
})();
