(function() {
    angular.module('upFrota').directive('tableDisplay', tableDipsplay);

    function tableDipsplay() {
        var link = function(scope, element, attr, ctrl) {};
        var TableDisplayController = function() {
            //var ctrl = this;
        };
        return {
            restrict: 'E',
            require: '^stTable',
            templateUrl: 'templates/shared/tables/directives/table-display.html',
            scope: {},
            bindToController: {
                tableHeaders: '=',
                tableRows: '=',
                isLoading: '=',
                connectionError: '=',
                itemsByPage: '=',
                displayedPages: '='
            },
            controller: TableDisplayController,
            controllerAs: 'ctrl',
            link: link
        };
    }

})();
