/**
 * tableFilterSelect is a directive which does the comunication with the server to filter te result of tableService.js
 */
angular.module('upFrota').directive('tableFilterSelect', tableFilterSelect);

tableFilterSelect.$inject = ['$timeout', '$log', 'appConfig'];

function tableFilterSelect($timeout, $log, appConfig) {

    var link = function(scope, element, attr, ctrl) {

        if (!scope.selectLabel) {
            throw new Error('The select-label property does not exists.');
        } else if (!scope.selectConfig.name) {
            throw new Error('The select-name property does not exists.');
        } else if (!scope.selectValues) {
            throw new Error('The selectValues property does not exists.');
        }

        var _filterTimeout;
        var tableState = ctrl.tableState();

        // In this step the object tableStabe will receive a new attr (additionalSearch).
        // This option will be used in the TableService to generate a dynamic and remote search.
        var _search = function() {
            if (_filterTimeout) $timeout.cancel(_filterTimeout);

            if (!scope.selectedValue || !scope.selectedValue.key) {
                return;
            } // If the search don't have a key the method is aborted
            _filterTimeout = $timeout(function() {
                if (tableState.pagination && tableState.pagination.start) { // Reset pagination to avoid conflicts navigation in the smart table directive
                    tableState.pagination.start = 0;
                }

                var key = scope.selectedValue.key;

                if (!scope.selectConfig.isEqualsSearch) {
                    key = '%' + key + '%';
                }

                var hasProperty = false;
                if (tableState.additionalSearch === undefined) {
                    tableState.additionalSearch = [];
                } else {
                    for (var i = 0; i < tableState.additionalSearch.length; i++) {
                        if (tableState.additionalSearch[i].hasOwnProperty(scope.selectConfig.name)) {
                            console.log('hasOwnProperty');
                            var hasProperty = true;
                            if (scope.selectedValue.key !== '*') {
                                tableState.additionalSearch[i][scope.selectConfig.name] = key;
                            } else {
                                delete tableState.additionalSearch[i][scope.selectConfig.name];
                            }
                        }
                    }

                }

                if (scope.selectedValue.key !== '*' && !hasProperty) {
                    var params = {};
                    params[scope.selectConfig.name] = key;
                    tableState.additionalSearch.push(params);
                }
                // Call the "options.scope.loadData" in the TableService.js
                console.log(tableState);
                ctrl.pipe(tableState);
            }, appConfig.filterDefaultTimeout);

        };

        // Watch the field filter in the directive html
        scope.$watch(function() {
            return scope.selectedValue;
        }, function(newValue, oldValue) {
            if (scope.selectedValue && scope.selectedValue.key) { // If exists a value new search will be made
                $log.debug('By filter');
                _search();
            }
        });
    };
    var controllerFunction = function() {

    };
    return {
        restrict: 'EA',
        require: '^stTable',
        templateUrl: 'app/shared/tables/directives/table-filter-select.html',
        scope: {
            selectLabel: '=',
            selectConfig: '=',
            selectValues: '='
        },
        controller: controllerFunction,
        link: link
    };
}
