"use strict";
/**
 * tableFilterInput is a directive which does the comunication with the server to filter te result of tableService.js
 */
angular.module('upFrota').directive('tableFilterInput', tableFilterInput);

tableFilterInput.$inject = ['$timeout', '$log', 'appConfig'];

function tableFilterInput($timeout, $log, appConfig) {

    var link = function(scope, element, attr, ctrl) {

        // Check if property name exists
        if (!scope.inputConfig.name) {
            throw new Error('The input-name property does not exists.');
        }

        var _filterTimeout;
        var tableState = ctrl.tableState();

        // In this step the object tableStabe will receive a new attr (additionalSearch).
        // This option will be used in the TableService to generate a dynamic and remote search.
        var _search = function() {
            if (_filterTimeout) {
                $timeout.cancel(_filterTimeout);
            }

            _filterTimeout = $timeout(function() {
                console.log('___');
                if (tableState.pagination && tableState.pagination.start) { // Reset pagination to avoid conflicts navigation in the smart table directive
                    tableState.pagination.start = 0;
                }

                var value = scope.value;

                if (!scope.inputConfig.isEqualsSearch) {
                    value = '%' + value + '%';
                }

                if (tableState.additionalSearch === undefined) {
                    tableState.additionalSearch = [];
                    var params = {};
                    params[scope.inputConfig.name] = value;
                    tableState.additionalSearch.push(params);
                } else {
                    for (var i = 0; i < tableState.additionalSearch.length; i++) {
                        if (tableState.additionalSearch[i].hasOwnProperty(scope.inputConfig.name)) {
                            if (scope.value) {
                                tableState.additionalSearch[i][scope.inputConfig.name] = value;
                            } else {
                                delete tableState.additionalSearch[i][scope.inputConfig.name];
                            }
                        } else if (scope.value) {
                            var params = {};
                            params[scope.inputConfig.name] = value;
                            tableState.additionalSearch.push(params);
                        }
                    }
                }
                // Call the "options.scope.loadData" in the TableService.js
                ctrl.pipe(tableState);
            }, appConfig.filterDefaultTimeout);

        };

        // Watch the input filter in the directive html
        var valueWatchCalled = 0; // Times of the watch was called
        scope.$watch(function() {
            return scope.value;
        }, function(newValue, oldValue) {
            if (valueWatchCalled === 0) { // Verify if is the first time to this watch, to avoid the table load twice.
                valueWatchCalled = 1;
            } else if (newValue !== oldValue) {
                _search();
                $log.debug('By value');
            }
        });
    };
    return {
        restrict: 'E',
        require: '^stTable',
        templateUrl: 'templates/shared/tables/directives/table-filter-input.html',
        scope: {
            inputLabel: '=',
            inputConfig: '='
        },
        link: link
    };
}
