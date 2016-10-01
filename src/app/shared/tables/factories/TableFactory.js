(function() {

    /**
     * TeableFactory is the service responsible to comunicate with the server and provide all content to the grid
     *
     * @namespace upFrota
     * @method TeableFactory
     * @static
     * @param resource is a factory which creates a resource object that lets you interact with RESTful server-side data sources.
     */

    angular.module('upFrota').factory('TableFactory', TableFactory);

    TableFactory.$inject = ['$resource', '$log', '$state', '$translate'];

    function TableFactory($resource, $log, $state, $translate) {

        var _tableState;
        var _controllerScope;
        var _service;
        var _currentStateName;
        var _params;

        function _factoryParams(tableState, pParams) {
            $log.debug('Initializing the table\'s filters, sorting and pagination.');
            var params = {};
            // send sort options to server.
            if (tableState.sort && tableState.sort.predicate) {
                params.sort = tableState.sort.predicate + "," + (tableState.sort.reverse ? "desc" : "asc");
            }
            // send pagination options to server.
            if (tableState.pagination && tableState.pagination.number) {

                // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var start = tableState.pagination.start || 0;
                // Number of entries showed per page.
                var number = tableState.pagination.number || 15;

                params.size = number;
                params.page = start === 0 ? 0 : Math.ceil(start / number);
            }

            if (tableState.additionalSearch) {
                for (var key in tableState.additionalSearch[i]) {
                    if (tableState.additionalSearch[i][key]) {
                        params[key] = tableState.additionalSearch[i][key].replace(/\@/g, '\\$&');
                    }
                }
            }
            if (pParams !== undefined) {
                for (var i = 0; i < pParams.length; i++) {
                    if (pParams[i][1]) {
                        params[pParams[i][0]] = pParams[i][1].replace(/\@/g, '\\$&');
                    }
                }
            }
            return params;
        }

        var reload = function() {
            _controllerScope.loadData(_tableState);
        };

        var resetPagination = function() {
            if (_tableState.pagination && _tableState.pagination.start) { // Reset pagination to avoid conflicts navigation in the smart table directive
                $log.debug('Reloading pagination.');
                _tableState.pagination.start = 0;
            }
            reload();
        };

        var prepare = function(options) {
            $log.debug('Preparing data loading.');

            options.scope.loadData = function(tableState) {
                $log.debug('Loading table data.');
                options.scope.isLoading = true;

                if (_tableState === undefined || $state.current.name !== _currentStateName) {
                    $log.debug('Initializing current table data.');
                    _tableState = tableState;
                    _controllerScope = options.scope;
                    _service = options.service;
                    _currentStateName = $state.current.name;
                }

                if (angular.isFunction(options.params)) {
                    _params = options.params();
                } else {
                    _params = undefined;
                }

                var params = _factoryParams(tableState, _params);

                var Resource = $resource(_service.url, params);
                var pageable = Resource.get(function() {
                    $log.debug('Initializing pagination.');

                    if (options.isGetAllResponse) {
                        options.setAllResponse(pageable);
                    }

                    options.scope.rows = pageable.content;
                    tableState.pagination.numberOfPages = pageable.totalPages;
                    tableState.pagination.numberOfElements = pageable.totalElements; // This value could be used in the future
                    options.scope.isLoading = false;

                }, function(error) {
                    $log.debug('An error ocurred while loading the pagination.');
                    options.scope.isLoading = false;
                    options.scope.connectionError = true;
                });
            };
        };

        return {
            prepare: prepare,
            reload: reload,
            resetPagination: resetPagination
        };

    }
})();
