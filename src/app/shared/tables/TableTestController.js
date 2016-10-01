(function() {
    angular.module('upFrota').controller('TableTestController', TableTestController);

    TableTestController.$inject = ['TableFactory', 'CrudFactory', 'TableTestService'];

    function TableTestController(TableFactory, CrudFactory, TableTestService) {

        var self = this;

        var _options = {
            scope: self,
            service: TableTestService,
        };
        CrudFactory.prepare(_options);

    }
})();
